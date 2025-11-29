from aqt.qt import QAction, QMenu, qconnect
from aqt import mw
import os
from .export_notes import export_notes_json


def add_menu_item():
    """Add menu entry under Tools → Kiku Note Manager"""
    addon_dir = os.path.dirname(__file__)
    is_dev = os.path.exists(os.path.join(addon_dir, "../.env"))

    menu_name = "Kiku Note Manager (dev)" if is_dev else "Kiku Note Manager"
    kiku_menu = QMenu(menu_name, mw)
    mw.form.menuTools.addMenu(kiku_menu)

    export_action = QAction("Generate notes cache", mw)
    qconnect(export_action.triggered, export_notes_json)
    kiku_menu.addAction(export_action)
