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
  pageCount: number;
}): Promise<DocumentRecord> {
  ensureDocumentsDir();

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const destFile = new File(documentsDir, `${id}.pdf`);
  destFile.create({ intermediates: true, overwrite: true });
  destFile.write(params.pdfBase64, { encoding: 'base64' });

  const record: DocumentRecord = {
    id,
    name: params.name,
    pdfUri: destFile.uri,
    pageCount: params.pageCount,
    createdAt: Date.now(),
  };

  const records = await readIndex();
  records.push(record);
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
  }
  await writeIndex(records.filter((doc) => doc.id !== id));
}
