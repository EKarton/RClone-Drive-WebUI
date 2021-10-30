import "./index.scss";
import ImageList from "./ImageList";
import { useParams } from "react-router";
import { unhashRemotePath } from "utils/remote-paths-url";

export const StatusTypes = Object.freeze({
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
});

const PicturesListPage = () => {
  const { id } = useParams();
  const remotePath = unhashRemotePath(id);
  const [remote, path] = remotePath.split(":");

  return <ImageList remote={remote} rootPath={path} />;
};

export default PicturesListPage;
