import axios from 'axios';
import { getFullPath } from 'utils/filename-utils';

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

/**
 * A class used to handle all requests to RClone
 */
export default class RCloneClient {
  constructor(rCloneInfo) {
    this.axiosInstance = axios.create({
      responseType: 'json',
      baseURL: rCloneInfo.endpoint,
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username: rCloneInfo.username,
        password: rCloneInfo.password,
      },
    });
  }

  /**
   * Fetches and returns a list of remotes
   * @returns {Promise<string[]>} a list of remotes
   */
  async fetchRemotes(opts = {}) {
    const { data } = await this.axiosInstance.post('config/listremotes', undefined, opts);
    return data.remotes;
  }

  /**
   * Fetches a list of files and folders under a directory path in a remote
   * It returns a list of objects, where each object has this shape:
   *
   * {
   *   "Path": <the full file path of the folder / file >,
   *   "Name": <the name of the folder or file>,
   *   "Size": <the size of the folder or file, in bytes>,
   *   "MimeType": <the type (ex: "inode/directory")>,
   *   "ModTime": <the time this folder / file was updated, in ISO 8601 format>,
   *   "IsDir": <true if it is a directory; else false>,
   *   "ID": <the id of this object>
   * }
   *
   * @param {string} remote the remote
   * @param {string} directoryPath the directory path
   * @param {object} opts the set of axios options
   * @returns {Promise<object[]>} a list of files
   */
  async fetchFiles(remote, directoryPath, opts = {}) {
    const postData = {
      fs: `${remote}:`,
      remote: `${directoryPath}`,
      _config: {
        UseListR: true,
      },
    };
    const { data } = await this.axiosInstance.post('operations/list', postData, opts);

    return data.list;
  }

  /**
   * Fetches a list of folders under a directory path in a remote
   * It returns a list of objects, where each object has this shape:
   *
   * {
   *   "Path": <the full file path of the folder >,
   *   "Name": <the name of the folder or file>,
   *   "Size": <the size of the folder or file, in bytes>,
   *   "MimeType": <the type (ex: "inode/directory")>,
   *   "ModTime": <the time this folder / file was updated, in ISO 8601 format>,
   *   "IsDir": true,
   *   "ID": <the id of this object>
   * }
   *
   * @param {string} remote the remote
   * @param {string} directoryPath the directory path
   * @param {object} opts the set of axios options
   * @returns {Promise<object[]>} a list of files
   */
  async fetchSubFolders(remote, directoryPath, opts = {}) {
    const requestBody = {
      fs: `${remote}:`,
      remote: `${directoryPath}`,
      opt: {
        dirsOnly: true,
      },
    };
    const { data } = await this.axiosInstance.post('operations/list', requestBody, opts);

    return data.list;
  }

  /**
   * Fetches a list of pictures under a directory path in a remote
   * It returns a list of objects, where each object has this shape:
   *
   * {
   *   "Path": <the current path of the folder / file >,
   *   "Name": <the name of the folder or file>,
   *   "Size": <the size of the folder or file, in bytes>,
   *   "MimeType": <the type (ex: "image/png")>,
   *   "ModTime": <the time this folder / file was updated, in ISO 8601 format>,
   *   "IsDir": false,
   *   "ID": <the id of this object>
   * }
   *
   * @param {string} remote the remote
   * @param {string} directoryPath the directory path
   * @returns {Promise<object[]>} a list of files
   */
  async fetchPictures(remote, directoryPath, opts = {}) {
    const requestBody = {
      fs: `${remote}:`,
      remote: `${directoryPath}`,
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

    const { data } = await this.axiosInstance.post('operations/list', requestBody, opts);

    return data.list;
  }

  /**
   * Returns the file contents of a file in a remote
   *
   * @param {string} remote the name of the remote
   * @param {string} directoryPath the folder path
   * @param {string} fileName the file name
   * @returns {Promise<string>} the blob contents of the file
   */
  async fetchFileContents(remote, directoryPath, fileName, opts = {}) {
    const { cancelToken } = opts;
    const remotePath = `${remote}:${directoryPath}`;
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
   * All numbers are in bytes
   *
   * @param {string} remote the remote
   * @returns {Promise<object>} the space info
   */
  async fetchRemoteSpaceInfo(remote, opts = {}) {
    const requestBody = {
      fs: `${remote}:`,
    };
    const { data } = await this.axiosInstance.post('operations/about', requestBody, opts);

    return data;
  }

  /**
   * Returns information about a full path in a remote
   * It returns information in this shape:
   * {
   *   "Path": string,
   *   "Name": string,
   *   "Size": integer,
   *   "MimeType": string,
   *   "ModTime": string,
   *   "IsDir": boolean,
   *   "ID": string
   * }
   *
   * If the full path doesn't exist in the remote, it will return null.
   * If the remote does not exist, it will throw an exception
   *
   * @param {string} remote the remote
   * @param {string} fullPath the file path
   * @param {string} opts options
   * @returns {Promise<object>} information about the file
   */
  async fetchFullPathInfo(remote, fullPath, opts = {}) {
    const requestBody = {
      fs: `${remote}:`,
      remote: fullPath,
    };

    const { data } = await this.axiosInstance.post('operations/stat', requestBody, opts);

    if (data.item === null) {
      throw new Error(`Cannot find full path ${fullPath}`);
    }

    return data.item;
  }

  /**
   * Returns the remote info
   * It will return an object with this shape:
   * {
   *    "scope": string,
   *    "type": string
   * }
   *
   * Depending on the type of remote, it may include more information.
   * For instance, with GDrives, it may return an object with this shape:
   * {
   *    "scope": string,
   *    "team_drive": string,
   *    "token": object,
   *    "type": "drive"
   * }
   *
   * @param {string} remote the remote
   * @returns {Promise<object>} the info of the remote
   */
  async fetchRemoteInfo(remote, opts = {}) {
    const requestBody = {
      name: remote,
    };
    const { data } = await this.axiosInstance.post('config/get', requestBody, opts);

    return data;
  }

  /**
   * Uploads a file to a folder
   *
   * @param {string} remote the remote
   * @param {string} dirPath the path to the folder
   * @param {File} data the file data
   * @param {Object?} opts the options
   */
  async uploadFiles(remote, dirPath, data, opts = {}) {
    const formData = new FormData();
    formData.append('file', data);

    const url = `operations/uploadfile?fs=${remote}:&remote=${dirPath}`;

    await this.axiosInstance.post(url, formData, opts);
  }

  /**
   * Deletes a directory from a remote
   * @param {string} remote string
   * @param {string} directoryPath the folder path
   * @param {string} baseName the name of the folder to delete
   */
  async deleteDirectory(remote, directoryPath, baseName, opts = {}) {
    const { isAsync = false } = opts;

    return this.axiosInstance.post('operations/purge', {
      fs: `${remote}:`,
      remote: getFullPath(directoryPath, baseName),
      _async: isAsync,
    });
  }

  async deleteFile(remote, dirPath, fileName, opts = {}) {
    const { isAsync = false } = opts;

    return this.axiosInstance.post('operations/deletefile', {
      fs: `${remote}:`,
      remote: getFullPath(dirPath, fileName),
      _async: isAsync,
    });
  }

  /**
   * Copies the contents in a source directory to a target directory
   * @param {object} source the source directory
   * @param {object} target the target directory
   * @param {boolean} createEmptySrcDirs true if it creates empty sub-directories in the source path; else false
   */
  async copyDirectoryContents(source, target, createEmptySrcDirs) {
    const srcPath = getFullPath(source.dirPath, source.fileName);
    const targetPath = getFullPath(target.dirPath, target.fileName);

    return this.axiosInstance.post('sync/copy', {
      srcFs: `${source.remote}:${srcPath}`,
      dstFs: `${target.remote}:${targetPath}`,
      createEmptySrcDirs,
    });
  }

  /**
   * Copies a file to a new path / remote
   * The source path must be of this shape:
   * {
   *    remote: string (the src remote),
   *    dirPath: string (the folder path of the src file)
   *    fileName: string (the src file name),
   * }
   *
   * The target path must be of this shape:
   * {
   *    remote: string (the new remote),
   *    dirPath: string (the new folder path of the file)
   *    fileName: string (the new file name)
   * }
   *
   * @param {object} source the source file, with the shape above
   * @param {object} target the target file, with the shape above
   */
  async copyFile(source, target) {
    return this.axiosInstance.post('operations/copyfile', {
      srcFs: `${source.remote}:`,
      srcRemote: getFullPath(source.dirPath, source.fileName),
      dstFs: `${target.remote}:`,
      dstRemote: getFullPath(target.dirPath, target.fileName),
    });
  }

  /**
   * Moves a file to a new path / remote
   * The source path must be of this shape:
   * {
   *    remote: string (the src remote),
   *    dirPath: string (the folder path of the src file)
   *    name: string (the src file name),
   * }
   *
   * The target path must be of this shape:
   * {
   *    remote: string (the new remote),
   *    dirPath: string (the new folder path of the file)
   *    name: string (the new file name)
   * }
   *
   * @param {object} source the source file, with the shape above
   * @param {object} target the target file, with the shape above
   */
  async moveFile(source, target, opts = {}) {
    const { isAsync = false } = opts;

    return this.axiosInstance.post('operations/movefile', {
      srcFs: `${source.remote}:`,
      srcRemote: getFullPath(source.dirPath, source.name),
      dstFs: `${target.remote}:`,
      dstRemote: getFullPath(target.dirPath, target.name),
      _async: isAsync,
    });
  }

  /**
   * Moves a directory from one path to another path
   * The source path must be of this shape:
   * {
   *    remote: string (the src remote),
   *    dirPath: string (the folder path of the src file)
   *    name: string (the name of the folder),
   * }
   *
   * The target path must be of this shape:
   * {
   *    remote: string (the new remote),
   *    dirPath: string (the new folder path of the folder)
   *    name: string (the new folder name)
   * }
   *
   * If the target's folder path does not exist, it will make one
   *
   * @param {object} source the source file, with the shape above
   * @param {object} target the target file, with the shape above
   */
  async move(source, target, opts = {}) {
    const { createEmptySrcDirs = false, deleteEmptySrcDirs = false } = opts;
    const { isAsync = false } = opts;
    const srcRemote = getFullPath(source.dirPath, source.name);
    const targetRemote = getFullPath(target.dirPath, target.name);

    return this.axiosInstance.post('sync/move', {
      srcFs: `${source.remote}:${srcRemote}`,
      dstFs: `${target.remote}:${targetRemote}`,
      createEmptySrcDirs,
      deleteEmptySrcDirs,
      _async: isAsync,
    });
  }

  /**
   * Makes a directory in a remote
   * @param {string} remote the remote
   * @param {string} fullPath the full path of the new folder
   */
  async mkdir(remote, fullPath) {
    return this.axiosInstance.post('operations/mkdir', {
      fs: `${remote}:`,
      remote: fullPath,
    });
  }

  /**
   * Empties the trash can
   * @param {string} remote the remote name
   */
  async emptyTrashCan(remote) {
    return this.axiosInstance.post('operations/cleanup', {
      fs: `${remote}:`,
    });
  }

  async getJobStatus(jobId) {
    return this.axiosInstance.post('job/status', {
      jobid: jobId,
    });
  }

  async stopJob(jobId) {
    return this.axiosInstance.post('job/stop', {
      jobid: jobId,
    });
  }
}
