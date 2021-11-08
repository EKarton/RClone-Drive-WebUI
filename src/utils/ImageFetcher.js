export default class ImageFetcher {
  constructor(rCloneClient, cache) {
    this.rCloneClient = rCloneClient;
    this.cache = cache;
  }

  async getImage(remote, folderPath, fileName) {
    const key = `${remote}:${folderPath}/${fileName}`;

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const response = await this.rCloneClient.fetchFileContents(
      remote,
      folderPath,
      fileName
    );

    this.cache.set(key, response);
    return response;
  }
}
