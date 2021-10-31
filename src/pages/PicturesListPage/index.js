import "./index.scss";
import ImageList from "./ImageList";
import { useParams } from "react-router";
import { unhashRemotePath } from "utils/remote-paths-url";
import Header from "../../components/Breadcrumbs";
import { Link } from "react-router-dom";
import useFileViewer from "hooks/useFileViewer";
import { FileType } from "utils/constants";

export default function PicturesListPage() {
  const { id } = useParams();
  const fileViewer = useFileViewer();

  const remotePath = unhashRemotePath(id);
  const [remote, path] = remotePath.split(":");

  const handleImageClicked = (image) => {
    fileViewer.show({ ...image, fileType: FileType.Image });
  };

  return (
    <>
      <Header
        remote={remote}
        path={path}
        homeLink={<Link to="/pictures">My Pictures</Link>}
      />
      <ImageList
        remote={remote}
        rootPath={path}
        onImageClicked={handleImageClicked}
      />
    </>
  );
};
