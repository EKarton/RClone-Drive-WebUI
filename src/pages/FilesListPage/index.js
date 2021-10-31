import FileListTable from "components/FileListTable";
import Header from "../../components/Breadcrumbs";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import "./index.scss";
import useRCloneClient from "hooks/useRCloneClient";
import { hashRemotePath, unhashRemotePath } from "utils/remote-paths-url";
import useFileViewer from "hooks/useFileViewer";
import { Link } from "react-router-dom";
import LazyImage from "components/LazyImage";
import { ImageMimeTypes } from "utils/constants";

export default function FilesListPage() {
  const { id } = useParams();
  const history = useHistory();
  const rCloneClient = useRCloneClient();
  const [files, setFiles] = useState([]);
  const fileViewer = useFileViewer();

  const remotePath = unhashRemotePath(id);
  const [remote, path] = remotePath.split(":");

  useEffect(() => {
    const fetchFiles = async () => {
      const rawFilesList = await rCloneClient.fetchFiles(remote, path);
      const fileList = rawFilesList.map((file) => {
        return {
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
        };
      });

      setFiles(fileList);
    };

    fetchFiles();
  }, [id, path, rCloneClient, remote, remotePath]);

  const handleFileClicked = (file) => {
    if (file.isDirectory) {
      const newRemotePath = `${remote}:${file.path}`;
      history.push(`/files/${hashRemotePath(newRemotePath)}`);
      return;
    }

    fileViewer.show({ remote, folderPath: path, fileName: file.name });
  };

  return (
    <>
      <Header
        remote={remote}
        path={path}
        homeLink={<Link to="/files">My Files</Link>}
      />
      <FileListTable
        remote={remote}
        files={files}
        onFileClicked={handleFileClicked}
      />
    </>
  );
}
