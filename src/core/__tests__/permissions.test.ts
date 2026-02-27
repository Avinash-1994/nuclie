import path from 'path';
import { PermissionManager } from '../permissions.js';

describe('PermissionManager path boundaries', () => {
  it('allows file access inside allowed directory', () => {
    const manager = new PermissionManager({ read: ['allowed'] }, '/repo');
    expect(manager.canRead('allowed/file.txt')).toBe(true);
  });

  it('denies sibling path prefix escape (allowed vs allowed-evil)', () => {
    const manager = new PermissionManager({ read: ['allowed'] }, '/repo');
    expect(manager.canRead('allowed-evil/secrets.txt')).toBe(false);
  });

  it('denies parent traversal attempts', () => {
    const manager = new PermissionManager({ write: ['safe'] }, '/repo');
    expect(manager.canWrite(path.join('safe', '..', '..', 'etc', 'passwd'))).toBe(false);
  });
});
