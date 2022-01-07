import axios from 'axios';
import { mockRemotes, mockFiles, mockPictures } from 'test-utils/mock-responses';
import { mockConfigGetResponse } from 'test-utils/mock-responses';
import { mockOperationsAboutResponse } from 'test-utils/mock-responses';
import RCloneClient from '../RCloneClient';

jest.mock('axios');

describe('RCloneClient', () => {
  beforeEach(() => {
    axios.create.mockReturnThis();
  });

  describe('constructor', () => {
    it('should create the axios instance correctly given auth', () => {
      const client = new RCloneClient('http://localhost:5572', 'admin', '1234');

      expect(client).toBeInstanceOf(RCloneClient);
      expect(axios.create).toBeCalledWith({
        responseType: 'json',
        baseURL: 'http://localhost:5572',
        headers: { 'Content-Type': 'application/json' },
        auth: { username: 'admin', password: '1234' },
      });
    });
  });

  describe('fetchRemotes()', () => {
    it('should return data and call axios.post() correctly', async () => {
      axios.post.mockResolvedValue({ data: mockRemotes });

      const client = new RCloneClient('http://localhost:5572', 'admin', '1234');
      const remotes = await client.fetchRemotes();

      expect(axios.post).toBeCalledWith('config/listremotes', undefined, {});
      expect(remotes).toEqual(mockRemotes.remotes);
    });
  });

  describe('fetchFiles()', () => {
    it('should return data and call axios.post() correctly', async () => {
      axios.post.mockResolvedValue({ data: mockFiles });

      const client = new RCloneClient('http://localhost:5572', 'admin', '1234');
      const files = await client.fetchFiles('googledrive', 'Documents');

      const expectedPayload = {
        fs: 'googledrive:',
        remote: 'Documents',
        _config: { UseListR: true },
      };

      expect(axios.post).toBeCalledWith('operations/list', expectedPayload, {});
      expect(files).toEqual(mockFiles.list);
    });
  });

  describe('fetchSubFolders()', () => {
    it('should return data and call axios.post() correctly', async () => {
      const mockDirectories = {
        list: mockFiles.list.filter(({ MimeType }) => MimeType === 'inode/directory'),
      };

      axios.post.mockResolvedValue({ data: mockDirectories });

      const client = new RCloneClient('http://localhost:5572', 'admin', '1234');
      const subFolders = await client.fetchSubFolders('googledrive', 'Documents');

      const expectedPayload = {
        fs: 'googledrive:',
        remote: 'Documents',
        opt: { dirsOnly: true },
      };

      expect(axios.post).toBeCalledWith('operations/list', expectedPayload, {});
      expect(subFolders).toEqual(mockDirectories.list);
    });
  });

  describe('fetchPictures()', () => {
    it('should return data and call axios.post() correctly', async () => {
      axios.post.mockResolvedValue({ data: mockPictures });

      const client = new RCloneClient('http://localhost:5572', 'admin', '1234');
      const pictures = await client.fetchPictures('googledrive', 'Pictures');

      const expectedBody = {
        fs: 'googledrive:',
        remote: 'Pictures',
        opt: { recurse: true, filesOnly: true },
        _config: { UseListR: true },
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
      };

      expect(axios.post).toBeCalledWith('operations/list', expectedBody, {});
      expect(pictures).toEqual(mockPictures.list);
    });
  });

  describe('fetchFileContents()', () => {
    it('should return data and call axios.post() correctly', async () => {
      axios.get.mockResolvedValue('data');

      const client = new RCloneClient('http://localhost:5572', 'admin', '1234');
      const response = await client.fetchFileContents(
        'googledrive',
        'Documents',
        'dog.png'
      );

      expect(axios.get).toBeCalledWith('%5Bgoogledrive:Documents%5D/dog.png', {
        responseType: 'blob',
      });
      expect(response).toEqual('data');
    });
  });

  describe('fetchRemoteSpaceInfo()', () => {
    it('should return data and call axios.post() correctly', async () => {
      axios.post.mockResolvedValue({ data: mockOperationsAboutResponse });

      const client = new RCloneClient('http://localhost:5572', 'admin', '1234');
      const response = await client.fetchRemoteSpaceInfo('googledrive');

      const expectedBody = { fs: 'googledrive:' };

      expect(axios.post).toBeCalledWith('operations/about', expectedBody, {});
      expect(response).toEqual(mockOperationsAboutResponse);
    });
  });

  describe('fetchFullPathInfo()', () => {
    it('should return data and call axios.post() correctly', async () => {
      axios.post.mockResolvedValue({ data: { item: mockPictures.list[0] } });

      const client = new RCloneClient('http://localhost:5572', 'admin', '1234');
      const response = await client.fetchFullPathInfo('googledrive', 'Pictures/2021');

      const expectedBody = {
        fs: 'googledrive:',
        remote: 'Pictures/2021',
      };
      expect(axios.post).toBeCalledWith('operations/stat', expectedBody, {});
      expect(response).toEqual(mockPictures.list[0]);
    });

    it('should throw an error when item is null', async () => {
      axios.post.mockResolvedValue({ data: { item: null } });

      const client = new RCloneClient('http://localhost:5572', 'admin', '1234');
      const pendingResponse = client.fetchFullPathInfo('googledrive', 'Pictures/2021');

      await expect(pendingResponse).rejects.toThrowError();
    });
  });

  describe('fetchRemoteInfo()', () => {
    it('should return data and call axios.post() correctly', async () => {
      axios.post.mockResolvedValue({ data: mockConfigGetResponse });

      const client = new RCloneClient('http://localhost:5572', 'admin', '1234');
      const response = await client.fetchRemoteInfo('googledrive');

      const expectedBody = { name: 'googledrive' };

      expect(axios.post).toBeCalledWith('config/get', expectedBody, {});
      expect(response).toEqual(mockConfigGetResponse);
    });
  });

  describe('uploadFiles()', () => {
    it('should call axios.post() correctly given data', async () => {
      axios.post.mockResolvedValue({});

      const client = new RCloneClient('http://localhost:5572', 'admin', '1234');
      const file = new File(['foo'], 'foo.txt', { type: 'text/plain' });
      await client.uploadFiles('gdrive', 'Pictures', file);

      const expectedUrl = 'operations/uploadfile?fs=gdrive:&remote=Pictures';
      expect(axios.post).toBeCalledWith(expectedUrl, expect.any(FormData), {});
    });
  });

  describe('deleteDirectory()', () => {
    it('should call axios.post() correctly', async () => {
      axios.post.mockResolvedValue({});

      const client = new RCloneClient('http://localhost:5572', 'admin', '1234');
      await client.deleteDirectory('gdrive', 'Pictures', '2021');

      expect(axios.post).toBeCalledWith('operations/purge', {
        fs: 'gdrive:',
        remote: 'Pictures/2021',
      });
    });
  });

  describe('deleteFile', () => {
    it('should call axios.post() correctly', async () => {
      axios.post.mockResolvedValue({});

      const client = new RCloneClient('http://localhost:5572', 'admin', '1234');
      await client.deleteFile('gdrive', 'Pictures', 'dog.png');

      expect(axios.post).toBeCalledWith('operations/deletefile', {
        fs: 'gdrive:',
        remote: 'Pictures/dog.png',
      });
    });
  });

  describe('copyDirectoryContents()', () => {
    it('should call axios.post() correctly', async () => {
      axios.post.mockResolvedValue({});

      const client = new RCloneClient('http://localhost:5572', 'admin', '1234');
      const src = { remote: 'gdrive', folderPath: 'Pictures', fileName: '2021' };
      const target = { remote: 'onedrive', folderPath: 'Archives', fileName: 'Pictures' };
      await client.copyDirectoryContents(src, target);

      expect(axios.post).toBeCalledWith('sync/copy', {
        srcFs: 'gdrive:Pictures/2021',
        dstFs: 'onedrive:Archives/Pictures',
      });
    });
  });

  describe('copyFile()', () => {
    it('should call axios.post() correctly', async () => {
      axios.post.mockResolvedValue({});

      const client = new RCloneClient('http://localhost:5572', 'admin', '1234');
      const src = { remote: 'gdrive', folderPath: 'Pictures', fileName: 'dog.png' };
      const target = { remote: 'onedrive', folderPath: 'Archives', fileName: 'dog2.png' };
      await client.copyFile(src, target);

      expect(axios.post).toBeCalledWith('operations/copyfile', {
        srcFs: 'gdrive:',
        srcRemote: 'Pictures/dog.png',
        dstFs: 'onedrive:',
        dstRemote: 'Archives/dog2.png',
      });
    });
  });

  describe('moveFile()', () => {
    it('should call axios.post() correctly', async () => {
      axios.post.mockResolvedValue({});

      const client = new RCloneClient('http://localhost:5572', 'admin', '1234');
      const src = { remote: 'gdrive', folderPath: 'Pictures', fileName: 'dog.png' };
      const target = { remote: 'onedrive', folderPath: 'Archives', fileName: 'dog2.png' };
      await client.moveFile(src, target);

      expect(axios.post).toBeCalledWith('operations/movefile', {
        srcFs: 'gdrive:',
        srcRemote: 'Pictures/dog.png',
        dstFs: 'onedrive:',
        dstRemote: 'Archives/dog2.png',
      });
    });
  });

  describe('move()', () => {
    it('should call axios.post() correctly', async () => {
      axios.post.mockResolvedValue({});

      const client = new RCloneClient('http://localhost:5572', 'admin', '1234');
      const src = { remote: 'gdrive', folderPath: 'Pictures', fileName: '2021' };
      const target = { remote: 'onedrive', folderPath: 'Archives', fileName: '2021' };
      await client.move(src, target);

      expect(axios.post).toBeCalledWith('sync/move', {
        srcFs: 'gdrive:Pictures/2021',
        dstFs: 'onedrive:Archives/2021',
      });
    });
  });

  describe('mkdir()', () => {
    it('should call axios.post() correctly', async () => {
      axios.post.mockResolvedValue({});

      const client = new RCloneClient('http://localhost:5572', 'admin', '1234');
      await client.mkdir('gdrive', 'Archives/Pictures/2021/Trip to Big Sur');

      expect(axios.post).toBeCalledWith('operations/mkdir', {
        fs: 'gdrive:',
        remote: 'Archives/Pictures/2021/Trip to Big Sur',
      });
    });
  });
});
