/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import {
  DeleteOutlined,
  EditOutlined,
  PlaySquareOutlined
} from "@ant-design/icons";
import { Button, Modal, Popconfirm, Popover, Progress } from "antd";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import Generate from "shared/components/generate";
import Preview from "shared/components/generate/preview";
import { VaText, VaTitle } from "shared/components/typography";
import { deleteVideoById, getCourseById } from "../dashboard/redux/courseSlice";
import styles from "./courseIndex.module.scss";
import { generateTopicContent } from "./redux/topicContentSlice";

export default function Indexing(props) {
  const dispatch = useDispatch();
  const generateRef = useRef(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isGenerateDisabled, setIsGenerateDisabled] = useState(false);
  const [isPptDisabled, setIsPptDisabled] = useState(false);
  const previewRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [titleName, setTitleName] = useState("");
  const [selectedShortData, setSelectedShortData] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [deleteTopic, setDeleteTopic] = useState(null);


  const sortedTopicData = props?.data?.lesson_topics
    .slice()
    .sort((a, b) => a.topic_index - b.topic_index);

  const viewSceneDetails = (event, scenes, lessonData) => {
    event.preventDefault();

    const topicName = scenes.topic_title;
    const topicId = scenes.topic_id;

    dispatch(
      generateTopicContent({
        topic: topicName,
        video_id: topicId,
        course_id: props?.courseId
      })
    );
    setTitleName(topicName);
    showModal();
  };
  const showModal = () => {
    setIsModalOpen(true);
    setIsButtonDisabled(true); // Disable the button when the modal opens
    props.modalPopupOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    props.modalPopupOpen(false);
  };

  const getLessonIdByTopicId = (lessonData, topicId) => {
    const { lesson_topics, lesson_id } = lessonData;

    for (let i = 0; i < lesson_topics.length; i++) {
      if (lesson_topics[i].topic_id === topicId) {
        return lesson_id;
      }
    }

    return null; // Return null if no matching topic_id is found
  };

  const updateScene = () => {
    if (generateRef.current) {
      generateRef.current.updateScene();
      setIsButtonDisabled(true); // Optionally disable the button again after updating
      setIsGenerateDisabled(false);
      setIsPptDisabled(false);
    }
  };

  const generateVideoContent = () => {
    setIsGenerateDisabled(false);
    if (generateRef.current) {
      generateRef.current.generateVideoContent();
    }
  };

  const generatePptContent = () => {
    setIsPptDisabled(false);
    if (generateRef.current) {
      generateRef.current.generatePptContent();
    }
  };

  const handlePreviewClose = () => {
    setIsPreviewModalOpen(false);
    props.modalPopupOpen(false);
  };

  const handlePreviewVideoOpen = () => {
    setIsPreviewModalOpen(true);
    props.modalPopupOpen(true);
  };

  const playVideo = (event, topicData) => {
    event.preventDefault();

    setSelectedShortData(getVideoStatus(topicData));

    setTitleName(topicData.topic_title);
    handlePreviewVideoOpen();
  };

  const getVideoStatus = (topicData) => {

    return props?.generatedVideoList?.video_status?.videos.filter(
      (video) => video.video_id === topicData.topic_id
    )[0];
  };

  // Function to check if a video_id exists in the video_status array
  const checkVideoExists = (videoId) => {
    return props?.generatedVideoList?.video_status?.videos.some(
      (video) =>
        video.video_id === videoId && video.video_status === "VIDEO_UPLOADED"
    );
  };

  const checkVideoIsInprogress = (videoId) => {
    const isInProgress = props?.generatedVideoList?.video_status?.videos.some(
      (video) =>
        video.video_id === videoId &&
        (video.video_status === "QUEUED" ||
          video.video_status === "PROCESSING_STARTED" ||
          video.video_status === "AUDIO_GENERATED" ||
          video.video_status === "SCENE_VIDEOS_GENERATED" ||
          video.video_status === "FINAL_VIDEO_GENERATED")
    );


    return isInProgress;
  };

  const handleHoverChange = (open, topicId) => {
    if (open) {
      setHoveredRow(topicId);
    } else {
      setHoveredRow(null);
    }
  };

  const hoveredContent = (topicData) => {
    let data = getVideoStatus(topicData);

    if (data && data.video_status === "VIDEO_UPLOADED") {
      return <div>Video rendering completed. View preview</div>;
    } else if (
      data &&
      (data.video_status === "QUEUED" ||
        data.video_status === "PROCESSING_STARTED" ||
        data.video_status === "AUDIO_GENERATED" ||
        data.video_status === "SCENE_VIDEOS_GENERATED" ||
        data.video_status === "FINAL_VIDEO_GENERATED")
    ) {
      return <p>Processing video, please stand by</p>;
    } else if (data && data.video_status === "NO_VIDEO") {
      return (
        <div>
          The content is finalized, please move forward to generate video.
        </div>
      );
    } else {
      return (
        <div>
          content generation is required before proceeding, Please initiate the process
        </div>
      );
    }
  };

  const progressData = (item) => {
    const videoStatus = getVideoStatus(item);
    const progressValue = videoStatus ? videoStatus.progress : 0;

    return progressValue;
  };

  const deleteVideo = async(event, topicId) => {
    event.preventDefault();
    setConfirmLoading(true);
    // Show a loading toast while the deletion is in progress
    const loadingToastId = toast.loading("Deleting video...");

    // Dispatch deleteVideoById and wait for it to complete
    const resultAction = await dispatch(
      deleteVideoById({
        lesson_id: props?.lessonId,
        course_id: props?.courseId,
        video_id: topicId
      })
    );

    // Check if the deletion was successful before making another API call
    if (deleteVideoById.fulfilled.match(resultAction)) {
      setOpen(false);
      setConfirmLoading(false);
      setDeleteTopic(null);

      // If successful, update the loading toast to a success message
      toast.success("Video deleted successfully!", { id: loadingToastId });
      // Dispatch getCourseById to fetch the updated course data
      dispatch(getCourseById({ course_id: props?.courseId }));
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

  const handleUserInteraction = () => {
    setIsButtonDisabled(false); // Enable the button after any user interaction
    setIsGenerateDisabled(true);
    setIsPptDisabled(true);
  };

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const showPopconfirm = (topicId) => {
    setOpen(true);
    setDeleteTopic(topicId);
  };

  const handleDeleteCancel = () => {
    setOpen(false);
    setDeleteTopic(null);
  };

  return (
    <div className={styles.wrapperIndex}>
      <div className={styles.index}>
        <div className={styles.heading}>
          <VaTitle
            className={styles.h5}
            level={5}
            text={props.data.lesson_title}
          />
          <div className={styles.actions}>
            {/* <Button type="text" icon={<EditOutlined />} />
            <Button type="text" icon={<VideoCameraAddOutlined />} />
            <Button type="text" icon={<DeleteOutlined />} /> */}
          </div>
        </div>
        <div className={styles.indexList}>
          {sortedTopicData.map((item) => (
            <div key={item.topic_id} className={styles.indexLabel}>
              <VaText className={styles.text} text={item.topic_title} />
              {/* <VaText className={styles.text} text="3 minutes" /> */}
              <Progress
                className={styles.progress}
                percent={progressData(item)}
                strokeColor="#1890ff"
                trailColor="#f0f0f0"
              />
              <div className={styles.actions}>
                <Button
                  type="text"
                  disabled={checkVideoIsInprogress(item?.topic_id)}
                  onClick={(event) =>
                    viewSceneDetails(event, item, props?.data)
                  }
                  icon={<EditOutlined />}
                />
                <Popconfirm
                  title="Delete Topic"
                  description={`Are you sure to delete this Topic : ${item.topic_title}.`}
                  // open={open}
                  open={deleteTopic === item.topic_id}
                  onConfirm={(event) => deleteVideo(event, item?.topic_id)}
                  okButtonProps={{
                    loading: confirmLoading
                  }}
                  onCancel={handleDeleteCancel}
                >
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => showPopconfirm(item.topic_id)}
                  />
                </Popconfirm>
                <Popover
                  style={{ width: 500 }}
                  content={hoveredContent(item)}
                  title="Video Status"
                  trigger="hover"
                  open={hoveredRow === item.topic_id}
                  onOpenChange={(open) =>
                    handleHoverChange(open, item.topic_id)
                  }
                >
                  <Button
                    type="text"
                    disabled={!checkVideoExists(item?.topic_id)}
                    icon={<PlaySquareOutlined />}
                    onClick={(event) => playVideo(event, item)}
                  />
                </Popover>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal
        title={titleName}
        open={isModalOpen}
        onCancel={handleCancel}
        width={"99vw"}
        centered
        height={"99vh"}
        maskClosable={false} // Prevents closing on click outside
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="back"
            onClick={updateScene}
            disabled={isButtonDisabled}
            type="primary"
          >
            Update Scene
          </Button>,
          <Button key="submit" type="primary" onClick={generateVideoContent} disabled={isGenerateDisabled}>
            Generate Video
          </Button>,
          <Button key="submit" type="primary" onClick={generatePptContent} disabled={isPptDisabled}>
            Download PPT
          </Button>
        ]}
      >
        <div
          className={styles.formWrapper}
          onClick={handleUserInteraction}
          onKeyUp={handleUserInteraction}
        >
          <Generate ref={generateRef} handleCancel={handleCancel} />
        </div>
      </Modal>
      <Modal
        id="video-panel"
        title={titleName}
        open={isPreviewModalOpen}
        width={"99vw"}
        centered
        height={"99vh"}
        onCancel={handlePreviewClose}
        destroyOnClose={true}
        footer={[]}
        maskClosable={false} // Prevents closing on click outside
      >
        <div className={styles.formWrapper}>
          <Preview ref={previewRef} selectedShortData={selectedShortData} />
        </div>
      </Modal>
    </div>
  );
}
