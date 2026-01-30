export async function loadRemoteModule(
  remoteName: string,
  moduleName: string
) {
  try {
    const module = await import(`${remoteName}/${moduleName}`);
    return module;
  } catch (error) {
    console.error('Failed to load remote module:', error);
    return null;
  }
}