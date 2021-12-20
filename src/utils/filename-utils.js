export function getNewFilename(fileName, existingFileNames) {
  const existingFileNamesSet = new Set(existingFileNames);

  let newFileName = `Copy of ${fileName}`;
  while (existingFileNamesSet.has(newFileName)) {
    newFileName = `Copy of ${newFileName}`;
  }

  return newFileName;
}

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
