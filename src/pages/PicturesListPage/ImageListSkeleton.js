import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import './ImageListSkeleton.scss';
import { Skeleton } from '@mui/material';

export default function ImageListSkeleton({ ...otherProps }) {
  const renderRow = (numImagesPerRow, style) => (
    <div className="imagelist-skeleton__row" style={style}>
      {Array.from({ length: numImagesPerRow }, (_, i) => (
        <Skeleton key={i} variant="rectangular" className="imagelist-skeleton__img" />
      ))}
    </div>
  );

  return (
    <AutoSizer {...otherProps}>
      {({ height, width }) => {
        const numImagesPerRow = width < 1920 ? 3 : 5;
        const imgWidth = Math.floor(width / numImagesPerRow);
        const imgHeight = imgWidth;
        const numRows = Math.ceil(height / imgHeight);

        return (
          <FixedSizeList
            width={width}
            height={height}
            itemCount={numRows}
            itemSize={imgHeight}
          >
            {({ style }) => renderRow(numImagesPerRow, style)}
          </FixedSizeList>
        );
      }}
    </AutoSizer>
  );
}
