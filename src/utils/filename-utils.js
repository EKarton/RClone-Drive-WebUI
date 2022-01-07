/**
 * Returns the full path of a directory path and a base name
 * @param {string} directoryPath the directory path
 * @param {string} baseName the base name
 * @returns {string} the full path
 */
export function getFullPath(directoryPath, baseName) {
  if (directoryPath && baseName) {
    return `${directoryPath}/${baseName}`;
  }

  if (!directoryPath && baseName) {
    return baseName;
  }

  return directoryPath;
}

/**
 * Gets a new file name that is not an existing file name
 * @param {string} fileName the file name
 * @param {string[]} existingFileNames a list of existing file names
 * @returns {string} the new file name
 */
export function getNewFilename(fileName, existingFileNames) {
  const existingFileNamesSet = new Set(existingFileNames);

  let newFileName = `Copy of ${fileName}`;
  while (existingFileNamesSet.has(newFileName)) {
    newFileName = `Copy of ${newFileName}`;
  }

  return newFileName;
}

/**
 * Gets a new folder name that is not an existing folder name
 * @param {string[]} existingFolderNames a list of existing folder names
 * @returns {string} a new folder name
 */
export function getNewFolderName(existingFolderNames) {
  const existingFoldersSet = new Set(existingFolderNames);

  let newFolderNum = 0;
  let newFolderName = 'New Folder';

  while (existingFoldersSet.has(newFolderName)) {
    newFolderNum += 1;
    newFolderName = `New Folder ${newFolderNum}`;
  }

  return newFolderName;
}
