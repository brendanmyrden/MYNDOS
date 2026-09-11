export type MediaKind = "image" | "video";

export type StoredMediaPost = {
  id: string;
  moduleName: string;
  kind: MediaKind;
  fileName: string;
  caption: string;
  createdAt: number;
  blob: Blob;
};

const DATABASE_NAME = "myndos-media-board";
const DATABASE_VERSION = 1;
const STORE_NAME = "posts";
const MODULE_INDEX = "moduleName";
export const MAX_MEDIA_FILE_BYTES = 150 * 1024 * 1024;

let databasePromise: Promise<IDBDatabase> | null = null;

const openDatabase = () => {
  if (databasePromise) return databasePromise;

  databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Media storage is not available in this browser."));
      return;
    }

    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onerror = () => reject(request.error ?? new Error("Unable to open media storage."));
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (database.objectStoreNames.contains(STORE_NAME)) return;
      const store = database.createObjectStore(STORE_NAME, { keyPath: "id" });
      store.createIndex(MODULE_INDEX, MODULE_INDEX, { unique: false });
    };
  });

  return databasePromise;
};

const waitForTransaction = (transaction: IDBTransaction) =>
  new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(transaction.error ?? new Error("The media storage operation failed."));
    transaction.onabort = () =>
      reject(transaction.error ?? new Error("The media storage operation was cancelled."));
  });

const createPostId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const getMediaKind = (file: File): MediaKind | null => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return null;
};

export const getMediaPosts = async (moduleName: string): Promise<StoredMediaPost[]> => {
  const database = await openDatabase();
  const transaction = database.transaction(STORE_NAME, "readonly");
  const request = transaction.objectStore(STORE_NAME).index(MODULE_INDEX).getAll(moduleName);

  const posts = await new Promise<StoredMediaPost[]>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as StoredMediaPost[]);
    request.onerror = () => reject(request.error ?? new Error("Unable to load media posts."));
  });

  return posts.sort((a, b) => b.createdAt - a.createdAt);
};

export const saveMediaPost = async (moduleName: string, file: File, caption: string) => {
  const kind = getMediaKind(file);
  if (!kind) throw new Error("Choose an image or video file.");
  if (file.size > MAX_MEDIA_FILE_BYTES) {
    throw new Error("Choose a file smaller than 150 MB.");
  }

  const database = await openDatabase();
  const transaction = database.transaction(STORE_NAME, "readwrite");
  const post: StoredMediaPost = {
    id: createPostId(),
    moduleName,
    kind,
    fileName: file.name,
    caption: caption.trim(),
    createdAt: Date.now(),
    blob: file,
  };

  transaction.objectStore(STORE_NAME).add(post);
  await waitForTransaction(transaction);
  return post;
};

export const removeMediaPost = async (postId: string) => {
  const database = await openDatabase();
  const transaction = database.transaction(STORE_NAME, "readwrite");
  transaction.objectStore(STORE_NAME).delete(postId);
  await waitForTransaction(transaction);
};
