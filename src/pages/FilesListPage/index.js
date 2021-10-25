import FileListTable from "components/FileListTable";
import Header from "./Header";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "./index.scss";
import useRCloneClient from "hooks/useRCloneClient";
import { hashRemotePath, unhashRemotePath } from "utils/remote-paths-url";

const FilesPage = () => {
  const { id } = useParams();
  const rCloneClient = useRCloneClient();
  const [files, setFiles] = useState([]);

  const remotePath = unhashRemotePath(id);
  const [remote, path] = remotePath.split(":");

  useEffect(() => {
    const fetchFiles = async () => {
      const rawFilesList = await rCloneClient.fetchFiles(remote, path);
      const fileList = await Promise.all(
        rawFilesList.map(async (file) => {
          const newRemotePath = `${remote}:${file.Path}`;

          const isImage = file.MimeType === "image/jpeg";
          const imageContents = isImage
            ? await rCloneClient.fetchFileContents(remote, path, file.Name)
            : undefined;

          return {
            target: `/files/${hashRemotePath(newRemotePath)}`,
            name: file.Name,
            lastUpdatedTime: file.ModTime,
            size: file.Size,
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

  return (
    <>
      <Header remote={remote} path={path} />
      <FileListTable remote={remote} files={files} />
    </>
  );
};

export default FilesPage;
