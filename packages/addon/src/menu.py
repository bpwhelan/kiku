from aqt.qt import QAction, QMenu, qconnect
from aqt import mw
import os
import json

from .export_notes import export_notes_json
from .delete_media import confirm_and_delete_kiku_media


def add_menu_item():
    def get_addon_version() -> str:
        manifest_path = os.path.join(addon_dir, "manifest.json")
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                manifest = json.load(f)
            return manifest.get("version", "unknown")
        except Exception:
            return "unknown"

    addon_dir = os.path.join(os.path.dirname(__file__), "..")
    is_dev = os.path.exists(os.path.join(addon_dir, ".env"))
    version = get_addon_version()

    # Final menu name
    if is_dev:
        menu_name = f"Kiku Note Manager (dev) — v{version}"
    else:
        menu_name = f"Kiku Note Manager — v{version}"

    # Create menu
    kiku_menu = QMenu(menu_name, mw)
    mw.form.menuTools.addMenu(kiku_menu)

    # Export notes
    export_action = QAction("Generate notes cache", mw)
    qconnect(export_action.triggered, export_notes_json)
    kiku_menu.addAction(export_action)

    # Delete media
    clean_media_action = QAction("Delete Kiku files", mw)
    qconnect(clean_media_action.triggered, confirm_and_delete_kiku_media)
    kiku_menu.addAction(clean_media_action)

