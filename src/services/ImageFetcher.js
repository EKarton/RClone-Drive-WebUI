export default class ImageFetcher {
  constructor(rCloneClient, cache) {
    this.rCloneClient = rCloneClient;
    this.cache = cache;
  }

  async getImage(remote, dirPath, fileName, opts) {
    const key = `${remote}:${dirPath}/${fileName}`;

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const response = await this.rCloneClient.fetchFileContents(
      remote,
      dirPath,
      fileName,
      opts
    );

    this.cache.set(key, response);
    return response;
  }
}
