import axios from 'axios';

const ImageIncludeRules = [
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
];

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
  async fetchRemotes(opts) {
    const { data } = await this.axiosInstance.post('config/listremotes', undefined, opts);
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
  async fetchFiles(remote, path, opts) {
    const postData = {
      fs: `${remote}:`,
      remote: `${path}`,
      _config: {
        UseListR: true,
      },
    };
    const { data } = await this.axiosInstance.post('operations/list', postData, opts);

    return data.list;
  }

  async fetchSubFolders(remote, path, opts) {
    const postData = {
      fs: `${remote}:`,
      remote: `${path}`,
      opt: {
        dirsOnly: true,
      },
    };
    const { data } = await this.axiosInstance.post('operations/list', postData, opts);

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
  async fetchPictures(remote, path, opts) {
    const postData = {
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
        IncludeRule: ImageIncludeRules,
      },
    };

    const { data } = await this.axiosInstance.post('operations/list', postData, opts);

    return data.list;
  }

  /**
   * Returns the file contents of a particular file in a remote
   * @param {string} remote the name of the remote
   * @param {string} folderPath the folder path
   * @param {string} fileName the file name
   * @returns {string} the blob contents of the file
   */
  async fetchFileContents(remote, folderPath, fileName, opts = {}) {
    const { cancelToken } = opts;
    const remotePath = `${remote}:${folderPath}`;
    const url = encodeURI(`[${remotePath}]/${fileName}`);

    const response = await this.axiosInstance.get(url, {
      responseType: 'blob',
      cancelToken,
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
  async fetchRemoteSpaceInfo(remote, opts) {
    const postPayload = {
      fs: `${remote}:`,
    };
    const { data } = await this.axiosInstance.post('operations/about', postPayload, opts);

    return data;
  }

  async fetchFileInfo(remote, path, opts) {
    const postPayload = {
      fs: `${remote}:`,
      remote: path,
    };

    const { data } = await this.axiosInstance.post('operations/stat', postPayload, opts);

    return data.item;
  }

  /**
   * Returns the remote info
   * @param {string} remote the remote
   * @returns {object} the info of the remote
   */
  async fetchRemoteInfo(remote, opts) {
    const postPayload = {
      name: remote,
    };
    const { data } = await this.axiosInstance.post('config/get', postPayload, opts);

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

  /**
   * Copies the contents in a source directory to a target directory
   * @param {object} source the source directory
   * @param {object} target the target directory
   * @param {boolean} createEmptySrcDirs true if it creates empty sub-directories in the source path; else false
   */
  async copyDirectoryContents(source, target, createEmptySrcDirs) {
    const srcPath = this.getRemoteString(source.folderPath, source.fileName);
    const targetPath = this.getRemoteString(target.folderPath, target.fileName);

    await this.axiosInstance.post('sync/copy', {
      srcFs: `${source.remote}:${srcPath}`,
      dstFs: `${target.remote}:${targetPath}`,
      createEmptySrcDirs: `${createEmptySrcDirs}`,
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

  async moveFile(source, target) {
    await this.axiosInstance.post('operations/movefile', {
      srcFs: `${source.remote}:`,
      srcRemote: this.getRemoteString(source.folderPath, source.fileName),
      dstFs: `${target.remote}:`,
      dstRemote: this.getRemoteString(target.folderPath, target.fileName),
    });
  }

  async move(source, target, createEmptySrcDirs, deleteEmptySrcDirs) {
    const srcRemote = this.getRemoteString(source.folderPath, source.fileName);
    const targetRemote = this.getRemoteString(target.folderPath, target.fileName);

    await this.axiosInstance.post('sync/move', {
      srcFs: `${source.remote}:${srcRemote}`,
      dstFs: `${target.remote}:${targetRemote}`,
      createEmptySrcDirs,
      deleteEmptySrcDirs,
    });
  }

  async moveV2(srcRemotePath, targetRemotePath, createEmptySrcDirs, deleteEmptySrcDirs) {
    await this.axiosInstance.post('sync/move', {
      srcFs: srcRemotePath,
      dstFs: targetRemotePath,
      createEmptySrcDirs,
      deleteEmptySrcDirs,
    });
  }

  async mkdir(remote, folderPath) {
    await this.axiosInstance.post('operations/mkdir', {
      fs: `${remote}:`,
      remote: folderPath,
    });
  }

  getRemoteString(folderPath, name) {
    return folderPath ? `${folderPath}/${name}` : name;
  }
}
