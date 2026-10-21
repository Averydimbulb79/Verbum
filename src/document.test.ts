import { describe, expect, it } from 'vitest';
import { parseDocument, serializeDocument } from './document';
describe('native document', () => {
  it('round trips structured content', () => {
    const content = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }] };
    const saved = serializeDocument('Test', content);
    expect(parseDocument(saved).content).toEqual(content);
  });
  it('rejects older documents rather than silently dropping content', () => {
    expect(() => parseDocument(JSON.stringify({ version: 2, html: '<p>Old</p>' }))).toThrow(/migration importer/);
  });
});
