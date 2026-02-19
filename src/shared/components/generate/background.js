import { InboxOutlined } from "@ant-design/icons";
import { Image, Spin, Upload } from "antd";
import axios from "axios";
import {
  addNewCustomBg,
  getBgImagesList,
} from "pages/dashboard/redux/lovSlice";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import styles from "./generate.module.scss";
import ImageFileWithType from "./imageFileWithType";
const { Dragger } = Upload;

export default function Background({
  selectedBackground,
  onBackgroundSelect,
  aspectRatio,
  selectedTopicData,
  selectedScene,
  backgroundList,
  loadBackgroundImageList,
}) {
  const dispatch = useDispatch();
  const [currentAspectRatio, setCurrentAspectRatio] = useState(aspectRatio);
  const [loading, setLoading] = useState(false);
  // const { status, backgroundList, error, isNewBgAdded, newBgStatus } =
  //   useSelector((state) => state.lov);
  // // console.log(status, backgroundList, error);
  // console.log(backgroundList);
  const [imageList, setImageList] = useState(backgroundList);

  const combineImage = async() => {
    // const imageData =
    //   currentAspectRatio === '16:9'
    //     ? backgroundList?.data['16:9']
    //     : backgroundList?.data['9:16'];
    // const customImageData =
    //   currentAspectRatio === '16:9'
    //     ? backgroundList?.data['custom_16:9']
    //     : backgroundList?.data['custom_9:16'];
    // // Step 1: Get the count of items in imageData
    // const count = imageData?.length;

    // // Step 2: Update customImageData with new ids
    // const updatedCustomImageData = customImageData.map((item, index) => ({
    //   ...item,
    //   id: count + index // Assign new id starting from count
    // }));

    // // Step 3: Combine the arrays
    // const imageListData = [...imageData, ...updatedCustomImageData];
    setImageList(backgroundList);
  };

  useEffect(() => {
    combineImage();
  }, [aspectRatio, backgroundList]);

  const props = {
    name: "file",
    multiple: false,
    showUploadList: false, // Hide progress bar and file list
    customRequest: async({ file, onSuccess, onError }) => {
      setLoading(true);
      try {
        const reader = new FileReader();

        reader.onload = async(e) => {
          const img = new window.Image();
          img.src = e.target.result;

          img.onload = async() => {
            const { width, height } = img;

            // Check aspect ratio (16:9 or 9:16)
            const fileAspectRatio = width / height;
            let fileRatio;
            if (aspectRatio === "16:9") {
              fileRatio = Math.abs(fileAspectRatio - 16 / 9);
            } else if (aspectRatio === "9:16") {
              fileRatio = Math.abs(fileAspectRatio - 9 / 16);
            } else {
            }
            if (fileRatio < 0.2) {
              // Proceed with the upload
              const url = selectedTopicData.bg_upload_url.url;
              const fields = selectedTopicData.bg_upload_url.fields;

              const formData = new FormData();
              Object.keys(fields).forEach((key) => {
                formData.append(key, fields[key]);
              });
              const fileExtension = file.name.split(".").pop();
              const newFileName = `${selectedTopicData.video_id}_bg`;
              // .${file.name
              //   .split('.')
              //   .pop()}
              const renamedFile = new File([file], newFileName, {
                type: file.type,
              });
              formData.append("file", renamedFile);

              const imgResponse = await axios.post(url, formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              });

              console.log("Upload response:", imgResponse);
              onSuccess("Upload successful");
              const response = await dispatch(
                addNewCustomBg({
                  background_image: newFileName,
                  resolution: currentAspectRatio,
                  image_type: fileExtension,
                })
              );
              // console.log(response, newBgStatus, isNewBgAdded);

              if (response?.type === "lov/addNewCustomBg/fulfilled") {
                dispatch(getBgImagesList());
              }
              loadBackgroundImageList();
              await combineImage();
              toast.success("Background file uploaded successfully.");
            } else {
              console.error("Invalid aspect ratio:", fileAspectRatio);
              toast.error(`Image must be ${aspectRatio} aspect ratio.`);
              onError(new Error(`Image must be  ${aspectRatio} aspect ratio.`));
            }
          };

          img.onerror = () => {
            console.error("Error loading image");
            onError(new Error("Invalid image file."));
          };
        };

        reader.readAsDataURL(file);
      } catch (err) {
        console.error("Upload error:", err);
        onError(err);
      } finally {
        setLoading(false);
      }
    },

    onChange(info) {
      const { status } = info.file;

      if (status !== "uploading") {
      }
    },
    onDrop(e) {},
  };

  useEffect(() => {
    setCurrentAspectRatio(aspectRatio);
  }, [aspectRatio]);

  // Memoize the image sources with cache-busting
  const imageSources = useMemo(() => {
    if (!imageList?.length) return [];

    return imageList?.map((item) => {
      const imageUrl = ImageFileWithType(
        backgroundList,
        item?.image_name,
        item?.image_type || ""
      );
      // return `${imageUrl}?t=${timestamp}`; //  timestamp hided
      return `${imageUrl}`; // Append the timestamp to prevent caching
    });
  }, [backgroundList, imageList]);

  return (
    <div className={styles.backgroundContainer}>
      <div className={styles.backgroundWrapper}>
        {imageList &&
          imageList.map((item, index) => (
            <div
              key={item?.id}
              className={`${styles.bgCard} ${
                selectedBackground === item?.image_name ? styles.selected : ""
              }`}
              onClick={() => onBackgroundSelect(item)}
            >
              <Image
                preview={false}
                // src={require(`../../../asset/images/background/${item.image_name}.gif`)}
                // src={`https://va-background-images.s3.amazonaws.com/${item?.image_name}.gif`}
                src={imageSources[index]}
              />
            </div>
          ))}
      </div>
      <div style={{ marginTop: "1rem" }}>
        {loading && (
          <div className={styles.loaderContainer}>
            <Spin
              size="large"
              // style={{ display: 'block', margin: '0 auto', marginTop: '200px' }}
            />
            <p>Background image is uploading...</p>
          </div>
        )}
        <Dragger {...props}>
          <p>
            <InboxOutlined />
          </p>
          <p>Click or drag file to this area to upload</p>
          <p>
            Support for a single or bulk upload.
            <b> Uploaded background added in bottom last.</b>
          </p>
        </Dragger>
      </div>
    </div>
  );
}
