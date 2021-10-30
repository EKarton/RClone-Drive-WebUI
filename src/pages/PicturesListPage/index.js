import "./index.scss";
import ImageList from "./ImageList";
import { useParams } from "react-router";
import { unhashRemotePath } from "utils/remote-paths-url";
import Header from "../FilesListPage/Header";
import { Link } from "react-router-dom";

export const StatusTypes = Object.freeze({
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
});

const PicturesListPage = () => {
  const { id } = useParams();
  const remotePath = unhashRemotePath(id);
  const [remote, path] = remotePath.split(":");

  return (
    <>
      <Header
        remote={remote}
        path={path}
        homeLink={<Link to="/pictures">My Pictures</Link>}
      />
      <ImageList remote={remote} rootPath={path} />
    </>
  );
};

export default PicturesListPage;
