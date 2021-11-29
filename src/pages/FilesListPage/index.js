import FileListTable from 'components/FileListTable';
import Header from '../../components/Breadcrumbs';
import { useCallback } from 'react';
import { useHistory } from 'react-router';
import './index.scss';
import { hashRemotePath } from 'utils/remote-paths-url';
import useFileViewer from 'hooks/useFileViewer';
import { Link } from 'react-router-dom';
import LazyImage from 'components/LazyImage';
import { ImageMimeTypes, StatusTypes } from 'utils/constants';
import FileListTableSkeleton from 'components/FileListTableSkeleton';
import useRemotePathParams from 'hooks/useRemotePathParams';
import useFetchRCloneData from 'hooks/useFetchRCloneData';

export default function FilesListPage() {
  const { remote, path } = useRemotePathParams();
  const history = useHistory();
  const fileViewer = useFileViewer();

  const fetchFiles = useCallback((c) => c.fetchFiles(remote, path), [remote, path]);
  const { status, data } = useFetchRCloneData(fetchFiles);

  const handleFileClicked = (file) => {
    if (file.isDirectory) {
      const newRemotePath = `${remote}:${file.path}`;
      history.push(`/files/${hashRemotePath(newRemotePath)}`);
      return;
    }

    fileViewer.show({ remote, folderPath: path, fileName: file.name });
  };

  const renderTable = () => {
    if (status === StatusTypes.ERROR) {
      return <div data-testid="error-message">Error!</div>;
    }

    if (status !== StatusTypes.SUCCESS) {
      return <FileListTableSkeleton />;
    }

    const fileList = data.map((file) => ({
      name: file.Name,
      lastUpdatedTime: file.ModTime,
      path: file.Path,
      size: file.Size,
      mimeType: file.MimeType,
      isDirectory: file.IsDir,
      isImage: ImageMimeTypes.has(file.MimeType),
      preview: (
        <LazyImage
          image={{
            remote,
            folderPath: path,
            fileName: file.Name,
          }}
          imgClassName="filelist-page__img"
        />
      ),
    }));

    return (
      <FileListTable remote={remote} files={fileList} onFileClicked={handleFileClicked} />
    );
  };

  return (
    <>
      <Header remote={remote} path={path} homeLink={<Link to="/files">My Files</Link>} />
      {renderTable()}
    </>
  );
}
