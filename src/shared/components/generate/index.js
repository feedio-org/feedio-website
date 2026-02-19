import {
  DeleteFilled,
  LeftOutlined,
  PlaySquareOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  RightOutlined,
  SwitcherOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Image,
  Input,
  message,
  Modal,
  Popconfirm,
  Popover,
  Select,
  Spin,
  Switch,
  Tabs,
} from "antd";
import axios from "axios";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  createScenes,
  deleteScenes,
  generateVideo,
  regenerateScene,
  updateTopicContent,
} from "../../../pages/courseIndex/redux/topicContentSlice";
import { generatePptById } from "../../../pages/dashboard/redux/courseSlice";
import { VaText, VaTitle } from "../typography";
import Audio from "./audio";
import AudioText from "./audioText";
import AnimationsAudio from "./avatar";
import Background from "./background";
import ContentText from "./contentText";
import EditText from "./editText";
import styles from "./generate.module.scss";
import ImageFileWithType from "./imageFileWithType";
import Images from "./images";
import PreviewComponent from "./previewComponent";
import BackgroundAnimation from "./backgroundAnimation";

const Generate = forwardRef((props, ref) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const localRef = useRef(null);
  const previewRef = useRef(null);
  const leftColRef = useRef(null);
  let topicDetails = useSelector((state) => state.topic.topicData);
  const status = useSelector((state) => state.topic.status);
  const { backgroundList } = useSelector((state) => state.lov);

  const [messageApi] = message.useMessage();

  const [selectedTopicData, setSelectedTopicData] = useState(null);
  const [scenesData, setScenesData] = useState([]);
  const [selectedScene, setSelectedScene] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [selectedMarkupText, setSelectedMarkupText] = useState("");
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState(
    "bg_1" || "bg_1_9x16"
  );
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState();
  const [selectedFileList, setSelectedFileList] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [imagePosition, setImagePosition] = useState("");
  const [contentSize, setContentSize] = useState(null);
  const [contentPosition, setContentPosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState(null);
  const [backgroundAnimation, setBackgroundAnimation] = useState(null);
  const [scale, setScale] = useState(1);
  const [isApplyAllDisabled, setIsApplyAllDisabled] = useState(false);
  const [negativeMargin, setNegativeMargin] = useState(0); // Adjust if needed
  const [isSceneModalOpen, setIsSceneModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteSelectedScene, setDeleteSelectedScene] = useState(null);
  const [sceneType, setSceneType] = useState(null);
  const [actionType, setActionType] = useState("");
  const [createNewSceneIndex, setCreateNewSceneIndex] = useState(null);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [sceneTextColor, setSceneTextColor] = useState({
    title: "#ffffff",
    content: "#ffffff",
  });
  const [bgImageListData, setBgImageListData] = useState(null);
  const [avatarWithAudio, setAvatarWithAudio] = useState("avatarWithAudio");
  const [tabCount, setTabCount] = useState("1");


  const [selectedWidget, setSelectedWidget] = useState(null);
  
  const [selectedWidgetList, setSelectedWidgetsList] = useState([
    // {
    //   id: 1,
    //   name: "CARD",
    //   size: { width: 100, height: 100 },
    //   position: { x: 50, y: 50 },
    //   content: { title: "Card Title", description: "This is the card description.", age: 25, name: "John Doe", admissionData: "2021-09-01", graduationData: "2025-06-01" }
    // }
  ]);


  useEffect(() => {
    loadBackgroundImageList();
  }, [aspectRatio, backgroundList]);

  const loadBackgroundImageList = () => {
    const imageData =
      aspectRatio === "16:9"
        ? backgroundList?.data["16:9"]
        : backgroundList?.data["9:16"];
    const customImageData =
      aspectRatio === "16:9"
        ? backgroundList?.data["custom_16:9"]
        : backgroundList?.data["custom_9:16"];
    // Step 1: Get the count of items in imageData
    const count = imageData?.length;

    // Step 2: Update customImageData with new ids
    const updatedCustomImageData = customImageData?.map((item, index) => ({
      ...item,
      id: count + index, // Assign new id starting from count
    }));

    // Step 3: Combine the arrays
    const imageListData = [...imageData, ...updatedCustomImageData];

    const urlList = updateUrlWithList(imageListData);

    setBgImageListData(urlList);
  };

  const updateUrlWithList = (imageListData) => {
    // Base URL for images
    const baseUrl = "https://va-background-images.s3.amazonaws.com/";
    // Mapping through the existing data to add image_url with conditions
    const updatedBackgroundData = imageListData.map((item) => {
      const shouldConcatType = item.image_name.includes("bg_");
      const imageUrl = shouldConcatType
        ? `${baseUrl}${item.image_name}.${item.image_type}`
        : `${baseUrl}${item.image_name}`;

      return {
        ...item,
        image_url: imageUrl,
      };
    });

    return updatedBackgroundData;
  };

  useEffect(() => {
    if (status === "succeeded" && typeof topicDetails?.data !== "string") {
      setSelectedTopicData(topicDetails.data);
      setAspectRatio(topicDetails?.data?.aspect_ratio);
      let scenesDataList = topicDetails.data.scenes;
      let sortedScenes = sortScenes(scenesDataList);
      if (sortedScenes?.length > 0) {
        setScenesData(sortedScenes);
        setSelectedScene(sortedScenes[0]);
        setSelectedSceneIndex(sortedScenes[0].scene_index);
        setSelectedTitle(sortedScenes[0].scene_title);
        setSelectedText(removeSpace(sortedScenes[0].scene_narration));
        setSelectedMarkupText(removeSpace(sortedScenes[0].scene_text));
        setSelectedAudio(sortedScenes[0].scene_audio_template);
        setSelectedBackground(sortedScenes[0].scene_bg_template);
        setSelectedAnimation(sortedScenes[0].scene_style_template);
        setImageId(sortedScenes[0].scene_image);
        sortedScenes[0].scene_image_position && setImagePosition(sortedScenes[0].scene_image_position);
        sortedScenes[0].scene_image_size && setImageSize(sortedScenes[0].scene_image_size);
        setImageType(sortedScenes[0].scene_image_type);
        setSelectedAvatar(sortedScenes[0].scene_avatar);
        setSceneType(sortedScenes[0].scene_type);
        setSceneTextColor(sortedScenes[0].scene_text_color);
        setBackgroundAnimation(sortedScenes[0].scene_background_animation);
        setSelectedFileList([]);
        setSelectedWidgetsList(sortedScenes[0].scene_widgets);
      } else {
        setScenesData([]);
        setSelectedScene([]);
        setSelectedSceneIndex(null);
        setSelectedTitle("");
        setSelectedText("");
        setSelectedMarkupText("");
        setSelectedAudio("");
        if (topicDetails?.data?.aspect_ratio === "16:9") {
          setSelectedBackground("bg_1");
        } else {
          setSelectedBackground("bg_1_9x16");
        }
        setSelectedAnimation(null);
        setImageId(null);
        setImageType(null);
        setImagePosition("");
        setImageSize(null);
        setContentPosition({});
        setContentSize(null);
        setSelectedAvatar("");
        setSceneType(null);
      }
    }
  }, [status, topicDetails]);

  useImperativeHandle(ref, () => ({
    updateScene: () => {
      // Logic for updating the scene
      handleUpdate();
    },
    generateVideoContent: () => {
      handleGenerateVideo();
    },
    generatePptContent: () => {
      handleDownloadPpt();
    },
  }));

  useEffect(() => {
    const updateScale = () => {
      if (leftColRef?.current && previewRef?.current) {
        const colWidth = leftColRef.current.offsetWidth;
        const prevWidth = previewRef.current.offsetWidth;
        const newWidth = colWidth / prevWidth;

        setScale(newWidth);
        // Optionally adjust margin to center the scaled content if necessary
        setNegativeMargin(0); // 50% for centering
      }
    };

    const checkAndSetScale = () => {
      if (leftColRef.current && previewRef.current) {
        updateScale();
      } else {
        setTimeout(checkAndSetScale, 100); // Retry after a short delay if refs are not available
      }
    };

    checkAndSetScale(); // Initial call to set the scale
    window.addEventListener("resize", updateScale); // Adjust on resize

    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  const handleMarkdownContent = (
    text,
    action,
    sceneType = "",
    language = "python" ||
      "javascript" ||
      "prompt" ||
      "angular" ||
      "java" ||
      "ruby"
  ) => {
    if (text) {
      if (action === "insert") {
        if (sceneType === "CODE_SLIDE") {
          return `\`\`\`${language}\n${text}\n\`\`\``;
        } else {
          let textSentencesTrimmed = text.split("\n").map((s) => s.trim());
          return textSentencesTrimmed;
        }
      } else {
        return "";
      }
    } else {
      return text;
    }
  };
  //Apply All Function
  const handleApplyAll = () => {
    setIsApplyAllDisabled(false);
    const selectedBackground = scenesData[selectedSceneIndex].scene_bg_template;
    const selectedAvatar = scenesData[selectedSceneIndex].scene_avatar;
    const selectedTextColor = scenesData[selectedSceneIndex].scene_text_color; // Get selected text color
    // Check if all scenes already have the same background and avatar as the selected scene
    const isBackgroundChanged = scenesData.some(
      (scene) => scene.scene_bg_template !== selectedBackground
    );
    const isAvatarChanged = scenesData.some(
      (scene) => scene.scene_avatar !== selectedAvatar
    );
    const isTextColorChanged = scenesData.some(
      (scene) =>
        JSON.stringify(scene.scene_text_color) !==
        JSON.stringify(selectedTextColor)
    );

    const updatedScenes = scenesData.map((scene) => ({
      ...scene,
      scene_bg_template: selectedBackground,
      scene_avatar:
        selectedAvatar === "none" || selectedAvatar === null
          ? null
          : selectedAvatar,
      scene_text_color: selectedTextColor,
    }));

    setScenesData(updatedScenes);

    // Display different messages based on what changed
    if (isBackgroundChanged && isAvatarChanged) {
      toast.success(
        "Selected Background and Avatar applied for all Scenes!",
        5
      );
    } else if (isAvatarChanged && selectedAvatar === "none") {
      toast.success("Avatar removed for all Scenes!", 5);
    } else if (isAvatarChanged) {
      toast.success("Selected Avatar applied for all Scenes!", 5);
    } else if (isBackgroundChanged) {
      toast.success("Selected Background applied for all Scenes!", 5);
    } else if (isTextColorChanged) {
      toast.success("Selected Text Color applied for all Scenes!", 5);
    }

    setIsApplyAllDisabled(false);
  };

  const handleBackgroundSelect = (image) => {
    setIsApplyAllDisabled(false);
    setSelectedBackground(image.image_name);
    let scene = scenesData[selectedSceneIndex];
    const updatedScenes = scenesData.map((s) =>
      s.scene_id === scene.scene_id
        ? { ...s, scene_bg_template: image.image_name }
        : s
    );
    setScenesData(updatedScenes);
  };

  useEffect(() => {
    setSelectedAvatar(null);
  }, [avatarWithAudio]);

  const handleAvatarSelect = useCallback(
    (image) => {
      setIsApplyAllDisabled(false);

      // Update selected avatar
      if (image?.image_name === "none") {
        setSelectedAvatar(null);
      } else if (avatarWithAudio === "audioOnly") {
        setSelectedAvatar(null);
      } else {
        setSelectedAvatar(image.image_name);
      }

      // Update scenes data
      const updatedScenes = scenesData.map((s, index) =>
        index === selectedSceneIndex
          ? { ...s, scene_avatar: image?.image_name || null }
          : s
      );

      avatarWithAudio !== "audioOnly" && setScenesData(updatedScenes);
    },
    [
      scenesData,
      avatarWithAudio,
      selectedSceneIndex,
      setScenesData,
      setSelectedAvatar,
    ]
  );

  const handleMediaProperty = useCallback(
    (values) => {
      const updatedScenes = scenesData.map((s, index) =>
        index === selectedSceneIndex
          ? {
            ...s,
            scene_image_position: values?.scene_image_position,
            scene_image_size: values?.scene_image_size,
          }
          : s
      );

      setImagePosition(values?.scene_image_position);
      setImageSize(values?.scene_image_size);

      console.log("updatedScenes", updatedScenes);
      setScenesData(updatedScenes);
    },
    [
      scenesData,
      avatarWithAudio,
      selectedSceneIndex,
      setScenesData,
      setSelectedAvatar,
    ]
  );


  const handlescene_text_colorChange = (event, option) => {
    // let updData = { [option]: event };

    let updatedscene_text_color = { ...sceneTextColor, [option]: event };

    setSceneTextColor(updatedscene_text_color);
    let scene = scenesData[selectedSceneIndex];
    const updatedScenes = scenesData.map((s) =>
      s.scene_id === scene.scene_id
        ? { ...s, scene_text_color: updatedscene_text_color }
        : s
    );

    setScenesData(updatedScenes);
  };

  const handleAudioChange = (value) => {
    setIsApplyAllDisabled(false);
    setSelectedAudio(value);

    const updatedScenes = scenesData.map((scene, index) =>
      isApplyAllDisabled || index === selectedSceneIndex
        ? { ...scene, scene_audio_template: value }
        : scene
    );
    setScenesData(updatedScenes);
  };




  const onTextChange = (event) => {
    setSelectedText(event.target.value);
    let scene = scenesData[selectedSceneIndex];
    const updatedScenes = scenesData.map((s) =>
      s.scene_id === scene.scene_id
        ? { ...s, scene_narration: event.target.value }
        : s
    );
    setScenesData(updatedScenes);
  };

  const handleFileChange = async({ fileList }) => {
    // Log fileList to debug

    const updatedFileList = Array.isArray(fileList) ? fileList : [];
    const file = updatedFileList[0]?.originFileObj;

    if (file) {
      const newFileName = selectedScene.scene_id;
      const renamedFile = new File([file], newFileName, { type: file.type });

      let fileType = "IMG";
      if (file.type === "video/mp4") {
        fileType = "MP4";
      }
      let updatedSceneType = " ";
      if (sceneType === "CONTENT_SLIDE") {
        updatedSceneType = "CONTENT_SLIDE_WITH_IMAGE";
        setSceneType("CONTENT_SLIDE_WITH_IMAGE");
        if (imageId != null) {
          updatedSceneType = "CONTENT_SLIDE_WITH_IMAGE";
          setSceneType("CONTENT_SLIDE_WITH_IMAGE");
        }
      } else {
        updatedSceneType = sceneType;
      }
      let scene = scenesData[selectedSceneIndex];
      const updatedScenes = scenesData.map((s) =>
        s.scene_id === scene.scene_id
          ? {
            ...s,
            scene_image: newFileName,
            scene_image_type: fileType,
            scene_type: updatedSceneType,
          }
          : s
      );
      setScenesData(updatedScenes);

      const formData = new FormData();
      Object.keys(selectedScene.upload_url.fields).forEach((key) => {
        formData.append(key, selectedScene.upload_url.fields[key]);
      });
      formData.append("file", renamedFile);

      try {
        const response = await axios.post(
          selectedScene.upload_url.url,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 204) {
          // setSelectedFileList([]);
          setImageId(newFileName);
          setImageType(fileType);
        } else {
          toast.error("File upload failed");
          setSceneType("CONTENT_SLIDE");
        }
      } catch (error) {
        toast.error("File upload error: " + error.message);
      } finally {
        setLoading(false);
      }
    } else {
      setSelectedFileList((prevState) =>
        prevState.map((item) =>
          item.hasOwnProperty(selectedScene.scene_id)
            ? { [selectedScene.scene_id]: null }
            : item
        )
      );
    }
  };

  const handleImageRemove = async() => {
    handleMarkdownContent(selectedMarkupText, "delete");
    // Update scenesData to remove the image
    let scene = scenesData[selectedSceneIndex];
    const updatedScenes = scenesData.map((s) =>
      s.scene_id === scene.scene_id ? { ...s, scene_image: "" } : s
    );
    setScenesData(updatedScenes);

    // Reset the image ID and file list
    setImageId(null);
    setImageType(null);
    setSelectedFileList((prevState) =>
      prevState.map((item) =>
        item.hasOwnProperty(selectedScene.scene_id)
          ? { [selectedScene.scene_id]: null }
          : item
      )
    );
    setSceneType("CONTENT_SLIDE");
    toast.success("Image Deleted Successfully");
  };

  const onMarkupTextChange = (event) => {
    setSelectedMarkupText(event.target.value);
    let scene = scenesData[selectedSceneIndex];
    const updatedScenes = scenesData.map((s) =>
      s.scene_id === scene.scene_id
        ? { ...s, scene_text: event.target.value }
        : s
    );
    setScenesData(updatedScenes);
  };

  const handleSceneTitleChange = (event) => {
    setSelectedTitle(event.target.value);
    let scene = scenesData[selectedSceneIndex];
    const updatedScenes = scenesData.map((s) =>
      s.scene_id === scene.scene_id
        ? { ...s, scene_title: event.target.value }
        : s
    );
    setScenesData(updatedScenes);
  };

  const handleWidgetChange = (event) => {
    setSelectedWidget(event.target.value);
    let scene = scenesData[selectedSceneIndex];
    const updatedScenes = scenesData.map((s) =>
      s.scene_id === scene.scene_id
        ? { ...s, scene_widget: event.target.value }
        : s
    );
    setScenesData(updatedScenes);
  };

  const handleWidgetRemove = () => {
    setSelectedWidget(null);
    let scene = scenesData[selectedSceneIndex];
    const updatedScenes = scenesData.map((s) =>
      s.scene_id === scene.scene_id ? { ...s, scene_widget: "" } : s
    );
    setScenesData(updatedScenes);
  };


  const handleSceneTypeChange = (event) => {

    setSceneType(event);
    let scene = scenesData[selectedSceneIndex];
    const updatedScenes = scenesData.map((s) =>
      s.scene_id === scene.scene_id ? { ...s, scene_type: event } : s
    );

    setScenesData(updatedScenes);
  };

  const handleBackgroundAnimation = (value) => {
    let scene = scenesData[selectedSceneIndex];
    const updatedScenes = scenesData.map((s) =>
      s.scene_id === scene.scene_id ? { ...s, scene_background_animation: value } : s
    );
    setScenesData(updatedScenes);
  };

  const onFinishRegenerateScene = async(values) => {
    let ai_generated_value = "true";
    setLoading(true);
    try {
      const response = await dispatch(
        regenerateScene({
          video_id: selectedTopicData?.video_id,
          scene_id: selectedScene?.scene_id,
          topic: selectedScene?.scene_title,
          scene_index: selectedSceneIndex,
          scene_text_color: selectedScene.scene_text_color,
          scene_type: sceneType,
          ai_generate: ai_generated_value,
          scene_bg_template: selectedScene.scene_bg_template,
          scene_avatar: selectedScene.scene_avatar
        })
      );
      // Handle the response here
      let newScene = response.payload.data;
      newScene = {
        ...newScene,
        scene_bg_template: selectedScene.scene_bg_template,
        scene_avatar: selectedScene.scene_avatar,
      };
      const updatedScenes = scenesData.map((scene) =>
        scene.scene_id === selectedScene?.scene_id ? newScene : scene
      );

      // Update your scenes data state with the new list
      setScenesData(updatedScenes);

      // Optionally, re-select the scene to update UI with regenerated data
      setSelectedScene(newScene);
      setSelectedSceneIndex(newScene.scene_index);
      setSelectedTitle(newScene.scene_title);
      setSelectedText(newScene.scene_narration);
      setSelectedMarkupText(newScene.scene_text);
      setSelectedAudio(newScene.scene_audio_template);
      setSelectedBackground(newScene.scene_bg_template);
      setSelectedAnimation(newScene.scene_style_template);
      setImageId(newScene.scene_image);
      setImageType(newScene.scene_image_type);
      setImagePosition(newScene.scene_image_position);
      setImageSize(newScene.scene_image_size);
      setContentPosition(newScene.scene_image_position);
      setContentSize(newScene.scene_image_size);
      setSelectedAvatar(newScene.scene_avatar);
      setSceneType(newScene.scene_type);
      setSceneTextColor(newScene.scene_text_color);
      setSelectedFileList([]);
      setSelectedWidgetsList(newScene.scene_widgets);
      // Perform any additional UI updates or show success messages
      setLoading(false);
    } catch (error) {
      // Handle any errors
      console.error("Error regenerating scene:", error);
      // Optionally, show error messages to the user
      setLoading(false);
    }
  };

  const itemsTextComp = [
    {
      key: "1",
      label: "Content Text",
      children: (
        <ContentText
          selectedBackground={selectedBackground}
          onBackgroundSelect={handleBackgroundSelect}
          selectedMarkupText={selectedMarkupText}
          onMarkupTextChange={onMarkupTextChange}
          handleSceneTitleChange={handleSceneTitleChange}
          selectedTitle={selectedTitle}
          sceneType={sceneType}
          handleSceneTypeChange={handleSceneTypeChange}
          onFinishRegenerateScene={onFinishRegenerateScene}
          selectedWidget={selectedWidget}
          selectedWidgetList={selectedWidgetList}
          handleWidgetChange={handleWidgetChange}
          handleWidgetRemove={handleWidgetRemove}
        />
      ),
    },
    {
      key: "2",
      label: "Audio Text",
      children: (
        <AudioText selectedText={selectedText} onTextChange={onTextChange} />
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: "Background",
      children: (
        <Background
          selectedBackground={selectedBackground}
          onBackgroundSelect={handleBackgroundSelect}
          aspectRatio={aspectRatio}
          selectedTopicData={selectedTopicData}
          selectedScene={selectedScene}
          backgroundList={bgImageListData}
          loadBackgroundImageList={loadBackgroundImageList}
        />
      ),
    },
    {
      key: "2",
      label: "Text Color",
      children: (
        <EditText
          scene_text_color={sceneTextColor}
          onscene_text_colorChange={handlescene_text_colorChange}
        />
      ),
    },
    {
      key: "3",
      label: "Audio",
      children: (
        <Audio
          onAudioSelect={handleAudioChange}
          selectedAudio={selectedAudio}
          selectedText={selectedText}
          onTextChange={onTextChange}
        />
      ),
    },
    {
      key: "4",
      label: "Media",
      disabled: sceneType === "CODE_SLIDE" || sceneType === "TITLE_SLIDE",
      children: (
        <Images
          onFileSelect={handleFileChange}
          handleMediaProperty={handleMediaProperty}
          onFileRemove={handleImageRemove}
          fileList={selectedFileList}
          currentSceneImageName={imageId}
        />
      ),
    },
    {
      key: "5",
      label: "Avatar",
      children: (
        <AnimationsAudio
          avatarWithAudio={avatarWithAudio}
          onAudioSelect={handleAudioChange}
          selectedAudio={selectedAudio}
          selectedText={selectedText}
          onTextChange={onTextChange}
          selectedAvatar={selectedAvatar}
          onAvatarSelect={handleAvatarSelect}
        />
      ),
    },
    {
      key: "6",
      label: "Animation",
      children: (
        <BackgroundAnimation
          handleBackgroundAnimation={handleBackgroundAnimation}
          backgroundAnimation={backgroundAnimation}
        />
      ),
    },
  ];

  const handleCardClick = async(scene) => {
    setSelectedScene(scene);
    setSelectedSceneIndex(scene.scene_index);
    setSelectedTitle(scene.scene_title);
    setSelectedText(scene.scene_narration);
    setSelectedMarkupText(scene.scene_text);
    setSelectedAudio(scene.scene_audio_template);
    setSelectedBackground(scene.scene_bg_template);
    setSelectedAnimation(scene.scene_style_template);
    setSceneType(scene.scene_type);
    setSceneTextColor(scene.scene_text_color);
    setSelectedAvatar(scene.scene_avatar);

    setImageId(scene.scene_image);
    setImageType(scene.scene_image_type);
    setImagePosition(scene.scene_image_position);
    setImageSize(scene.scene_image_size);
    setSelectedFileList([]);

    // if (scene.scene_title === "") {
    //   await dispatch(getVideoById({ video_id: topicDetails?.data?.video_id }));
    // }
  };

  const removeSpace = (text) => {
    if (text) {
      return text.replace(/\s+/g, " ");
    } else {
      return "";
    }
  };

  const handleUpdate = async() => {
    let updSceneData = { scenes: scenesData }; //[...filterData, updatedSceneData] };
    console.log("updatedScenes d", scenesData);
    let updatedTopicData = Object.assign({}, selectedTopicData, updSceneData);
    const asyncAction = new Promise((resolve, reject) => {
      dispatch(updateTopicContent(updatedTopicData));
      resolve();
    });
    asyncAction
      .then(() => {
        setSelectedTopicData(updatedTopicData);
        toast.success(<>Scenes getting updated successfully</>);
      })
      .catch((error) => {
        toast.error(
          <>
            Oh Sorry you cannot able to update the template, please try again.
          </>
        );
      });
  };

  const handleGenerateVideo = (e) => {
    const asyncAction = new Promise((resolve, reject) => {
      dispatch(generateVideo({ video_id: topicDetails?.data?.video_id }));

      resolve();
    });

    asyncAction
      .then(() => {
        if (props.handleCancel) {
          props.handleCancel(); // Close the modal after generating the video
        }
      })
      .catch((error) => {
        // Handle errors if necessary
        console.error("Error:", error);
        messageApi.error(
          "Oh Sorry video is not getting generated, please try again.",
          2.5
        );
      })
      .finally(() => {
        // Reset loading state regardless of success or failure
      });
  };

  const handleDownloadPpt = async(e) => {
    // Generate ppt content based on the course data
    // e.preventDefault();

    // Show a loading toast while the downloading is in progress
    const loadingToastId = toast.loading("Downloading Powerpoint...");

    // Dispatch deleteVideoById and wait for it to complete
    const resultAction = await dispatch(
      generatePptById({
        video_id: topicDetails?.data?.video_id,
      })
    );

    // Check if the generatePptById was successful
    if (generatePptById.fulfilled.match(resultAction)) {
      // Extract the data from the resultAction
      const { data } = resultAction.payload;
      if (data?.url) {
        // Redirect to the download URL
        window.location.href = data.url;
        // Update the toast to a success message
        toast.success("PowerPoint Downloaded successfully!", {
          id: loadingToastId,
        });
      } else {
        throw new Error("Failed to get download URL");
      }
    } else {
      // If the generate ppt failed, update the loading toast to an error message
      toast.error(
        `Failed to download PowerPoint: ${
          resultAction.payload?.message || resultAction.error.message
        }`,
        { id: loadingToastId }
      );
    }
  };

  const helpSceneContent = (
    <div>
      <p>
        You can select individual scenes for <strong>edit</strong> and{" "}
        <strong>preview</strong>.{" "}
      </p>
      <p>Customize each scene to meet your needs.</p>
    </div>
  );

  const deleteScene = async(event, sceneId) => {
    event.stopPropagation();
    setConfirmLoading(true);

    try {
      await dispatch(
        deleteScenes({
          video_id: selectedTopicData?.video_id,
          scene_id: sceneId,
        })
      );

      let removeScene = scenesData.filter(
        (scene) => scene.scene_id !== sceneId
      );
      let reindexedScenes = removeScene.map((scene, index) => ({
        ...scene,
        scene_index: index,
      }));

      setConfirmLoading(false);
      setDeleteSelectedScene(null);

      if (reindexedScenes.length > 0) {
        let sortedScenes = sortScenes(reindexedScenes);
        setScenesData(sortedScenes);
        setSelectedScene(sortedScenes[0]);
        setSelectedSceneIndex(sortedScenes[0].scene_index);
        setSelectedTitle(sortedScenes[0].scene_title);
        setSelectedText(removeSpace(sortedScenes[0].scene_narration));
        setSelectedMarkupText(removeSpace(sortedScenes[0].scene_text));
        setSelectedAudio(sortedScenes[0].scene_audio_template);
        setSelectedBackground(sortedScenes[0].scene_bg_template);
        setSelectedAnimation(sortedScenes[0].scene_style_template);
        setImageId(sortedScenes[0].scene_image);
        setImageType(sortedScenes[0].scene_image_type);
        setSceneType(sortedScenes[0].scene_type);
        setSceneTextColor(sortedScenes[0].scene_text_color);
        setSelectedAvatar(sortedScenes[0].scene_avatar);
        if (sortedScenes[0].scene_image === "") {
          setSelectedFileList([]);
        } else {
          if (sceneType === "CONTENT_SLIDE")
            setSceneType("CONTENT_SLIDE_WITH_IMAGE");
        }

        toast.success("Scene deleted successfully!");
      } else {
        setScenesData([]);
        setSelectedScene(null); // Avoid setting it to an empty array, use null
        setSelectedSceneIndex(null);
        setSelectedTitle("");
        setSelectedText("");
        setSelectedMarkupText("");
        setSelectedAudio("");
        if (aspectRatio === "16:9") {
          setSelectedBackground("bg_1");
        } else {
          setSelectedBackground("bg_1_9x16");
        }
        setSelectedAnimation(null);
        setImageId(null);
        setImageType(null);
        setSelectedAvatar("");
        setSceneType(null);

        toast.info("All scenes have been deleted.");
      }
    } catch (error) {
      console.error("Error deleting scene:", error);

      // Show error message
      toast.error("Failed to delete the scene. Please try again.");
    } finally {
      setConfirmLoading(false);
      setDeleteSelectedScene(null); // Clear selection after deletion attempt
    }
  };

  const sortScenes = (unsortedData) => {
    return unsortedData?.slice().sort((a, b) => a.scene_index - b.scene_index);
  };

  const handleOnDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (destination.index === source.index) return; // Item dropped in the same place

    const reorderedScenes = Array.from(scenesData);
    const [movedScene] = reorderedScenes.splice(source.index, 1);
    reorderedScenes.splice(destination.index, 0, movedScene);

    setScenesData(reorderedScenes);
  };

  const handleCancel = () => {
    setIsSceneModalOpen(false);
  };

  const showSceneModal = (index) => {
    setIsSceneModalOpen(true);
    setCreateNewSceneIndex(++index);
  };

  const onFinishScene = async(values) => {
    let ai_generated_value = "false";
    if (actionType === "GenerateByAI") {
      ai_generated_value = "true";
    }

    setLoading(true);
    try {
      const response = await dispatch(
        createScenes({
          video_id: selectedTopicData?.video_id,
          topic: values.sceneName,
          scene_type: values.sceneType,
          scene_index: createNewSceneIndex, //selectedTopicData?.scenes.length,
          ai_generate: ai_generated_value,
          scene_bg_template: selectedScene.scene_bg_template,
          scene_avatar: selectedScene.scene_avatar,
          scene_text_color: selectedScene.scene_text_color,
        })
      );
      // Handle the response here
      let newScene = response.payload.data;

      newScene = {
        ...newScene,
        scene_index: createNewSceneIndex, //selectedTopicData?.scenes.length
        scene_bg_template: selectedScene.scene_bg_template,
        scene_avatar: selectedScene.scene_avatar,
        scene_text_color: selectedScene.scene_text_color,
      };
      const updatedScenes = updateSceneIndices(scenesData, newScene);

      if (
        response.payload.data ===
          "Unable to generate scene at this point. Try after sometime!" ||
        response.payload.data ===
          "Unable to generate scene at this point. Try after sometime!"
      ) {
        toast.error(
          response.payload.data +
            ". " +
            "If the problem persists, contact support at info@techjedi.in."
        );
      } else {
        let sortedScenes = sortScenes(updatedScenes);
        setScenesData(sortedScenes);
        let createdData = sortedScenes.filter(
          (scene) => scene?.scene_id === response?.payload?.data?.scene_id
        );

        setSelectedScene(createdData[0]);
        setSelectedSceneIndex(newScene.scene_index);
        setSelectedTitle(newScene.scene_title);
        setSelectedText(newScene.scene_narration);
        setSelectedMarkupText(newScene.scene_text);
        setSelectedAudio(newScene.scene_audio_template);
        setSelectedBackground(newScene.scene_bg_template);
        setSelectedAnimation(newScene.scene_style_template);
        setImageId(newScene.scene_image);
        setImageType(newScene.scene_image_type);
        setSelectedAvatar(newScene.scene_avatar);
        setSceneType(newScene.scene_type);
        setSceneTextColor(newScene.scene_text_color);
        if (newScene.scene_image === "") {
          setSelectedFileList([]);
        } else {
          // Incase of content slide - make it a 'CONTENT_SLIDE_WITH_IMAGE'
          if (sceneType === "CONTENT_SLIDE")
            setSceneType("CONTENT_SLIDE_WITH_IMAGE");
        }

        // Reset form fields after successful creation
        form.resetFields();

        // Do additional processing here, e.g., show a success message, update local state, etc.
        setLoading(false);
        setIsSceneModalOpen(false);

        toast.success("Scene created successfully!");
      }
    } catch (error) {
      // Handle errors
      console.error("Error creating scene:", error);
      toast.error("Failed to create scene. Please try again later.");
      setLoading(false);
    }
  };
  const sceneRefs = useRef([]);

  useEffect(() => {
    sceneRefs.current = new Array(scenesData.length);
  }, [scenesData.length]);

  const updateSceneIndices = (scenes, newScene) => {
    let sceneIndex = newScene.scene_index;
    return scenes.reduce(
      (updatedScenes, scene) => {
        if (scene.scene_index >= newScene.scene_index) {
          sceneIndex = sceneIndex + 1;
          // Create a new object with the updated index
          const updatedScene = { ...scene, scene_index: sceneIndex };
          updatedScenes.push(updatedScene);
        } else {
          updatedScenes.push(scene);
        }
        return updatedScenes;
      },
      [newScene]
    ); // Start with the new scene added
  };

  const [, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const showPopconfirm = (sceneId) => {
    setOpen(true);
    setDeleteSelectedScene(sceneId);
  };

  const handleDeleteCancel = () => {
    setOpen(false);
    setDeleteSelectedScene(null);
  };

  const onFinishFailed = (errorInfo) => {};


  // Define the scene type options
  const options = [
    { value: "CODE_SLIDE", label: "Code" },
    { value: "CONTENT_SLIDE", label: "Content" },
    { value: "CONTENT_SLIDE_WITH_IMAGE", label: "Content with Media" },
    { value: "TITLE_SLIDE", label: "Title" },
    { value: "IMAGE_ONLY_SLIDE", label: "Media" }
  ];

  const selectedBackgroundURL = useMemo(() => {
    return `${ImageFileWithType(backgroundList, selectedBackground, "")}`;
  }, [backgroundList, selectedBackground]);

  return (
    <div className={styles.wrapper} ref={localRef}>
      {loading && (
        <div
          style={{
            position: "fixed", // Use 'fixed' to keep it relative to the viewport
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            display: "flex",
            alignItems: "center", // Center vertically
            justifyContent: "center", // Center horizontally
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: semi-transparent background
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          <Spin size="large" tip="Uploading..." />
        </div>
      )}
      {status === "succeeded" ? (
        <>
          <div ref={leftColRef} className={styles.contnetSection}>
            <div className={styles.slides}>
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <SwitcherOutlined
                  style={{ marginRight: "8px", marginLeft: "10px" }}
                />
                <VaTitle level={5} text="Scenes" />
                <Popover content={helpSceneContent} title="Help">
                  <QuestionCircleOutlined
                    style={{
                      marginLeft: "8px",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  />
                </Popover>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  type="text"
                  icon={<LeftOutlined />}
                  onClick={() => {
                    if (selectedSceneIndex > 0) {
                      const newIndex = selectedSceneIndex - 1;
                      setSelectedSceneIndex(newIndex);
                      handleCardClick(scenesData[newIndex]);

                      // Scroll to the previous scene
                      setTimeout(() => {
                        sceneRefs.current[newIndex]?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      }, 0); // Ensure scrolling happens after state update
                    }
                  }}
                  disabled={selectedSceneIndex === 0} // Disable if it's the first scene
                  style={{ marginTop: "40px", marginRight: "5px" }}
                />
                <DragDropContext onDragEnd={handleOnDragEnd}>
                  <Droppable droppableId="scenesList" direction="horizontal">
                    {(provided) => (
                      <div
                        className={styles.scenesList}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {scenesData.map((item, index) => {
                          return (
                            <Draggable
                              key={item.scene_id}
                              draggableId={item.scene_id}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  className={styles.sceneWrapper}
                                  key={index}
                                  // ref={(el) => (sceneRefs.current[index] = el)} // Assign ref to each scene
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => {
                                    handleCardClick(item);
                                    setSelectedSceneIndex(index); // Update the selected scene index
                                    // Scroll to the clicked scene
                                    setTimeout(() => {
                                      sceneRefs.current[index]?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "center",
                                      });
                                    }, 0); // Ensure scrolling happens after state update
                                  }}
                                >
                                  <div className={styles.sceneText}>
                                    <VaText text={`Scene ${index + 1}`} />
                                  </div>
                                  <div style={{ display: "flex" }}>
                                    <div
                                      className={`${styles.scenes} ${
                                        selectedScene &&
                                        selectedScene.scene_id === item.scene_id
                                          ? styles.active
                                          : ""
                                      }`}
                                    >
                                      {selectedScene &&
                                        selectedScene.scene_id ===
                                          item.scene_id &&
                                        scenesData.length > 1 && (
                                        <div
                                          className={styles.closeIconWrapper}
                                        >
                                          <Popconfirm
                                            title="Delete Scene"
                                            description={`Do you want to delete the Scene: ${
                                              item.scene_title ||
                                                "No title available"
                                            }.`}
                                            open={
                                              deleteSelectedScene ===
                                                item.scene_id
                                            }
                                            onConfirm={(event) =>
                                              deleteScene(
                                                event,
                                                item?.scene_id
                                              )
                                            }
                                            okButtonProps={{
                                              loading: confirmLoading,
                                            }}
                                            onCancel={handleDeleteCancel}
                                          >
                                            <Button
                                              type="text"
                                              icon={<DeleteFilled />}
                                              onClick={(e) => {
                                                e.stopPropagation(); // Prevents the scene from being selected again when clicking the button
                                                showPopconfirm(
                                                  item?.scene_id
                                                );
                                              }}
                                              className={styles.closeButton}
                                            />
                                          </Popconfirm>
                                        </div>
                                      )}
                                      <div className={styles.imageContainer}>
                                        <Image
                                          preview={false}
                                          // src={require(`../../../asset/images/background/${item.scene_bg_template}.gif`)}
                                          // src={`https://va-background-images.s3.amazonaws.com/${item?.scene_bg_template}.gif`}
                                          src={`${ImageFileWithType(
                                            backgroundList,
                                            item?.scene_bg_template,
                                            item?.image_type || ""
                                          )}`}
                                        />
                                        <div
                                          className={styles.centeredText}
                                          style={{
                                            color: sceneTextColor.title,
                                          }}
                                        >
                                          {item.scene_title}
                                        </div>
                                      </div>
                                    </div>
                                    <div className={styles.sceneAdd}>
                                      <Button
                                        type="text"
                                        icon={<PlusOutlined />}
                                        onClick={() => showSceneModal(index)}
                                        className={styles.addNewSceneButton}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <Button
                  type="text"
                  icon={<RightOutlined />}
                  onClick={() => {
                    if (selectedSceneIndex < scenesData.length - 1) {
                      const newIndex = selectedSceneIndex + 1;
                      setSelectedSceneIndex(newIndex);
                      handleCardClick(scenesData[newIndex]);

                      // Scroll to the next scene
                      setTimeout(() => {
                        sceneRefs.current[newIndex]?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      }, 0); // Ensure scrolling happens after state update
                    }
                  }}
                  disabled={selectedSceneIndex === scenesData.length - 1} // Disable if it's the last scene
                  style={{ marginTop: "40px", marginLeft: "5px" }}
                />
              </div>
            </div>
            <div className={styles.preview}>
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <PlaySquareOutlined
                  style={{ marginRight: "8px", marginLeft: "10px" }}
                />
                <VaTitle
                  level={5}
                  text={"Scene " + (selectedSceneIndex + 1) + " - Preview"}
                />
              </div>
              <div
                ref={previewRef}
                style={{
                  // width: '1980px',
                  // height: '1080px',
                  // maxHeight: '60rem',
                  transform: `scale(${scale})`,
                  transformOrigin: "top left", // Adjust the origin as needed
                  backgroundColor: "#f0f0f0", // Example background
                  // overflow: 'hidden', // Prevent overflow
                  marginLeft: `-${negativeMargin}%`,
                  marginTop: `-${negativeMargin}%`,
                }}
              >
                {/* {scenesData.map((itemData, i) => ( */}
                <div className={styles.remotionPlayer}>
                  <PreviewComponent
                    sceneType={sceneType}
                    selectedTitle={selectedTitle}
                    aspectRatio={aspectRatio}
                    selectedContent={handleMarkdownContent(
                      selectedMarkupText,
                      "insert",
                      sceneType
                    )}
                    // selectedBackground={`${ImageFileWithType(backgroundList,selectedBackground,'')}?t=${new Date().getTime()}`}
                    selectedBackground={selectedBackgroundURL}
                    selectedAnimation={selectedAnimation || "fadeIn"}
                    imageId={imageId}
                    imageType={imageType}
                    imagePosition={imagePosition}
                    contentPosition={contentPosition}
                    setContentPosition={setContentPosition}
                    setContentSize={setContentSize}
                    contentSize={contentSize}
                    selectedWidget={selectedWidget}
                    selectedWidgetsList={selectedWidgetList}
                    selectedAvatar={selectedAvatar}
                    imageSize={imageSize}
                    scene_text_color={sceneTextColor}/>
                  {selectedAvatar ? (
                    <div className={styles.avatar}>
                      {(() => {
                        try {
                          // Dynamically require the image
                          const avatarSrc = require(`../../../asset/images/avatar/${selectedAvatar}.jpg`);
                          return <img src={avatarSrc} alt="Avatar" />;
                        } catch (e) {
                          console.error(
                            "Avatar image not found:",
                            selectedAvatar,
                            e
                          );
                          return null; // Or display a fallback avatar if required
                        }
                      })()}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.contnetActions}>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <div className={styles.tabs}>
                <Tabs defaultActiveKey="1" items={itemsTextComp} />
              </div>
            </div>

            <div className={styles.textArea}></div>
            <div className={styles.tabs}>
              <Tabs
                defaultActiveKey="1"
                items={items}
                onChange={(key) => setTabCount(key)}
              />
            </div>

            {tabCount === "5" && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                  padding: "10px",
                }}
              >
                <Switch
                  onChange={(e) =>
                    setAvatarWithAudio(
                      e === true ? "audioOnly" : "avatarWithAudio"
                    )
                  }
                />
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#333",
                    marginLeft: "10px",
                  }}
                >
                  {/* Display selected text dynamically */}
                  {avatarWithAudio === "audioOnly"
                    ? "Audio Only"
                    : "Avatar With Audio"}
                </span>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                variant="primary"
                onClick={handleApplyAll}
                disabled={isApplyAllDisabled} // This controls the button's disabled state
                style={{
                  backgroundColor: isApplyAllDisabled ? "#ccc" : "darkorange", // Optional: Change color when disabled
                  color: "white",
                  paddingLeft: "25px",
                  paddingRight: "25px",
                  cursor: isApplyAllDisabled ? "not-allowed" : "pointer", // Change cursor when disabled
                }}
              >
                Apply All
              </Button>
              <p style={{ marginLeft: "10px" }}>
                <strong>Note: </strong> Apply all only for Background and Avatar
              </p>
            </div>
          </div>
        </>
      ) : (
        <div
          style={{
            textAlign: "center",
            position: "relative",
            height: "600px",
            left: "260px",
          }}
        >
          <Spin
            size="large"
            style={{ alignContent: "center", marginTop: "250px" }}
            className="spinner-container"
          />
          <div style={{ marginTop: "20px", fontSize: "16px", color: "#000" }}>
            Just a sec! It’s almost ready for you!
          </div>
        </div>
      )}
      <Modal
        title="Create New Scene"
        open={isSceneModalOpen}
        onCancel={() => {
          handleCancel();
          form.resetFields(); // Reset the input fields when modal is closed
        }}
        maskClosable={true} // Prevents closing on click outside
        footer={[
          <div
            key="footer"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginTop: "20px",
            }}
          >
            <Button
              type="primary"
              onClick={() => {
                setActionType("GenerateByAI");
                form.submit();
              }}
            >
              AI Generate
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setActionType("CustomGenerate");
                form.submit();
              }}
            >
              Custom Generate
            </Button>
          </div>,
        ]}
      >
        <div className={styles.formWrapper}>
          <Form
            name="createScene"
            form={form}
            onFinish={onFinishScene}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Enter your Scene Title:"
              name="sceneName"
              rules={[
                {
                  required: true,
                  message: "Please enter your Scene Name!",
                },
              ]}
            >
              <Input placeholder="Eg: Learn ChatGPT" />
            </Form.Item>
            <Form.Item
              label="Enter your Scene Type:"
              name="sceneType"
              rules={[
                {
                  required: true,
                  message: "Please select your Scene Type!",
                },
              ]}
            >
              <Select
                // mode="multiple"
                style={{
                  width: "100%"
                }}
                placeholder="Select one scene type"
                // defaultValue={['china']}
                // onChange={handleChange}
                options={options}
              />
            </Form.Item>
          </Form>
        </div>
        {loading && (
          <div className={styles.loaderContainer}>
            <Spin
              size="large"
              // style={{ display: 'block', margin: '0 auto', marginTop: '200px' }}
            />
            <p>Topic is Generating...</p>
          </div>
        )}
      </Modal>
    </div>
  );
});

export default Generate;
