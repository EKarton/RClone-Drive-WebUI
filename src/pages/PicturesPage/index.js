import { ImageList, ImageListItem } from "@mui/material";
import LazyImage from "./LazyImage";
import "./index.scss";

const PicturesPage = () => {
  const itemData = [];

  for (let i = 0; i < 100; i++) {
    itemData.push({
      img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
      title: "Breakfast",
    });
  }

  return (
    <ImageList className="pictures-page__image-list">
      {itemData.map((item) => (
        <ImageListItem key={item.title}>
          <LazyImage
            remote="googledrive-main-encrypted"
            folderPath="Pictures/2013/Kerbal Space Program Screenshots/7 - Second Trip to Jool"
            fileName="20131013_102046.png"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default PicturesPage;
