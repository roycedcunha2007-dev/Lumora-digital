const DB_NAME = 'FigmaLiteDB';
const DB_VERSION = 2;
const STORE_PROJECTS = 'projects';
const STORE_ASSETS = 'assets';
const STORE_SNAPSHOTS = 'snapshots';
const STORE_RECOVERY = 'recovery';
let dbInstance = null;
export function openDB() {
  if (dbInstance) return Promise.resolve(dbInstance);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
        const projectStore = db.createObjectStore(STORE_PROJECTS, { keyPath: 'id' });
        projectStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_ASSETS)) {
        db.createObjectStore(STORE_ASSETS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_SNAPSHOTS)) {
        const snapStore = db.createObjectStore(STORE_SNAPSHOTS, { keyPath: 'id' });
        snapStore.createIndex('projectId', 'projectId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_RECOVERY)) {
        db.createObjectStore(STORE_RECOVERY, { keyPath: 'id' });
      }
    };
    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}
export async function saveProjectToDB(project) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_PROJECTS], 'readwrite');
      const store = tx.objectStore(STORE_PROJECTS);
      const cleanProject = {
        ...project,
        updatedAt: new Date().toISOString(),
      };
      const req = store.put(cleanProject);
      req.onsuccess = () => resolve(cleanProject);
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    return null;
  }
}
export async function getProjectFromDB(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_PROJECTS], 'readonly');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    return null;
  }
}
export async function getAllProjectsFromDB() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_PROJECTS], 'readonly');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.getAll();
      req.onsuccess = () => {
        const results = req.result || [];
        results.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
        resolve(results);
      };
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    return [];
  }
}
export async function deleteProjectFromDB(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_PROJECTS], 'readwrite');
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    return false;
  }
}
export async function saveAssetToDB(id, dataUrlOrBlob) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_ASSETS], 'readwrite');
      const store = tx.objectStore(STORE_ASSETS);
      const req = store.put({ id, data: dataUrlOrBlob, createdAt: Date.now() });
      req.onsuccess = () => resolve(id);
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    return null;
  }
}
export async function getAssetFromDB(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_ASSETS], 'readonly');
      const store = tx.objectStore(STORE_ASSETS);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result ? req.result.data : null);
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    return null;
  }
}
export async function saveSnapshotToDB(projectId, snapshotName, projectData) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_SNAPSHOTS], 'readwrite');
      const store = tx.objectStore(STORE_SNAPSHOTS);
      const snap = {
        id: `snap_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        projectId,
        name: snapshotName || 'Snapshot',
        timestamp: new Date().toISOString(),
        data: JSON.parse(JSON.stringify(projectData)),
      };
      const req = store.put(snap);
      req.onsuccess = () => resolve(snap);
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    return null;
  }
}
export async function getSnapshotsFromDB(projectId) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_SNAPSHOTS], 'readonly');
      const store = tx.objectStore(STORE_SNAPSHOTS);
      const req = store.getAll();
      req.onsuccess = () => {
        const list = (req.result || []).filter((s) => !projectId || s.projectId === projectId);
        list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        resolve(list);
      };
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    return [];
  }
}
export async function deleteSnapshotFromDB(snapshotId) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_SNAPSHOTS], 'readwrite');
      const store = tx.objectStore(STORE_SNAPSHOTS);
      const req = store.delete(snapshotId);
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    return false;
  }
}
export async function saveRecoveryCheckpoint(projectData) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_RECOVERY], 'readwrite');
      const store = tx.objectStore(STORE_RECOVERY);
      const record = {
        id: 'latest_recovery_checkpoint',
        timestamp: new Date().toISOString(),
        data: JSON.parse(JSON.stringify(projectData)),
      };
      const req = store.put(record);
      req.onsuccess = () => resolve(record);
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    return null;
  }
}
export async function getRecoveryCheckpoint() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_RECOVERY], 'readonly');
      const store = tx.objectStore(STORE_RECOVERY);
      const req = store.get('latest_recovery_checkpoint');
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    return null;
  }
}
export async function clearRecoveryCheckpoint() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([STORE_RECOVERY], 'readwrite');
      const store = tx.objectStore(STORE_RECOVERY);
      const req = store.delete('latest_recovery_checkpoint');
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    return false;
  }
}