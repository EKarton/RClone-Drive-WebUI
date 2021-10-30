import "./index.scss";
import ImageList from "./ImageList";
import { useParams } from "react-router";
import { unhashRemotePath } from "utils/remote-paths-url";
import Header from "../../components/Breadcrumbs";
import { Link } from "react-router-dom";

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
