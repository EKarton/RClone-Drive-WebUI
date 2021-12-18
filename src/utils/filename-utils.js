export function getNewFilename(fileName, existingFileNames) {
  const existingFileNamesSet = new Set(existingFileNames);

  let newFileName = `Copy of ${fileName}`;
  while (existingFileNamesSet.has(newFileName)) {
    newFileName = `Copy of ${newFileName}`;
  }

  return newFileName;
}
