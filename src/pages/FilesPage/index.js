import axios from "axios";
import FileListTable from "components/FileListTable";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { store } from "store";
import "./index.scss";

const FilesPage = () => {
  const { id } = useParams();
  const { state } = useContext(store);
  const [files, setFiles] = useState([]);

  const remotePath = Buffer.from(id, "base64").toString("utf-8");
  const [remote, path] = remotePath.split(":");

  useEffect(() => {
    const fetchFileData = async (fileName) => {
      const axiosInstance = axios.create({
        responseType: "blob",
        baseURL: state.auth.endpoint,
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: state.auth.username,
          password: state.auth.password,
        },
      });

      const url = encodeURI(`[${remotePath}]/${fileName}`);
      const { data } = await axiosInstance.get(url);
      return data;
    };

    const fetchFiles = async () => {
      if (state.auth) {
        const axiosInstance = axios.create({
          responseType: "json",
          baseURL: state.auth.endpoint,
          headers: {
            "Content-Type": "application/json",
          },
          auth: {
            username: state.auth.username,
            password: state.auth.password,
          },
        });

        const { data } = await axiosInstance.post("operations/list", {
          fs: `${remote}:`,
          remote: `${path}`,
        });

        const fileList = await Promise.all(
          data.list.map(async (file) => {
            const newRemotePath = `${remote}:${file.Path}`;
            const newRemotePathHashed =
              Buffer.from(newRemotePath).toString("base64");
            const destinationPath = `/files/${newRemotePathHashed}`;

            const isImage = file.MimeType === "image/jpeg";

            return {
              target: destinationPath,
              name: file.Name,
              lastUpdatedTime: file.ModTime,
              size: file.Size,
              isDirectory: file.IsDir,
              isImage,
              fileUrl: isImage
                ? window.URL.createObjectURL(
                    new Blob([await fetchFileData(file.Name)])
                  )
                : undefined,
            };
          })
        );

        setFiles(fileList);
      }
    };

    fetchFiles();
  }, [id, path, remote, remotePath, state.auth]);

  return <FileListTable remote={remote} files={files} />;
};

export default FilesPage;
