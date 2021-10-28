import axios from "axios";

export default class RCloneClient {
  constructor(endpoint, username, password) {
    this.axiosInstance = axios.create({
      responseType: "json",
      baseURL: endpoint,
      headers: {
        "Content-Type": "application/json",
      },
      auth: {
        username,
        password,
      },
    });
  }

  /**
   * Fetches and returns a list of remotes
   * @returns {Array<String>} a list of remotes
   */
  async fetchRemotes() {
    const { data } = await this.axiosInstance.post("config/listremotes");
    return data.remotes;
  }

  /**
   * Fetches a list of files and folders under a particular path in a remote
   * It returns a list of objects, where each object has this shape:
   *
   * {
   *   "Path": <the current path of the folder / file >,
   *   "Name": <the name of the folder or file>,
   *   "Size": <the size of the folder or file, in bytes>,
   *   "MimeType": <the type (ex: "inode/directory")>,
   *   "ModTime": <the time this folder / file was updated, in ISO 8601 format>,
   *   "IsDir": <true if it is a directory; else false>,
   *   "ID": <the id of this object>
   * }
   *
   * @returns {Array<Object>} a list of files
   */
  async fetchFiles(remote, path) {
    const { data } = await this.axiosInstance.post("operations/list", {
      fs: `${remote}:`,
      remote: `${path}`,
    });

    return data.list;
  }

  /**
   * Fetches a list of pictures under a particular path in a remote
   * It returns a list of objects, where each object has this shape:
   *
   * {
   *   "Path": <the current path of the folder / file >,
   *   "Name": <the name of the folder or file>,
   *   "Size": <the size of the folder or file, in bytes>,
   *   "MimeType": <the type (ex: "image/png")>,
   *   "ModTime": <the time this folder / file was updated, in ISO 8601 format>,
   *   "IsDir": <true if it is a directory; else false>,
   *   "ID": <the id of this object>
   * }
   *
   * @returns {Array<Object>} a list of files
   */
  async fetchPictures(remote, path) {
    const { data } = await this.axiosInstance.post("operations/list", {
      fs: `${remote}:`,
      remote: `${path}`,
      opt: {
        recurse: true,
        filesOnly: true,
      },
      _filter: {
        IncludeRule: [
          "*.png",
          "*.PNG",
          "*.jpg",
          "*.JPG",
          "*.jpeg",
          "*.JPEG",
          "*.bmp",
          "*.BMP",
          "*.gif",
          "*.GIF",
          "*.heic",
          "*.HEIC",
        ],
      },
    });

    return data.list;
  }

  async fetchFileContents(remote, folderPath, fileName) {
    const remotePath = `${remote}:${folderPath}`;
    const url = encodeURI(`[${remotePath}]/${fileName}`);

    const { data } = await this.axiosInstance.get(url, {
      responseType: "blob",
    });

    return data;
  }
}
