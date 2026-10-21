export const NATIVE_VERSION = 3;
export type VerbumDocument = { version: 3; name: string; content: unknown; savedAt: string };
export function serializeDocument(name: string, content: unknown): string {
  return JSON.stringify({ version: NATIVE_VERSION, name, content, savedAt: new Date().toISOString() } satisfies VerbumDocument, null, 2);
}
export function parseDocument(raw: string): VerbumDocument {
  const data: unknown = JSON.parse(raw);
  if (!data || typeof data !== 'object' || !('version' in data) || data.version !== NATIVE_VERSION || !('content' in data) || !('name' in data) || typeof data.name !== 'string') {
    throw new Error('Unsupported document format. Existing v1 .verbum files require the migration importer.');
  }
  return data as VerbumDocument;
}
