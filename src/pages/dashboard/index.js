/* eslint-disable no-unused-vars */

import { DownCircleOutlined, FilePdfOutlined, FileTextOutlined, InboxOutlined, InfoCircleOutlined, LinkOutlined, ReadOutlined, UpCircleOutlined,
  VideoCameraAddOutlined, VideoCameraFilled, VideoCameraOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Modal, Result, Row, Select, Spin, Switch, Tabs, Upload } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import CoursesList from "shared/components/coursesList";
import VideosList from "shared/components/coursesList/videosList";
import Generate from "shared/components/generate";
import Preview from "shared/components/generate/preview";
import { VaTitle } from "shared/components/typography";
import SideImage1 from "../../asset/images/sideimage 1.png";
import SideImage2 from "../../asset/images/sideimage 2.png";
import SideImage3 from "../../asset/images/sideimage 3.png";
import SideImage4 from "../../asset/images/sideimage 4.png";
import styles from "./courses.module.scss";

import axios from "axios";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { createVideo, generateVideoByPdf, generateVideoByText, generateVideoByUrl, } from "../courseIndex/redux/topicContentSlice";
import ScenesSelect from "./components/scenesSelect";
import { clearCourseState, createCourse, getCoursesList, getFileUrl, getVideosList, } from "./redux/courseSlice";
import { getBgImagesList } from "./redux/lovSlice";
import AspectSelect from "./components/aspectSelect";

const { Option } = Select;

export default function Courses() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const generateRef = useRef(null);
  // const [isReloadVideosFlag, setIsReloadVideosFlag] = useState(
  //   getCookie('reloadVideosFlag')
  // );
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isGenerateDisabled, setIsGenerateDisabled] = useState(false);
  const [isPptDisabled, setIsPptDisabled] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isShortVideoModalOpen, setIsShortVideoModalOpen] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [videoName, setVideoName] = useState("");
  const [selectedShortData, setSelectedShortData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState("");
  const [shortActionType, setShortActionType] = useState("");
  const [isHelpVideoModalOpen, setIsHelpVideoModalOpen] = useState(false);
  const [sceneTextColor, setSceneTextColor] = useState({
    title: "#ffffff",
    content: "#ffffff",
  });
  const [videoSrc, setVideoSrc] = useState(
    "https://www.youtube.com/embed/dePZEfENAQg?si=h2GUiGUiGEN2kgcW"
  );
  const [isTextToVideoHelpModalOpen, setIsTextToVideoHelpModalOpen] =
    useState(false);
  const [textToVideoSrc, setTextToVideoSrc] = useState("");
  const [isWatermarkEnabled, setIsWatermarkEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfVideoModalOpen, setIsPdfVideoModalOpen] = useState(false);
  const [uuid, setUuid] = useState("");
  const [pdfFileUploadUrl, setPdfFileUploadUrl] = useState(null);
  const [language, setLanguage] = useState("english");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState("1");

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  useEffect(() => {
    form.resetFields();
  }, [activeTabKey]);

  const {
    coursesListStatus,
    coursesList,
    videosListStatus,
    videosList,
    reloadVideosFlag,
    reloadCoursesFlag,
  } = useSelector((state) => state.course);
  const { isSearching } = useSelector((state) => state.course);

  const { Dragger } = Upload;

  const [textToVideoForm] = Form.useForm();
  const [urlToVideoForm] = Form.useForm();
  const [pdftoVideoForm] = Form.useForm();

  useEffect(() => {
    if (
      !isShortVideoModalOpen &&
      !isGenerateModalOpen &&
      !isCourseModalOpen &&
      !isPreviewModalOpen
    ) {
      dispatch(getCoursesList());

      const fetchVideos = () => {
        dispatch(getVideosList());
      };

      // Fetch videos immediately on mount
      fetchVideos();

      // Set an interval to fetch videos every 1 minute (60000 milliseconds)
      const intervalId = setInterval(() => {
        fetchVideos();
      }, 60000);

      // Clear the interval when the component unmounts
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [
    dispatch,
    isShortVideoModalOpen,
    isGenerateModalOpen,
    isCourseModalOpen,
    isPreviewModalOpen,
  ]);

  useEffect(() => {
    dispatch(clearCourseState());
  }, []);

  useEffect(() => {
    dispatch(getBgImagesList());
  }, []);

  const openCourse = (data) => {
    // dispatch(getCourseById({ course_id: data?.course_id }));
    navigate(`/dashboard/${data?.course_id}`);
  };

  const showCourseModal = () => {
    setIsCourseModalOpen(true);
  };

  const showShortVideoModal = () => {
    setIsButtonDisabled(true); // Disable the button when the modal opens
    setIsShortVideoModalOpen(true);
  };

  const showPdfVideoModal = async() => {
    try {
      const newUuid = uuidv4(); // Generate a new UUID
      setUuid(newUuid.slice(0, 8));
      let params = {
        file_id: newUuid.slice(0, 8), //unique id
        file_type: "pdf",
      };
      const response = await dispatch(getFileUrl(params));
      if (response?.type === "course/getFileUrl/fulfilled") {
        setPdfFileUploadUrl(response?.payload?.data);
        setIsPdfVideoModalOpen(true);
      } else {
        toast.error(response);
      }
    } catch (error) { }
  };

  const handleCancelCourse = () => {
    setIsCourseModalOpen(false);
  };

  const handleCancelShortVideo = () => {
    setIsShortVideoModalOpen(false);
    setShowAdvancedOptions(false);
    form.resetFields();
  };

  const showGenerateModal = () => {
    setIsGenerateModalOpen(true);
  };


  const handleGenerateCancel = () => {
    setIsGenerateModalOpen(false);
    dispatch(getVideosList());
    textToVideoForm.resetFields(); // Reset Text form
    urlToVideoForm.resetFields(); // Reset URL form
  };

  const handleGenerateCancelBtn = () => {
    setIsGenerateModalOpen(false);
  };
  const showPreviewModal = () => {
    setIsPreviewModalOpen(true);
  };

  const handlePreviewCancel = () => {
    setIsPreviewModalOpen(false);
  };

  const shortData = (data) => {
    setSelectedShortData(data);
  };

  const onFinishCourse = async(values) => {
    let courseName = values.courseName;
    setVideoName(courseName);
    setLoading(true); // Start loading

    try {
      // let data = await dispatch(createCourse({ topic: courseName }));

      const resultAction = await dispatch(createCourse({ topic: courseName }));

      // Check if the action was successful
      if (createCourse.fulfilled.match(resultAction)) {
        // Extract course ID from the payload
        const courseId = resultAction?.payload?.data?.course?.course_id; // Adjust according to your response structure

        // Navigate to the new course page using the course ID
        navigate(`/dashboard/${courseId}`);

        // Optionally, you can refresh the course list
        dispatch(getCoursesList());

        // Optionally handle UI state changes or modal closures
        handleCancelCourse();
      } else {
        // Handle errors if needed
        console.error("Failed to create course:", resultAction.payload);
      }
    } catch (error) {
      console.error("Error creating course:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const uploadProps = {
    name: "file",
    multiple: false,
    action: "/upload", // Replace with your upload handling endpoint
    beforeUpload: (file) => {
      const isFileAllowed =
        file.type === "application/pdf" ||
        file.type === "application/vnd.ms-powerpoint";
      if (!isFileAllowed) {
        toast.error("You can only upload PDF or PPT files!");
      }
      return isFileAllowed || Upload.LIST_IGNORE;
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        toast.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        toast.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const onFinishFailed = (errorInfo) => { };

  const handleWatermarkToggleChange = (checked) => {
    setIsWatermarkEnabled(checked); // Update the state based on switch position (on/off)
  };

  const onFinishShortVideo = (values) => {

    const videoName = values.courseName;
    const additionalContext = values.additionalContext || "";
    const aspectRatio = values.aspectRatio || "16:9";
    const slidesCount = values.noOfSlides || "5-10";
    const language = values.language || "english";

    // Use the switch state to determine watermark value
    const watermark = isWatermarkEnabled ? "true" : "false"; // Pass 'True' if switch is on, 'False' if off

    let ai_generate = false;

    if (shortActionType === "shortGenerateByAI") {
      ai_generate = true;
      // Handle "Generate by AI" logic

      setVideoName(videoName);

      // API request to create video with the new features
      dispatch(
        createVideo({
          topic: videoName,
          ai_generate: "true",
          // fast_generation: "true",
          additional_context: additionalContext,
          aspect_ratio: aspectRatio,
          slides_count: slidesCount,
          language: language,
          watermark: watermark,
          scene_text_color: sceneTextColor,
        })
      );
      handleCancelShortVideo();
      showGenerateModal();
      dispatch(getVideosList());
      setIsCreateModalOpen(false);
    } else if (shortActionType === "shortCustomGenerate") {
      // Handle "Custom Generate" logic

      setVideoName(videoName);

      // API request to create video with the new features
      dispatch(
        createVideo({
          topic: videoName,
          ai_generate: "false",
          // fast_generation: "true",
          additional_context: additionalContext,
          aspect_ratio: aspectRatio,
          slides_count: slidesCount,
          language: language,
          watermark: watermark,
          scene_text_color: sceneTextColor,
        })
      );
      setIsCreateModalOpen(false);
      handleCancelShortVideo();
      showGenerateModal();
      dispatch(getVideosList());
    }
  };

  const generateVideoContent = () => {
    if (generateRef.current) {
      generateRef.current.generateVideoContent(); // Call the method exposed by Generate component
      handlePreviewCancel();
    }
  };
  const updateScene = () => {
    if (generateRef.current) {
      generateRef.current.updateScene(); // Call the method exposed by Generate component
      setIsButtonDisabled(true); // Optionally disable the button again after updating
      setIsGenerateDisabled(false);
      setIsPptDisabled(false);
      textToVideoForm.resetFields(); // Reset Text form
      urlToVideoForm.resetFields(); // Reset URL form
    }
  };

  const handleBothActions = () => {
    setIsGenerateDisabled(false);
    generateVideoContent(); // Generates video content
    handleGenerateCancelBtn(); // Closes the modal
    textToVideoForm.resetFields(); // Reset Text form
    urlToVideoForm.resetFields(); // Reset URL form
  };

  const generatePptContent = () => {
    setIsPptDisabled(false);
    if (generateRef.current) {
      generateRef.current.generatePptContent();
      textToVideoForm.resetFields(); // Reset Text form
      urlToVideoForm.resetFields(); // Reset URL form
    }
  };

  const loadCourseVideoDetails = () => {
    if (
      (coursesListStatus === "succeeded" &&
        coursesList?.data?.courses?.length > 0) ||
      (videosListStatus === "succeeded" && videosList?.data?.videos?.length > 0)
    ) {
      return (
        <>
          {reloadVideosFlag &&
            videosListStatus === "succeeded" &&
            videosList?.data?.videos?.length > 0 && (
            <div className={styles.featuredCourse}>
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <VideoCameraFilled style={{ marginRight: "8px" }} />
                <VaTitle level={4} text="Shorts Videos" />
              </div>
              <div className={styles.list}>
                <VideosList
                  data={videosList?.data?.videos}
                  isProgress={false}
                  showPreviewModal={showPreviewModal}
                  showGenerateModal={showGenerateModal}
                  videoName={setVideoName}
                  shortData={shortData}
                />
              </div>
            </div>
          )}
          {reloadCoursesFlag &&
            coursesListStatus === "succeeded" &&
            coursesList?.data?.courses?.length > 0 && (
            <div className={styles.featuredCourse}>
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <ReadOutlined style={{ marginRight: "8px" }} />
                <VaTitle level={4} text="Your Courses" />
              </div>
              <div className={styles.list}>
                <CoursesList
                  data={coursesList?.data?.courses}
                  openCourse={openCourse}
                />
              </div>
            </div>
          )}
        </>
      );
    } else {
      if (isSearching) {
        return (
          <Result
            style={{ overflow: "hidden", marginTop: "100px" }}
            title={
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: "initial",
                  color: "GrayText",
                  textAlign: "center",
                  marginTop: "-10px",
                }}
              >
                No search results found
              </div>
            }
            subTitle={
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "normal",
                  color: "#FF9100",
                  textAlign: "center",
                  marginTop: "5px",
                }}
              >
                Try adjusting your search criteria or keywords
              </div>
            }
          />
        );
      } else {
        if (
          coursesListStatus === "succeeded" &&
          videosListStatus === "succeeded"
        ) {
          return (
            <div className={`${styles.wrapper} py-5`}>
              <Row
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #f0f0f0, #FFBD73)",
                  borderRadius: "50px",
                }}
              >
                <Col>
                  <Row style={{ marginTop: "25px", paddingBottom: "50px" }}>
                    <p
                      style={{
                        fontWeight: "bolder",
                        fontSize: "18px",
                        paddingLeft: "343px",
                        marginTop: "30px",
                        backgroundImage:
                          "linear-gradient(to left, #87A2FF, #FF9D3D)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        textFillColor: "transparent",
                      }}
                    >
                      SHORT VIDEO GENERATION
                    </p>
                    <div className={styles.SideImage1}>
                      {/* <span className={styles.borderBg}></span> */}
                      <img src={SideImage1} alt="img" />
                      <p
                        style={{
                          fontSize: "16px",
                          color: "#606676",
                          paddingLeft: "105px",
                          paddingRight: "50px",
                          marginTop: "20px",
                          fontWeight: "normal",
                        }}
                      >
                        Create stunning short videos in minutes with Feedio.ai,
                        utilizing AI generation or custom options. Enjoy
                        advanced features like multiple languages, AI content
                        creation, and customizable content for high-quality
                        results!
                        <div style={{ marginTop: "30px" }}>
                          <Button
                            onClick={showShortVideoModal}
                            icon={<VideoCameraOutlined />}
                            type="primary"
                            size="middle"
                          >
                            Short Video
                          </Button>
                          <Button
                            type="default" // Set the button type to default for grey color
                            icon={<InfoCircleOutlined />}
                            onClick={openHelpVideoModal}
                            style={{ marginLeft: "20px", border: "10px" }}
                          >
                            How to use
                          </Button>
                        </div>
                      </p>
                    </div>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row style={{ marginTop: "10px", paddingBottom: "50px" }}>
                    <p
                      style={{
                        fontWeight: "bolder",
                        fontSize: "20px",
                        paddingLeft: "100px",
                        marginTop: "20px",
                        backgroundImage:
                          "linear-gradient(to left, #87A2FF, #FF9D3D)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        textFillColor: "transparent",
                      }}
                    >
                      TEXT TO VIDEO
                    </p>
                    <div className={styles.SideImage2}>
                      <p
                        style={{
                          fontSize: "16px",
                          paddingLeft: "5px",
                          paddingRight: "50px",
                          marginTop: "20px",
                        }}
                      >
                        Transform your text into engaging videos effortlessly
                        with Feedio.ai's Text-to-Video feature. Our AI generates
                        detailed content, allowing you to add scenes and create
                        captivating presentations seamlessly!
                        <div style={{ marginTop: "30px" }}>
                          <Button
                            onClick={showModal}
                            icon={<FileTextOutlined />}
                            type="primary"
                          >
                            Text to Video
                          </Button>
                          <Button
                            icon={<InfoCircleOutlined />}
                            onClick={openTextToVideoHelpModal}
                            style={{ marginLeft: "20px" }}
                          >
                            How to use
                          </Button>
                        </div>
                      </p>
                      {/* <span className={styles.borderBg}></span> */}
                      <img src={SideImage2} alt="img" />
                    </div>
                  </Row>
                </Col>
              </Row>
              <Row
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #f0f0f0, #C4E1F6)",
                  borderRadius: "50px",
                }}
              >
                <Col>
                  <Row style={{ marginTop: "10px", paddingBottom: "50px" }}>
                    <p
                      style={{
                        fontWeight: "bolder",
                        fontSize: "20px",
                        paddingLeft: "350px",
                        marginTop: "10px",
                        backgroundImage:
                          "linear-gradient(to left, #87A2FF, #FF9D3D)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        textFillColor: "transparent",
                      }}
                    >
                      URL TO VIDEO
                    </p>
                    <div className={styles.SideImage3}>
                      {/* <span className={styles.borderBg}></span> */}
                      <img src={SideImage3} alt="img" />
                      <p
                        style={{
                          fontSize: "16px",
                          paddingLeft: "105px",
                          paddingRight: "50px",
                          marginTop: "20px",
                        }}
                      >
                        Turn any public webpage into a dynamic video with
                        Feedio.ai's URL to Video feature. Simply input the URL,
                        and our AI generates engaging content while offering
                        advanced options for customization.
                        <div style={{ marginTop: "30px" }}>
                          <Button
                            onClick={showModal}
                            icon={<FileTextOutlined />}
                            type="primary"
                          >
                            URL to Video
                          </Button>
                        </div>
                      </p>
                    </div>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row style={{ marginTop: "10px", paddingBottom: "50px" }}>
                    <p
                      style={{
                        fontWeight: "bolder",
                        fontSize: "20px",
                        paddingLeft: "100px",

                        marginTop: "20px",
                        backgroundImage:
                          "linear-gradient(to left, #87A2FF, #FF9D3D)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        textFillColor: "transparent",
                      }}
                    >
                      PDF TO VIDEO
                    </p>
                    <div className={styles.SideImage4}>
                      <p
                        style={{
                          fontSize: "16px",
                          paddingLeft: "5px",
                          paddingRight: "50px",
                          marginTop: "20px",
                        }}
                      >
                        Easily transform your PDF documents into engaging videos
                        with Feedio.ai's PDF to Video feature. Upload your PDF,
                        and our AI generates a video that explains the content,
                        complete with advanced customization options.
                        <div style={{ marginTop: "30px" }}>
                          <Button
                            onClick={showPdfVideoModal}
                            icon={<VideoCameraOutlined />}
                            type="primary"
                          >
                            PDF to Video
                          </Button>
                        </div>
                      </p>
                      {/* <span className={styles.borderBg}></span> */}
                      <img src={SideImage4} alt="img" />
                    </div>
                  </Row>
                </Col>
              </Row>
              {/* <Row style={{
              backgroundImage: 'linear-gradient(to right, #f0f0f0, #CDC1FF)', borderRadius: '50px'
            }}>
              <Col>
                <Row style={{ marginTop: '10px', paddingBottom: '50px' }}>
                  <p style={{
                    fontWeight: 'bolder',
                    fontSize: '20px',
                    paddingLeft: '350px',
                    marginTop: '10px',
                    backgroundImage: 'linear-gradient(to left, #87A2FF, #FF9D3D)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textFillColor: 'transparent'
                  }}>GENERATE COURSE</p>
                  <div className={styles.SideImage5}>
                    {/* <span className={styles.borderBg}></span> */}
              {/* <img src={SideImage5} alt="img" />
                    <p style={{ fontSize: '16px', paddingLeft: '105px', paddingRight: '50px', marginTop: '20px' }}>
                      Effortlessly create engaging courses with Feedio.ai's Course Creation feature by simply providing a course title. Our AI generates a comprehensive course structure and content, enabling you to produce captivating course videos tailored for students.
                      <div style={{ marginTop: '30px' }}>
                        <Button
                          onClick={showCourseModal}
                          icon={<VideoCameraOutlined />}
                          type="primary"
                        >
                          Generate Course
                        </Button>
                      </div>
                    </p>
                  </div>
                </Row>
              </Col>
            </Row> */}
            </div>
          );
        } else {
          return (
            <>
              <div style={{ textAlign: "center", height: "500px" }}>
                <Spin
                  size="large"
                  className="spinner"
                  style={{
                    display: "block",
                    margin: "0 auto",
                    marginTop: "200px",
                  }}
                />
                <div style={{ marginTop: "20px" }}>
                  <h3>Loading, please wait...</h3>
                </div>
              </div>
            </>
          );
        }
      }
    }
  };
  const handleUserInteraction = () => {
    setIsButtonDisabled(false); // Enable the button after any user interaction
    setIsGenerateDisabled(true);
    setIsPptDisabled(true);
  };

  const options = [
    {
      value: "CODE_SLIDE",
      label: "Code",
    },
    {
      value: "CONTENT_SLIDE",
      label: "Content",
    },
    {
      value: "CONTENT_SLIDE_WITH_IMAGE",
      label: "Content with Media",
    },
    {
      value: "CONTENT_SLIDE_WITH_VIDEO",
      label: "Content with Video",
    },
    {
      value: "CONTENT_SLIDE_WITH_VIDEO_ONLY",
      label: "Video",
    },
    {
      value: "TITLE_SLIDE",
      label: "Title",
    },
    {
      value: "IMAGE_ONLY_SLIDE",
      label: "Media",
    },
  ];

  const handleChange = (value) => { };

  const onFinishTextToShortVideo = (values) => {

    
    const videoName = values.courseName;
    const videoText = values.videoText;
    
    let ai_generate = "false";
    let restrict = true;
    
    // Retrieve values from advanced options
    const aspectRatio = values.aspectRatio || "16:9";
    const noOfSlides = values.noOfSlides || "5-10";
    const watermark = isWatermarkEnabled; // Get watermark value
    const language = values.language || "english";
    
    if (actionType === "generateByAI") {
      ai_generate = "true";
      restrict = false;
      
      setVideoName(videoName);
      
      dispatch(
        generateVideoByText({
          topic: videoName,
          text: videoText,
          ai_generate: ai_generate,
          restrict: restrict,
          aspect_ratio: aspectRatio,
          slides_count: noOfSlides,
          language: language,
          watermark: watermark,
        })
      );
      
      showGenerateModal();
      dispatch(getVideosList());
      setIsCreateModalOpen(false);
      
      // Close the modal after video generation
      setIsModalOpen(false);
      form.resetFields();
    } else if (actionType === "customGenerate") {
      setVideoName(videoName);

      dispatch(
        generateVideoByText({
          topic: videoName,
          text: videoText,
          ai_generate: ai_generate,
          restrict: restrict,
          aspect_ratio: aspectRatio,
          slides_count: noOfSlides,
          language: language,
          watermark: watermark,
        })
      );
      showGenerateModal();
      dispatch(getVideosList());
      setIsCreateModalOpen(false);

      // Close the modal after video generation
      setIsModalOpen(false);
      textToVideoForm.resetFields(); // Reset Text form
    }
  };

  const onFinishUrlToVideo = async(values) => {

    
    const videoTopic = values.topic;
    const videoUrl = values.videoUrl;
    let ai_generate = "true";
    const watermark = isWatermarkEnabled; // Get watermark value
    
    // Set loading to true when the generation starts
    setIsLoading(true);
    
    try {
      const response = await dispatch(
        generateVideoByUrl({
          topic: videoTopic,
          url: videoUrl,
          ai_generate: ai_generate,
          watermark: watermark,
          scene_text_color: sceneTextColor,
        })
      );
      
      if (
        response.payload.data ===
        "Unable to generate video at this point. Try after sometime!"
      ) {
        setIsLoading(false);
        
        toast.error("Please provide a valid open-source URL to proceed.");
        return;
      }
      
      setIsLoading(false);
      showGenerateModal();
      dispatch(getVideosList());
      setIsModalOpen(false);
      setIsCreateModalOpen(false);
      urlToVideoForm.resetFields();
    } catch (error) {
      console.error("Error generating video:", error);

      setIsLoading(false);

      toast.error("An error occurred while generating the video.");
    }
  };

  const onFinishPdfToVideo = async(values) => {


    // Retrieve values from advanced options
    const aspectRatio = values.aspectRatio || "16:9";
    const noOfSlides = values.noOfSlides || "5-10";

    const videoTopic = values.topic;
    // const videoUrl = values.videoUrl;
    // let ai_generate = 'true';
    const watermark = isWatermarkEnabled; // Get watermark value

    // Set loading to true when the generation starts
    setIsLoading(true);

    try {
      const response = await dispatch(
        generateVideoByPdf({
          topic: videoTopic,
          file_id: uuid,
          aspect_ratio: aspectRatio,
          slides_count: noOfSlides,
          watermark: watermark,
          ai_generate: "true",
          scene_text_color: sceneTextColor,
        })
      );

      if (
        response.payload.data ===
        "Unable to generate video at this point. Try after sometime!"
      ) {
        setIsLoading(false);

        toast.error("Please upload file the again.");
        return;
      }

      setIsLoading(false);
      showGenerateModal();
      dispatch(getVideosList());
      setIsCreateModalOpen(false);
      setIsPdfVideoModalOpen(false);
      pdftoVideoForm.resetFields();
    } catch (error) {
      setIsLoading(false);
      toast.error("An error occurred while generating the video.");
    }
  };

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [watermarkOption, setWatermarkOption] = useState(""); // To handle watermark selection

  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };

  const handleWatermarkChange = (value) => {
    setWatermarkOption(value);
  };

  // Function to open modal and reset video source
  const openHelpVideoModal = () => {
    setIsHelpVideoModalOpen(true);
    setVideoSrc(
      "https://www.youtube.com/embed/dePZEfENAQg?si=h2GUiGUiGEN2kgcW"
    );
  };

  // Function to close modal and pause video
  const closeHelpVideoModal = () => {
    setIsHelpVideoModalOpen(false);
    setVideoSrc("");
  };

  // Function to open the Text to Video help modal and set the video link
  const openTextToVideoHelpModal = () => {
    setIsTextToVideoHelpModalOpen(true);
    setTextToVideoSrc(
      "https://www.youtube.com/embed/pNEXzkGvFAg?si=kVuxafXyIsVnOoap"
    );
  };

  const createVideos = () => {
    form.resetFields();
    setIsCreateModalOpen(true);
  };
  const closeCreate = () => {
    form.resetFields();
    pdftoVideoForm.resetFields();
    textToVideoForm.resetFields();
    urlToVideoForm.resetFields();
    setIsCreateModalOpen(false);
  };

  // Function to close the modal and stop the video
  const closeTextToVideoHelpModal = () => {
    setIsTextToVideoHelpModalOpen(false);
    setTextToVideoSrc("");
  };

  const uploadPdfProps = {
    name: "file",
    multiple: false,
    accept: "application/pdf", // Restrict to PDF files
    beforeUpload: (file) => {
      const isPdf = file.type === "application/pdf";
      if (!isPdf) {
        toast.error(`${file.name} is not a PDF file.`);
      }
      return isPdf || Upload.LIST_IGNORE; // Ignore the file if it's not PDF
    },
    customRequest: async({ file, onSuccess, onError }) => {
      setLoading(true);
      try {
        // Extract the details from bg_background_url
        const url = pdfFileUploadUrl?.upload_url?.url;
        // Create a FormData object
        const formData = new FormData();
        Object.keys(pdfFileUploadUrl?.upload_url?.fields).forEach((key) => {
          formData.append(key, pdfFileUploadUrl?.upload_url?.fields[key]);
        });
        const newFileName = uuid; //+ '.' + fileExtension;
        const renamedFile = new File(
          [file],
          newFileName, // + '.' + fileExtension,
          { type: file.type }
        );
        // Append the file to the form data
        formData.append("file", renamedFile);

        // Make a POST request to the S3 URL
        const response = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // If successful
        onSuccess("Ok");
      } catch (err) {
        // Handle the error
        onError(err);
        toast.error(`${file.name} file upload failed.`);
      } finally {
        setLoading(false);
      }
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "done") {
        toast.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        toast.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) { },
  };

  const tabItems = [
    {
      key: "1",
      icon: <VideoCameraOutlined />,
      label: "Short Video",
      children: (
        <div className={styles.formWrapper}>
          <Form
            name="generateShortVideo"
            form={form}
            onFinish={onFinishShortVideo}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            style={{ marginLeft: "50px", marginRight: "50px" }}
          >
            <Form.Item
              label="Enter your Topic name:"
              name="courseName"
              rules={[
                { required: true, message: "Please enter Topic Name!" },
                {
                  max: 500,
                  message: "Topic name cannot exceed 500 characters!",
                },
              ]}
            >
              <Input placeholder="Eg: What is Generative AI" />
            </Form.Item>

            {/* Clickable text for Advanced Options */}
            <div
              style={{
                marginBottom: "-10px",
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <a
                onClick={toggleAdvancedOptions}
                style={{ display: "flex", alignItems: "center" }}
              >
                {showAdvancedOptions
                  ? "Hide Advanced Options"
                  : "Advanced Options"}
                {showAdvancedOptions ? (
                  <UpCircleOutlined style={{ marginLeft: "8px" }} />
                ) : (
                  <DownCircleOutlined style={{ marginLeft: "6px" }} />
                )}
              </a>
            </div>

            {/* Advanced Options Section */}
            {showAdvancedOptions && (
              <div style={{ marginTop: "20px" }}>
                {/* Additional Context Input */}
                <Form.Item
                  label="Additional Context:"
                  name="additionalContext"
                  rules={[{ required: false }]}
                >
                  <Input.TextArea
                    rows={2}
                    placeholder="Provide additional context for your topic (optional)"
                  />
                </Form.Item>

                {/* Aspect Ratio */}
                <Form.Item
                  label="Aspect Ratio"
                  name="aspectRatio"
                  initialValue="16:9"
                >
                  <AspectSelect onAspectChange={(value) => form.setFieldsValue({ aspectRatio: value })}/>
                </Form.Item>
                
                {/* No. of Slides */}
                <Form.Item
                  label='No. of Scenes'
                  name="noOfSlides"
                  initialValue='5-7'
                >

                  <ScenesSelect />

                </Form.Item>
                {/* Language Selection */}
                <Form.Item
                  label="Language"
                  name="language"
                  initialValue="english"
                  rules={[
                    { required: true, message: "Please select a language!" },
                  ]}
                >
                  <Select
                    placeholder="Select your language"
                    onChange={handleLanguageChange}
                  >
                    <Select.Option value="english">English</Select.Option>
                    <Select.Option value="tamil">Tamil</Select.Option>
                    <Select.Option value="French">French</Select.Option>
                    <Select.Option value="Spanish">Spanish</Select.Option>
                  </Select>
                </Form.Item>
                {/* Watermark Toggle Option */}
                <Form.Item label="Watermark">
                  <Switch
                    checked={isWatermarkEnabled}
                    onChange={handleWatermarkToggleChange}
                    checkedChildren="Yes"
                    unCheckedChildren="No"
                  />
                </Form.Item>
              </div>
            )}

            {/* Footer with Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
                marginTop: "20px",
              }}
            >
              <Button
                type="primary"
                onClick={async() => {
                  await setShortActionType("shortGenerateByAI");
                  form.submit();
                  setIsCreateModalOpen(false);
                }}
              >
                AI Generate
              </Button>
              <Button
                type="primary" key="submit"
                onClick={async() => {
                  await setShortActionType("shortCustomGenerate");
                  form.submit();
                  setIsCreateModalOpen(false);
                }}
              >
                Custom Generate
              </Button>
            </div>
          </Form>
        </div>
      ),
    },
    {
      key: "2",
      icon: <FileTextOutlined />,
      label: "Text to Video",
      children: (
        <Form
          form={textToVideoForm}
          layout="vertical"
          onFinish={onFinishTextToShortVideo}
          style={{ marginLeft: "50px", marginRight: "50px" }}
        >
          <Form.Item
            label="Enter Title:"
            name="courseName"
            rules={[{ required: true, message: "Please enter a title!" }]}
          >
            <Input placeholder="Title of your video content" />
          </Form.Item>

          <Form.Item
            label="Enter Text:"
            name="videoText"
            rules={[{ required: true, message: "Please enter text content!" }]}
          >
            <Input.TextArea rows={4} placeholder="Text to convert into video" />
          </Form.Item>

          <div
            style={{
              marginTop: "20px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <a
              onClick={toggleAdvancedOptions}
              style={{ display: "flex", alignItems: "center" }}
            >
              {showAdvancedOptions ? "Advanced Options" : "Advanced Options"}
              {showAdvancedOptions ? (
                <UpCircleOutlined style={{ marginLeft: "8px" }} />
              ) : (
                <DownCircleOutlined style={{ marginLeft: "6px" }} />
              )}
            </a>
          </div>

          {showAdvancedOptions && (
            <div>
              <Form.Item
                label="Aspect Ratio"
                name="aspectRatio"
                initialValue="16:9"
              >
                <AspectSelect onAspectChange={(value) => form.setFieldsValue({ aspectRatio: value })}/>
              </Form.Item>

              <Form.Item
                label="No. of Scenes"
                name="noOfSlides"
                initialValue="5-10"
              >
                <ScenesSelect />
              </Form.Item>
              {/* Language Selection */}
              <Form.Item
                label="Language"
                name="language"
                initialValue="english"
                rules={[
                  { required: true, message: "Please select a language!" },
                ]}
              >
                <Select
                  placeholder="Select your language"
                  onChange={handleLanguageChange}
                >
                  <Select.Option value="english">English</Select.Option>
                  <Select.Option value="tamil">Tamil</Select.Option>
                  <Select.Option value="French">French</Select.Option>
                  <Select.Option value="Spanish">Spanish</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Watermark">
                <Switch
                  checked={isWatermarkEnabled}
                  onChange={handleWatermarkToggleChange}
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                />
              </Form.Item>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            <Button
              type="primary"
              key="submit"
              onClick={() => {
                setActionType("generateByAI");
                textToVideoForm.submit();
                setIsCreateModalOpen(false);
              }}
            >
              AI Generate
            </Button>
            <Button
              type="primary"
              onClick={ async() => {
                await setActionType("customGenerate");
                textToVideoForm.submit();
                setIsCreateModalOpen(false);
              }}
            >
              Custom Generate
            </Button>
          </div>
        </Form>
      ),
    },
    {
      key: "3",
      icon: <LinkOutlined />,
      label: "URL to Video",
      children: (
        <Form
          form={urlToVideoForm}
          layout="vertical"
          onFinish={onFinishUrlToVideo}
          onFinishFailed={(errorInfo) => { }}
          style={{ marginLeft: "50px", marginRight: "50px" }}
        >
          <Form.Item
            label="Enter Topic:"
            name="topic"
            rules={[{ required: true, message: "Please enter a topic!" }]}
          >
            <Input placeholder="Topic of your video" />
          </Form.Item>

          <Form.Item
            label="Enter URL:"
            name="videoUrl"
            rules={[{ required: true, message: "Please enter a URL!" }]}
          >
            <Input placeholder="URL to convert into video" />
          </Form.Item>

          <div
            style={{
              marginTop: "20px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <a
              onClick={toggleAdvancedOptions}
              style={{ display: "flex", alignItems: "center" }}
            >
              {showAdvancedOptions ? "Advanced Options" : "Advanced Options"}
              {showAdvancedOptions ? (
                <UpCircleOutlined style={{ marginLeft: "8px" }} />
              ) : (
                <DownCircleOutlined style={{ marginLeft: "6px" }} />
              )}
            </a>
          </div>

          {showAdvancedOptions && (
            <div>
              <Form.Item
                label="Aspect Ratio"
                name="aspectRatio"
                initialValue="16:9"
              >
                <AspectSelect onAspectChange={(value) => form.setFieldsValue({ aspectRatio: value })}/>
              </Form.Item>

              <Form.Item
                label="No. of Scenes"
                name="noOfSlides"
                initialValue="5-10"
              >
                <ScenesSelect />
              </Form.Item>

              {/* Watermark Toggle Option */}
              <Form.Item label="Watermark">
                <Switch
                  checked={isWatermarkEnabled}
                  onChange={handleWatermarkToggleChange}
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                />
              </Form.Item>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            <Button type="primary" htmlType="submit">
              Generate Video
            </Button>
            {isLoading && <Spin size="large" />}
          </div>
        </Form>
      ),
    },
    {
      key: "4",
      icon: <FilePdfOutlined />,
      label: "PDF to Video",
      children: (
        <Form
          form={pdftoVideoForm}
          layout="vertical"
          onFinish={onFinishPdfToVideo}
          onFinishFailed={(errorInfo) => { }}
          style={{ marginLeft: "50px", marginRight: "50px" }}
        >
          <Form.Item
            label="Enter Topic:"
            name="topic"
            rules={[{ required: true, message: "Please enter a topic!" }]}
          >
            <Input placeholder="Topic of your video" />
          </Form.Item>
          <Form.Item
            name="file"
            label="Upload File"
            valuePropName="file"
            rules={[{ required: true, message: "Please upload a file!" }]}
          >
            <Dragger {...uploadPdfProps}>
              <p>
                <InboxOutlined />
              </p>
              <p>Click or drag file to this area to upload</p>
              <p>
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
              </p>
            </Dragger>
          </Form.Item>

          <div
            style={{
              marginTop: "20px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <a onClick={toggleAdvancedOptions}
              style={{ display: "flex", alignItems: "center" }}
            >
              {showAdvancedOptions ? "Advanced Options" : "Advanced Options"}
              {showAdvancedOptions ? (
                <UpCircleOutlined style={{ marginLeft: "8px" }} />
              ) : (
                <DownCircleOutlined style={{ marginLeft: "6px" }} />
              )}
            </a>
          </div>

          {showAdvancedOptions && (
            <div>
              <Form.Item
                label="Aspect Ratio"
                name="aspectRatio"
                initialValue="16:9"
              >
                <AspectSelect onAspectChange={(value) => form.setFieldsValue({ aspectRatio: value })}/>
              </Form.Item>

              <Form.Item
                label="No. of Scenes"
                name="noOfSlides"
                initialValue="5-10"
              >
                <ScenesSelect />
              </Form.Item>

              {/* Watermark Toggle Option */}
              <Form.Item label="Watermark">
                <Switch
                  checked={isWatermarkEnabled}
                  onChange={handleWatermarkToggleChange}
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                />
              </Form.Item>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            <Button type="primary" onClick={() => { pdftoVideoForm.submit(); pdftoVideoForm.resetFields();}}>
              Generate Video
            </Button>
            {isLoading && <Spin size="large" />}
          </div>
        </Form>
      ),
    },
  ];

  const onTabChange = (e) => {
    setActiveTabKey(e);
    form.resetFields();
    pdftoVideoForm.resetFields();
    textToVideoForm.resetFields();
    urlToVideoForm.resetFields();
    if (e === "4") {
      showPdfVideoModal();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolBar}>
        <VaTitle level={4} text="" />
        <div className={styles.sort}>
          <Button
            onClick={showCourseModal}
            icon={<VideoCameraOutlined />}
            type="primary"
          >
            Course Video
          </Button>
          <Button
            type="primary"
            onClick={createVideos}
            style={{ marginRight: "30px", width: "150px" }}
            icon={<VideoCameraAddOutlined />}
          >
            Create Video
          </Button>
          <Modal
            title="Create Video"
            open={isCreateModalOpen}
            onCancel={closeCreate}
            onOk={closeCreate}
            footer={null}
            centered
            width={700}
          >
            <Tabs
              activeKey={activeTabKey}
              onChange={onTabChange}
              centered
              items={tabItems}
            />
          </Modal>
        </div>
      </div>
      {coursesListStatus === "succeeded" || videosListStatus === "succeeded" ? (
        <>{loadCourseVideoDetails()}</>
      ) : (
        <div style={{ textAlign: "center", height: "500px" }}>
          <Spin
            size="large"
            className="spinner"
            style={{ display: "block", margin: "0 auto", marginTop: "200px" }}
          />
          <div style={{ marginTop: "20px" }}>
            <h3>Loading, please wait...</h3>
          </div>
        </div>
      )}

      {/* Course Video Modal */}
      <Modal
        title="Generate Your Own Course"
        open={isCourseModalOpen}
        onCancel={() => {
          handleCancelCourse();
          form.resetFields(); // Reset the input fields when modal is closed
        }}
        maskClosable={true} // Prevents closing on click outside
        footer={[
          <Button key="back" onClick={handleCancelCourse}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Generate
          </Button>,
        ]}
      >
        <div className={styles.formWrapper}>
          <Form
            name="generateCourse"
            form={form}
            onFinish={onFinishCourse}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Enter your Course Name:"
              name="courseName"
              rules={[
                {
                  required: true,
                  message: "Please enter Course Name!",
                },
                {
                  max: 50,
                  message: "Topic name cannot exceed 50 characters!",
                },
              ]}
            >
              <Input placeholder="Eg: Learn ChatGPT" />
            </Form.Item>
          </Form>
        </div>
        {loading && (
          <div className={styles.loaderContainer}>
            <Spin
              size="large"
            // style={{ display: 'block', margin: '0 auto', marginTop: '200px' }}
            />
            <p>Course Structure is Generating...</p>
          </div>
        )}
      </Modal>

      {/* Generate Modal */}
      <Modal
        title={videoName}
        open={isGenerateModalOpen}
        onCancel={handleGenerateCancel}
        width={"99vw"}
        centered
        height={"99vh"}
        maskClosable={true} // Prevents closing on click outside
        footer={[
          <Button key="cancel" onClick={handleGenerateCancel}>
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
          <Button
            key="submit"
            type="primary"
            onClick={handleBothActions}
            disabled={isGenerateDisabled}
          >
            Generate Video
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={generatePptContent}
            disabled={isPptDisabled}
          >
            Download PPT
          </Button>,
        ]}
      >
        <div
          className={styles.formWrapper}
          onClick={handleUserInteraction}
          onKeyUp={handleUserInteraction}
        >
          <Generate ref={generateRef} />
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        id="video-panel"
        title={videoName}
        open={isPreviewModalOpen}
        width={"70vw"}
        centered
        onCancel={handlePreviewCancel}
        destroyOnClose={true}
        footer={[]}
        maskClosable={true} // Prevents closing on click outside
      >
        <div className={styles.formWrapper}>
          <Preview selectedShortData={selectedShortData} />
        </div>
      </Modal>
    </div>
  );
}
