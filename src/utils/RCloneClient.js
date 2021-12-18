import axios from 'axios';

export default class RCloneClient {
  constructor(endpoint, username, password) {
    this.axiosInstance = axios.create({
      responseType: 'json',
      baseURL: endpoint,
      headers: {
        'Content-Type': 'application/json',
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
    const { data } = await this.axiosInstance.post('config/listremotes');
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
    const { data } = await this.axiosInstance.post('operations/list', {
      fs: `${remote}:`,
      remote: `${path}`,
      _config: {
        UseListR: true,
      },
    });

    return data.list;
  }

  async fetchSubFolders(remote, path) {
    const { data } = await this.axiosInstance.post('operations/list', {
      fs: `${remote}:`,
      remote: `${path}`,
      opt: {
        dirsOnly: true,
      },
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
    const { data } = await this.axiosInstance.post('operations/list', {
      fs: `${remote}:`,
      remote: `${path}`,
      opt: {
        recurse: true,
        filesOnly: true,
      },
      _config: {
        UseListR: true,
      },
      _filter: {
        IncludeRule: [
          '*.png',
          '*.PNG',
          '*.jpg',
          '*.JPG',
          '*.jpeg',
          '*.JPEG',
          '*.bmp',
          '*.BMP',
          '*.gif',
          '*.GIF',
          '*.heic',
          '*.HEIC',
        ],
      },
    });

    return data.list;
  }

  /**
   * Returns the file contents of a particular file in a remote
   * @param {string} remote the name of the remote
   * @param {string} folderPath the folder path
   * @param {string} fileName the file name
   * @returns {string} the blob contents of the file
   */
  async fetchFileContents(remote, folderPath, fileName) {
    const remotePath = `${remote}:${folderPath}`;
    const url = encodeURI(`[${remotePath}]/${fileName}`);

    const response = await this.axiosInstance.get(url, {
      responseType: 'blob',
    });

    return response;
  }

  /**
   * Returns the space info of a remote
   * The response returned is:
   * {
   *   "free": number,
   *   "other": number,
   *   "total": number,
   *   "trashed": number,
   *   "used": number
   *  }
   *
   * @param {string} remote the remote
   * @returns {object} the space info
   */
  async fetchRemoteSpaceInfo(remote) {
    const { data } = await this.axiosInstance.post('operations/about', {
      fs: `${remote}:`,
    });

    return data;
  }

  /**
   * Returns the remote info
   * @param {string} remote the remote
   * @returns {object} the info of the remote
   */
  async fetchRemoteInfo(remote) {
    const { data } = await this.axiosInstance.post('config/get', {
      name: remote,
    });

    return data;
  }

  async uploadFiles(remote, folderPath, data) {
    const formData = new FormData();
    formData.append('file', data);

    const url = `operations/uploadfile?fs=${remote}:&remote=${folderPath}`;

    await this.axiosInstance.post(url.toString(), formData);
  }

  async deleteDirectory(remote, folderPath, folderName) {
    await this.axiosInstance.post('operations/purge', {
      fs: `${remote}:`,
      remote: this.getRemoteString(folderPath, folderName),
    });
  }

  async deleteFile(remote, folderPath, fileName) {
    await this.axiosInstance.post('operations/deletefile', {
      fs: `${remote}:`,
      remote: this.getRemoteString(folderPath, fileName),
    });
  }

  async copyFile(source, target) {
    await this.axiosInstance.post('operations/copyfile', {
      srcFs: `${source.remote}:`,
      srcRemote: this.getRemoteString(source.folderPath, source.fileName),
      dstFs: `${target.remote}:`,
      dstRemote: this.getRemoteString(target.folderPath, target.fileName),
    });
  }

  getRemoteString(folderPath, name) {
    return folderPath ? `${folderPath}/${name}` : name;
  }
}
