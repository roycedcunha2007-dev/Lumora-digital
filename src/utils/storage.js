const KEY_THEME = 'figmalite_theme';
const KEY_LAST_PROJECT_ID = 'figmalite_last_project_id';
const KEY_UI_PREFS = 'figmalite_ui_prefs';
export function getStoredTheme() {
  try {
    return localStorage.getItem(KEY_THEME) || 'dark';
  } catch (e) {
    return 'dark';
  }
}
export function setStoredTheme(theme) {
  try {
    localStorage.setItem(KEY_THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
}
export function getLastProjectId() {
  try {
    return localStorage.getItem(KEY_LAST_PROJECT_ID) || null;
  } catch (e) {
    return null;
  }
}
export function setLastProjectId(id) {
  try {
    if (id) {
      localStorage.setItem(KEY_LAST_PROJECT_ID, id);
    } else {
      localStorage.removeItem(KEY_LAST_PROJECT_ID);
    }
  } catch (e) {}
}
export function getStoredUIPrefs() {
  try {
    const raw = localStorage.getItem(KEY_UI_PREFS);
    return raw ? JSON.parse(raw) : { showGrid: true, gridType: 'dots', showRulers: true, snapToObjects: true, snapToGrid: false };
  } catch (e) {
    return { showGrid: true, gridType: 'dots', showRulers: true, snapToObjects: true, snapToGrid: false };
  }
}
export function setStoredUIPrefs(prefs) {
  try {
    localStorage.setItem(KEY_UI_PREFS, JSON.stringify(prefs));
  } catch (e) {}
}