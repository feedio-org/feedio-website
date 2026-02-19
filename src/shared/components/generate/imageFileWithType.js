const ImageFileWithType = (backgroundList, fileName, fileType) => {
  let image_url = 'https://va-background-images.s3.amazonaws.com/';
  if (!fileName?.includes('bg_') && fileName?.includes('_bg')) {
    if (fileName?.includes('bg_') && !fileName?.includes('_bg')) {
      return image_url + fileName + '.gif';
    } else {
      return image_url + fileName;
    }
  } else {
    return image_url + fileName + '.gif';
  }
};

export default ImageFileWithType;
