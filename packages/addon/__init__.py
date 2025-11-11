from aqt import mw
from aqt.qt import QAction, qconnect
from aqt.utils import showInfo
from aqt.operations import QueryOp
from anki.collection import Collection

import json
import os
import gzip
import time
import traceback
from datetime import datetime


def export_notes_background(col: Collection) -> str:
    """Runs in a background thread; returns manifest path when done."""
    db = col.db
    if not db:
        raise Exception("No database open.")

    profile_name = mw.pm.name
    media_dir = col.media.dir()

    # Get all note IDs first
    note_ids = db.list("SELECT id FROM notes")
    total = len(note_ids)
    if total == 0:
        raise Exception("No notes found.")

    chunks = {i: [] for i in range(10)}
    stats = {i: {"count": 0, "min": None, "max": None} for i in range(10)}

    last_progress = 0
    processed = 0

    # --- Stage 1: Export note data ---
    for nid in note_ids:
        note = col.get_note(nid)
        model = note.note_type()
        if not model:
            continue
        model_name = model["name"]

        card_ids = db.list("SELECT id FROM cards WHERE nid=?", nid)

        field_objs = {}
        for order, f in enumerate(model["flds"]):
            name = f["name"]
            value = note.fields[order] if order < len(note.fields) else ""
            field_objs[name] = {"order": order, "value": value}

        note_json = {
            "cards": card_ids,
            "fields": field_objs,
            "mod": note.mod,
            "modelName": model_name,
            "noteId": note.id,
            "profile": profile_name,
            "tags": note.tags,
        }

        chunk_index = note.id % 10
        chunks[chunk_index].append(note_json)

        s = stats[chunk_index]
        s["count"] += 1
        s["min"] = note.id if s["min"] is None else min(s["min"], note.id)
        s["max"] = note.id if s["max"] is None else max(s["max"], note.id)

        processed += 1

        # Update progress every ~0.1s
        now = time.time()
        if now - last_progress >= 0.1:
            percent = (processed / total) * 100
            mw.taskman.run_on_main(
                lambda: mw.progress.update(
                    label=f"Exporting notes... {processed}/{total} ({percent:.1f}%)",
                    value=processed,
                    max=total,
                )
            )
            last_progress = now

    # --- Stage 2: Write chunk files ---
    total_notes = 0
    manifest_chunks = []

    # Reset progress bar for chunk writing
    mw.taskman.run_on_main(
        lambda: mw.progress.update(label="Writing chunk files...", value=0, max=10)
    )

    for i in range(10):
        chunk_data = chunks[i]
        if not chunk_data:
            # Still increment progress for empty chunks to keep it smooth
            mw.taskman.run_on_main(
                lambda i=i: mw.progress.update(
                    label=f"Writing chunk files... ({i + 1}/10)",
                    value=i + 1,
                    max=10,
                )
            )
            continue

        filename = f"_kiku_notes_{i}.json.gz"
        chunk_path = os.path.join(media_dir, filename)
        with gzip.open(chunk_path, "wt", encoding="utf-8") as f:
            json.dump(chunk_data, f, ensure_ascii=False)

        total_notes += len(chunk_data)
        manifest_chunks.append(
            {
                "file": filename,
                "count": stats[i]["count"],
                "range": [stats[i]["min"], stats[i]["max"]],
            }
        )

        # Update chunk progress
        mw.taskman.run_on_main(
            lambda i=i: mw.progress.update(
                label=f"Writing chunk files... ({i + 1}/10)",
                value=i + 1,
                max=10,
            )
        )

    # --- Stage 3: Write manifest ---
    mw.taskman.run_on_main(
        lambda: mw.progress.update(label="Writing manifest...", value=10, max=10)
    )

    manifest = {
        "profile": profile_name,
        "totalNotes": total_notes,
        "chunks": manifest_chunks,
        "generatedAt": datetime.now().timestamp() * 1000,
    }

    manifest_path = os.path.join(media_dir, "_kiku_notes_manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    return f"✅ Exported {total_notes} notes.\nManifest: {manifest_path}"


def on_export_success(message: str):
    showInfo(message)


def on_export_failed(exc: Exception):
    showInfo(f"❌ Failed to export notes:\n{exc}\n\n{traceback.format_exc()}")


def export_notes_json():
    op = QueryOp(
        parent=mw,
        op=lambda col: export_notes_background(col),
        success=on_export_success,
    ).with_progress(label="Exporting notes...")
    op.failure(on_export_failed)
    op.run_in_background()


def add_menu_item():
    action = QAction("Export Notes JSON (with Chunk Progress)", mw)
    qconnect(action.triggered, export_notes_json)
    mw.form.menuTools.addAction(action)


add_menu_item()
