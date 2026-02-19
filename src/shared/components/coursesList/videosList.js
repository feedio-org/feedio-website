/* eslint-disable no-unused-vars */
import { DeleteOutlined, EditOutlined, EyeFilled } from "@ant-design/icons";
import { Button, Image, Pagination, Popconfirm, Popover, Progress } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getVideoById } from "../../../pages/courseIndex/redux/topicContentSlice";
import {
  deleteShortVideoById,
  getVideosList,
  searchCourseVideoList,
} from "../../../pages/dashboard/redux/courseSlice";
import { VaTitle } from "../typography";
import styles from "./courseslist.module.scss";

export default function VideosList(props) {
  const dispatch = useDispatch();
  const {
    data,
    isProgress,
    showGenerateModal,
    showPreviewModal,
    videoName,
    handlePreviewVideoOpen,
    shortData,
  } = props;
  const ITEMS_PER_PAGE = 15; // Number of items per page
  const [hovered, setHovered] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedShortVideoId, setSelectedShortVideoId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total number of pages
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  // Get current items based on the current page
  const currentItems = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const generateVideo = (data) => {
    videoName(data?.title);
    dispatch(getVideoById({ video_id: data?.video_id }));
    showGenerateModal();
  };

  const playVideo = (topicData) => {
    shortData(topicData);

    videoName(topicData?.title);
    showPreviewModal();
  };

  const hoveredContent = (data) => {
    if (data && data.video_status === "VIDEO_UPLOADED") {
      return <div>Video is generated, please preview the video.</div>;
    } else if (
      data &&
      (data.video_status === "QUEUED" ||
        data.video_status === "PROCESSING_STARTED" ||
        data.video_status === "AUDIO_GENERATED" ||
        data.video_status === "SCENE_VIDEOS_GENERATED" ||
        data.video_status === "FINAL_VIDEO_GENERATED")
    ) {
      return <p>Video is being generated</p>;
    } else if (data && data.video_status === "NO_VIDEO") {
      return <div>Content is Generated, but Video is not yet generated.</div>;
    } else {
      return <div>Content is not yet generated. please generate Content.</div>;
    }
  };

  const handleHoverChange = (open, topicId) => {
    if (open) {
      setHoveredRow(topicId);
    } else {
      setHoveredRow(null);
    }
  };

  const deleteVideo = async(event, topicId) => {
    event.preventDefault();
    setConfirmLoading(true);

    // Show a loading toast while the deletion is in progress
    const loadingToastId = toast.loading("Deleting video...");

    // Dispatch deleteShortVideoById and wait for it to complete
    const resultAction = await dispatch(
      deleteShortVideoById({ video_id: topicId })
    );

    // Check if the deletion was successful before making another API call
    if (deleteShortVideoById.fulfilled.match(resultAction)) {
      setOpen(false);
      setConfirmLoading(false);
      setSelectedShortVideoId(null);
      // If successful, update the loading toast to a success message
      toast.success("Video deleted successfully!", { id: loadingToastId });
      // Dispatch getCourseById to fetch the updated course data
      dispatch(getVideosList());
    } else {
      // If the deletion failed, update the loading toast to an error message
      toast.error(
        `Failed to delete video: ${
          resultAction.payload || resultAction.error.message
        }`,
        { id: loadingToastId }
      );
    }
  };

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const showPopconfirm = (event, videoId) => {
    setOpen(true);
    setSelectedShortVideoId(videoId);
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedShortVideoId(null);
  };

  return (
    <div key={data?.video_id}>
      <div
        className={styles.wrapper}
        style={{ justifyContent: currentItems.length > 6 && "space-evenly" }}
      >
        {currentItems.map((item) => (
          <Link key={item.id} className={styles.card}>
            <div
              style={{
                display: "flex",
                justifyContent: "left",
                backgroundColor: "#F4F6FF",
              }}
            >
              <Image
                preview={false}
                src={
                  item.video_status === "VIDEO_UPLOADED"
                    ? item.thumbnail_location // Show thumbnail if video is uploaded
                    : require("../../../asset/images/course.png") // Otherwise, show course.png
                }
                style={{
                  height: "130px",
                  borderRadius: "10px 10px 0 0",
                  width: "25rem",
                }}
                onClick={() => {
                  const processingStatuses = [
                    "QUEUED",
                    "PROCESSING_STARTED",
                    "AUDIO_GENERATED",
                    "SCENE_VIDEOS_GENERATED",
                    "FINAL_VIDEO_GENERATED",
                  ];

                  if (processingStatuses.includes(item.video_status)) {
                    return; // Prevent action if video is not ready
                  }

                  if (item.video_status === "VIDEO_UPLOADED") {
                    playVideo(item); // Call playVideo function instead of redirecting
                  } else {
                    generateVideo(item);
                  }
                }}
              />
            </div>
            <div className={styles.footer}>
              <div className={styles.title}>
                <VaTitle
                  level={5}
                  ellipsis={{
                    rows: 2,
                  }}
                  text={item?.title}
                  onClick={() => {
                    if (
                      item.video_status === "QUEUED" ||
                      item.video_status === "PROCESSING_STARTED" ||
                      item.video_status === "AUDIO_GENERATED" ||
                      item.video_status === "SCENE_VIDEOS_GENERATED" ||
                      item.video_status === "FINAL_VIDEO_GENERATED"
                    ) {
                      return;
                    }
                    generateVideo(item);
                  }}
                />
              </div>
              <div className={styles.actions}>
                <Button
                  type="text"
                  disabled={
                    item.video_status === "QUEUED" ||
                    item.video_status === "PROCESSING_STARTED" ||
                    item.video_status === "AUDIO_GENERATED" ||
                    item.video_status === "SCENE_VIDEOS_GENERATED" ||
                    item.video_status === "FINAL_VIDEO_GENERATED"
                  }
                  icon={<EditOutlined />}
                  onClick={() => generateVideo(item)}
                />
                <Popconfirm
                  title="Delete Shorts"
                  description={`Are you sure to delete this Video : ${item.title}.`}
                  open={selectedShortVideoId === item.video_id}
                  onConfirm={(event) => deleteVideo(event, item?.video_id)}
                  okButtonProps={{
                    loading: confirmLoading,
                  }}
                  onCancel={handleCancel}
                >
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={(event) => showPopconfirm(event, item?.video_id)}
                  />
                </Popconfirm>
                <Popover
                  style={{ width: 500 }}
                  content={hoveredContent(item)}
                  title="Video Status"
                  trigger="hover"
                  open={hoveredRow === item.video_id}
                  onOpenChange={(open) =>
                    handleHoverChange(open, item.video_id)
                  }
                >
                  <Button
                    type="text"
                    disabled={item?.progress < 100}
                    icon={<EyeFilled />}
                    onClick={() => playVideo(item)}
                  />
                </Popover>
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "black",
                  fontWeight: "300",
                  marginTop: "10px",
                }}
              >
                <strong>Created On : </strong>
                <span style={{ color: "#1890ff", fontWeight: "bold" }}>
                  {item?.created_on &&
                  !isNaN(new Date(item.created_on).getTime())
                    ? `${new Date(item.created_on).getDate()}-${new Date(item.created_on).toLocaleString("default", {month: "short",})}-${new Date(item.created_on).getFullYear()}`
                    : "N/A"}
                </span>
              </div>
              <div className={styles.title}>
                <Progress
                  percent={item.progress}
                  strokeColor="#1890ff"
                  trailColor="#f0f0f0"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
      {/* <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
          width: '100%'
        }}
      > */}
      {searchCourseVideoList && data.length > 15 && (
        <Pagination
          current={currentPage}
          align="center"
          total={data.length}
          pageSize={ITEMS_PER_PAGE}
          onChange={(page) => setCurrentPage(page)}
          style={{
            marginTop: "20px",
          }}
        />
      )}
      {/* </div> */}
    </div>
  );
}
