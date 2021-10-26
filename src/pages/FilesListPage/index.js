import FileListTable from "components/FileListTable";
import Header from "./Header";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import "./index.scss";
import useRCloneClient from "hooks/useRCloneClient";
import { hashRemotePath, unhashRemotePath } from "utils/remote-paths-url";
import useFileViewer from "hooks/useFileViewer";

const FilesPage = () => {
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
      const fileList = await Promise.all(
        rawFilesList.map(async (file) => {
          const isImage = file.MimeType === "image/jpeg";
          const imageContents = isImage
            ? await rCloneClient.fetchFileContents(remote, path, file.Name)
            : undefined;

          return {
            name: file.Name,
            lastUpdatedTime: file.ModTime,
            path: file.Path,
            size: file.Size,
            mimeType: file.MimeType,
            isDirectory: file.IsDir,
            isImage,
            fileUrl: isImage
              ? window.URL.createObjectURL(new Blob([imageContents]))
              : undefined,
          };
        })
      );

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

    fileViewer.show({ remote, path, name: file.name, mimeType: file.mimeType });
  };

  return (
    <>
      <Header remote={remote} path={path} />
      <FileListTable
        remote={remote}
        files={files}
        onFileClicked={handleFileClicked}
      />
    </>
  );
};

export default FilesPage;
