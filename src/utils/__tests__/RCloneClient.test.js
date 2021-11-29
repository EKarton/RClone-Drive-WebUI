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

      expect(axios.post).toBeCalledWith('config/listremotes');
      expect(remotes).toEqual(mockRemotes.remotes);
    });
  });

  describe('fetchFiles()', () => {
    it('should return data and call axios.post() correctly', async () => {
      axios.post.mockResolvedValue({ data: mockFiles });

      const client = new RCloneClient('http://localhost:5572', 'admin', '1234');
      const files = await client.fetchFiles('googledrive', 'Documents');

      expect(axios.post).toBeCalledWith('operations/list', {
        fs: 'googledrive:',
        remote: 'Documents',
        _config: { UseListR: true },
      });
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

      expect(axios.post).toBeCalledWith('operations/list', {
        fs: 'googledrive:',
        remote: 'Documents',
        opt: { dirsOnly: true },
      });
      expect(subFolders).toEqual(mockDirectories.list);
    });
  });

  describe('fetchPictures()', () => {
    it('should return data and call axios.post() correctly', async () => {
      axios.post.mockResolvedValue({ data: mockPictures });

      const client = new RCloneClient('http://localhost:5572', 'admin', '1234');
      const pictures = await client.fetchPictures('googledrive', 'Pictures');

      expect(axios.post).toBeCalledWith('operations/list', {
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
      });
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

      expect(axios.post).toBeCalledWith('operations/about', {
        fs: 'googledrive:',
      });
      expect(response).toEqual(mockOperationsAboutResponse);
    });
  });

  describe('fetchRemoteInfo()', () => {
    it('should return data and call axios.post() correctly', async () => {
      axios.post.mockResolvedValue({ data: mockConfigGetResponse });

      const client = new RCloneClient('http://localhost:5572', 'admin', '1234');
      const response = await client.fetchRemoteInfo('googledrive');

      expect(axios.post).toBeCalledWith('config/get', {
        name: 'googledrive',
      });
      expect(response).toEqual(mockConfigGetResponse);
    });
  });
});
