import { createRef, useEffect } from "react";

const Image = ({ onResize, ...props }) => {
  const imgRef = createRef();

  useEffect(() => {
    const handleWindowResized = () => {
      onResize(imgRef);
    };

    window.addEventListener("resize", handleWindowResized);
    handleWindowResized();

    return () => {
      window.removeEventListener("resize", handleWindowResized);
    };
  }, [imgRef, onResize]);

  return <img {...props} ref={imgRef} alt={props.alt} />;
};

export default Image;
