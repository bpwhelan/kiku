from aqt import mw
from anki.hooks import addHook
from .export_notes import export_notes_json


def on_profile_loaded():
    """Auto-run export if enabled in config."""
    config = mw.addonManager.getConfig(__name__) or {}
    if config.get("export_notes_run_on_start", False):
        export_notes_json()


def register_hooks():
    addHook("profileLoaded", on_profile_loaded)
