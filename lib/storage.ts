import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';

import { DocumentRecord } from './types';

const INDEX_KEY = 'campaper.documents.index';
const documentsDir = new Directory(Paths.document, 'campaper');

function ensureDocumentsDir() {
  if (!documentsDir.exists) {
    documentsDir.create({ intermediates: true, idempotent: true });
  }
}

function pagesDirFor(id: string): Directory {
  return new Directory(documentsDir, `${id}-pages`);
}

/** Overwrites the page images for a document, replacing any existing ones. */
function writePages(id: string, pagesBase64: string[]): string[] {
  const dir = pagesDirFor(id);
  if (dir.exists) {
    dir.delete();
  }
  dir.create({ intermediates: true, idempotent: true });

  return pagesBase64.map((base64, index) => {
    const file = new File(dir, `page-${index}.jpg`);
    file.create({ intermediates: true, overwrite: true });
    file.write(base64, { encoding: 'base64' });
    return file.uri;
  });
}

async function readIndex(): Promise<DocumentRecord[]> {
  const raw = await AsyncStorage.getItem(INDEX_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as DocumentRecord[];
  } catch {
    return [];
  }
}

async function writeIndex(records: DocumentRecord[]) {
  await AsyncStorage.setItem(INDEX_KEY, JSON.stringify(records));
}

export async function listDocuments(): Promise<DocumentRecord[]> {
  const records = await readIndex();
  return records.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getDocument(id: string): Promise<DocumentRecord | undefined> {
  const records = await readIndex();
  return records.find((doc) => doc.id === id);
}

export function documentFileExists(pdfUri: string): boolean {
  return new File(pdfUri).exists;
}

export async function saveDocument(params: {
  name: string;
  pdfBase64: string;
  pagesBase64: string[];
}): Promise<DocumentRecord> {
  ensureDocumentsDir();

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const destFile = new File(documentsDir, `${id}.pdf`);
  destFile.create({ intermediates: true, overwrite: true });
  destFile.write(params.pdfBase64, { encoding: 'base64' });

  const pageUris = writePages(id, params.pagesBase64);

  const record: DocumentRecord = {
    id,
    name: params.name,
    pdfUri: destFile.uri,
    pageUris,
    pageCount: pageUris.length,
    createdAt: Date.now(),
  };

  const records = await readIndex();
  records.push(record);
  await writeIndex(records);

  return record;
}

/**
 * Replaces a document's page images and PDF wholesale. Used by the page editor for
 * adding, deleting, and replacing pages — the caller submits the full new ordered
 * page list rather than an incremental diff.
 */
export async function updateDocumentPages(params: {
  id: string;
  pagesBase64: string[];
  pdfBase64: string;
}): Promise<DocumentRecord | undefined> {
  const records = await readIndex();
  const record = records.find((doc) => doc.id === params.id);
  if (!record) return undefined;

  const destFile = new File(record.pdfUri);
  destFile.create({ intermediates: true, overwrite: true });
  destFile.write(params.pdfBase64, { encoding: 'base64' });

  const pageUris = writePages(params.id, params.pagesBase64);
  record.pageUris = pageUris;
  record.pageCount = pageUris.length;

  await writeIndex(records);
  return record;
}

export async function renameDocument(id: string, name: string): Promise<DocumentRecord | undefined> {
  const records = await readIndex();
  const record = records.find((doc) => doc.id === id);
  if (!record) return undefined;

  record.name = name;
  await writeIndex(records);
  return record;
}

export async function deleteDocument(id: string): Promise<void> {
  const records = await readIndex();
  const record = records.find((doc) => doc.id === id);
  if (record) {
    const file = new File(record.pdfUri);
    if (file.exists) {
      file.delete();
    }
    const pagesDir = pagesDirFor(id);
    if (pagesDir.exists) {
      pagesDir.delete();
    }
  }
  await writeIndex(records.filter((doc) => doc.id !== id));
}
