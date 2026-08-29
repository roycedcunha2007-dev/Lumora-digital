export const SHORTCUT_CATEGORIES = [
  {
    category: 'Essential Tools',
    shortcuts: [
      { key: 'V', description: 'Move / Selection Tool' },
      { key: 'H', description: 'Hand / Pan Tool' },
      { key: 'F', description: 'Frame Tool' },
      { key: 'R', description: 'Rectangle Tool' },
      { key: 'O', description: 'Ellipse / Circle Tool' },
      { key: 'L', description: 'Line Tool' },
      { key: 'T', description: 'Text Tool' },
      { key: 'P', description: 'Vector Pen Tool' },
      { key: 'Shift + P', description: 'Freehand Pencil Tool' },
      { key: 'C', description: 'Add Comment' },
      { key: 'Z', description: 'Zoom Tool' },
    ]
  },
  {
    category: 'Edit & Manipulation',
    shortcuts: [
      { key: 'Ctrl + Z', description: 'Undo' },
      { key: 'Ctrl + Shift + Z', description: 'Redo (or Ctrl + Y)' },
      { key: 'Ctrl + C', description: 'Copy Selection' },
      { key: 'Ctrl + X', description: 'Cut Selection' },
      { key: 'Ctrl + V', description: 'Paste' },
      { key: 'Ctrl + D', description: 'Duplicate in place' },
      { key: 'Delete / Backspace', description: 'Delete selected objects' },
      { key: 'Ctrl + G', description: 'Group selection' },
      { key: 'Ctrl + Shift + G', description: 'Ungroup selection' },
      { key: 'Ctrl + Alt + K', description: 'Create Master Component' },
      { key: 'Ctrl + L', description: 'Toggle Lock / Unlock' },
      { key: 'Ctrl + Shift + H', description: 'Toggle Hide / Show' },
      { key: 'Ctrl + [', description: 'Send Backward' },
      { key: 'Ctrl + ]', description: 'Bring Forward' },
      { key: 'Ctrl + Shift + [', description: 'Send to Back' },
      { key: 'Ctrl + Shift + ]', description: 'Bring to Front' },
    ]
  },
  {
    category: 'View & Navigation',
    shortcuts: [
      { key: 'Space + Drag', description: 'Pan Canvas' },
      { key: 'Middle Mouse Drag', description: 'Pan Canvas' },
      { key: 'Ctrl + Wheel', description: 'Zoom in / out' },
      { key: 'Ctrl + + / -', description: 'Zoom in / out' },
      { key: 'Shift + 1', description: 'Zoom to Fit All' },
      { key: 'Shift + 2', description: 'Zoom to Selection' },
      { key: 'Ctrl + 0', description: 'Zoom to 100%' },
      { key: "Ctrl + '", description: 'Toggle Canvas Grid' },
      { key: 'Ctrl + R', description: 'Toggle Canvas Rulers' },
      { key: 'Ctrl + K', description: 'Open Command Palette' },
      { key: 'Ctrl + /', description: 'Keyboard Shortcuts Help' },
    ]
  },
  {
    category: 'Transform & Movement',
    shortcuts: [
      { key: 'Arrow Keys', description: 'Nudge 1px' },
      { key: 'Shift + Arrow Keys', description: 'Nudge 10px' },
      { key: 'Alt + Drag', description: 'Duplicate while dragging' },
      { key: 'Alt (Hover)', description: 'Show distance measurements in px' },
      { key: 'Shift + Drag', description: 'Lock aspect ratio or 45° angle' },
      { key: 'Escape', description: 'Deselect / Cancel active tool / Exit Present' },
    ]
  }
];