import { DeleteOutlined, DownloadOutlined, EditOutlined, QuestionCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { Avatar, Button, Modal, Popconfirm,Form, Popover, Upload } from "antd";
import { useEffect, useState } from "react";
import { ImageEditForm } from "./forms";
import styles from "./generate.module.scss";

export default function Images({ onFileSelect, onFileRemove, fileList, currentSceneImageName, handleMediaProperty }) {

  
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [imageInitialValues, setImageInitialValues] = useState({ width: 0, height: 0 });

  const [form] = Form.useForm();
  console.log(uploadedFileName);

  // useEffect(() => {
  //   form.resetFields();
  // }, [openEditModal]);


  useEffect(() => {
    const imageUrl = `https://va-sc-images.s3.amazonaws.com/${currentSceneImageName}`;

    getImageDimensions(imageUrl)
      .then(({ width, height }) => {
        setImageInitialValues({ width, height });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentSceneImageName]);


  const handleFileChange = ({ fileList }) => {
    if (fileList && fileList.length > 0) {
      const file = fileList[0].originFileObj;
      setUploadedFileName(file.name);
      setLoading(true);
      // Simulating async file upload for demo purposes (you can replace this with actual upload logic)
      setTimeout(() => {
        onFileSelect({ fileList });
        setLoading(false);
      }, 2000);
    } else {
      setUploadedFileName(null);
    }
  };
  const handleDeleteImage = async() => {
    try {
      if (onFileRemove) {
        await onFileRemove(); // Remove the file (from S3, for example)
      }
      setUploadedFileName(null);
      currentSceneImageName("");
      return true;
    } catch (error) {
      return false;
    }
  };

  const downloadFile = (fileUrl) => {
    setDownloadLoading(true);
    console.log("fileUrl", fileUrl);

    if (!fileUrl) {
      setDownloadLoading(false);
      return;
    }

    const link = document.createElement("a");
    link.href = fileUrl;
    link.click();

    setDownloadLoading(false);
  };


  const getImageDimensions = (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = (error) => {
        reject("Error loading image");
      };
      img.src = imageUrl;
    });
  };



  const helpImgUploadContent = (
    <div>
      <h3>Image Search & Upload:</h3>
      <li>
        <ol>
          <strong>1. Search:</strong> Type a keyword and search.
        </ol>
        <ol>
          <strong>2. Select:</strong> Right-click on an image.
        </ol>
        <ol>
          <strong>3. Download:</strong> Save it.
        </ol>
        <ol>
          <strong>4. Upload:</strong> Click the upload button (📤).
        </ol>
      </li>
    </div>
  );

  return (
    <div
      className={styles.backgroundWrapper}
      style={{
        gridTemplateColumns: "repeat(1, 1fr)",
        overflow: "hidden",
        position: "relative"
      }}
    >
      {/* Upload Button */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Upload
          multiple={false}
          onChange={handleFileChange}
          beforeUpload={() => false}
          fileList={fileList}
          accept="image/*,video/mp4"
        >
          <Button type="primary" size="medium" shape="round" loading={loading} style={{
            marginBottom: "10px",
            marginRight: "20px",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          icon={<UploadOutlined />}
          >
            Upload
          </Button>
        </Upload>
      </div>

      {/* Uploaded Image Info & Delete Button */}
      <div
        style={{ display: "flex", alignItems: "center", position: "relative" }}
      >
        {currentSceneImageName !== null && currentSceneImageName !== "" ? (
          <>
            <Avatar src={`https://va-sc-images.s3.amazonaws.com/${currentSceneImageName}`} shape="square" size={60} style={{ marginRight: "10px" }}/>

            {/* <p className={styles.uploadedFileName} style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "150px",
              position: "relative"}}>
              {currentSceneImageName || uploadedFileName}
            </p> */}

            <Button type="text" icon={<EditOutlined />}
              style={{ marginInline: "1rem" }}
              onClick={() => setOpenEditModal(true)}
            />
            <Button type="text" icon={<DownloadOutlined />} disabled={downloadLoading || !currentSceneImageName}
              style={{ marginInline: "1rem" }} onClick={() => downloadFile(`https://va-sc-images.s3.amazonaws.com/${currentSceneImageName}`)}
            />

            <Popconfirm title="Are you sure to delete current Scene Image?"
              onConfirm={handleDeleteImage} okText="Yes" cancelText="No" >
              <Button type="text" icon={<DeleteOutlined style={{ color: "red" }} />}
                style={{ marginRight: "1rem" }}/>
            </Popconfirm>
            {/* Uploaded File Name */}
          </>
        ) : (
          <p className={styles.noImageText}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "150px",
              color: "#507687"
            }}>
            <strong>No image uploaded</strong>
          </p>
        )}
      </div>

      {/* Help and Note */}
      <div style={{ marginTop: "10px" }}>
        <p style={{ marginLeft: "20px" }}>
          <strong>Note:</strong> Use the search bar below to find more images.
          <Popover content={helpImgUploadContent}>
            <QuestionCircleOutlined
              style={{
                fontSize: "14px",
                cursor: "pointer",
                marginLeft: "10px"
              }}
            />
          </Popover>
        </p>
      </div>
      <div className="gcse-search"></div>

      <Modal
        title="Image Editor"
        open={openEditModal}
        onCancel={() => {setOpenEditModal(false); form.resetFields();}}
        footer={[
          <Button key="back" onClick={() => {setOpenEditModal(false); form.resetFields();}}>Return</Button>,
          <Button key="submit" type="primary" onClick={() => { form.submit();  setOpenEditModal(false);}}>Confirm</Button>
        ]}>
        <ImageEditForm onFinish={handleMediaProperty} form={form} imageInitialValues={imageInitialValues}/>
      </Modal>
    </div>
  );
}
