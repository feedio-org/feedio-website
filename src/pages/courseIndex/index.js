import {
  EditOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Form, Image, Input, Modal, Spin, Upload } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { VaText, VaTitle } from "shared/components/typography";
import { getCourseById } from "../dashboard/redux/courseSlice";
import styles from "./courseIndex.module.scss";
import Indexing from "./indexing";
import { updateCourseContent } from "./redux/topicContentSlice";

export default function CourseIndex() {
  const dispatch = useDispatch();
  let { courseId } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState([]);
  const [hover, setHover] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [editing, setEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdatingModalOpen, setIsUpdatingModalOpen] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [courseDet, setCourseDet] = useState([]);
  const [selectedFileList, setSelectedFileList] = useState(null);
  const [form] = Form.useForm();

  let courseDetails = useSelector((state) => state.course.course);
  const status = useSelector((state) => state.course.status);
  const error = useSelector((state) => state.course.error);

  console.log(useSelector((state) => state.course));

  console.log(courseId);

  useEffect(() => {
    if (status === "succeeded" && courseDetails) {
      const sortedData = courseDetails?.data?.course?.lessons
        .slice()
        .sort((a, b) => a.lesson_index - b.lesson_index);

      setCourseData(sortedData);
      setCourseDet(courseDetails?.data?.course);
      setCourseName(courseDetails?.data?.course?.title);
      setDescription(courseDetails?.data?.course?.description);
      setImageFile(courseDetails?.data?.course?.thumbnail_image);
    }
  }, [status, courseDetails]);

  useEffect(() => {
    if (!isModalVisible && !isUpdatingModalOpen) {
      const fetchVideos = () => {
        console.log(courseDetails?.data?.course?.course_id);
        dispatch(
          getCourseById({
            course_id: courseId,
          })
        );
        // if (
        //   courseId === courseDetails?.data?.course?.course_id &&
        //   courseId !== 'new'
        // ) {
        //   if (courseDetails?.data?.course?.course_id) {
        //     console.log('if 1-->>');
        //     dispatch(
        //       getCourseById({
        //         course_id: courseDetails?.data?.course?.course_id
        //       })
        //     );
        //   } else if (courseId !== '' && courseId !== 'new') {
        //     console.log('if 2-->>');

        //     dispatch(getCourseById({ course_id: courseId }));
        //   } else {
        //   }
        // } else {
        //   console.log(status);
        //   console.log(courseDetails);
        //   console.log(courseId);

        //   if (
        //     courseId !== courseDetails?.data?.course?.course_id ||
        //     courseId !== 'new'
        //   ) {
        //     console.log('else 1');

        //     dispatch(getCourseById({ course_id: courseId }));
        //   } else {
        //     console.log('else 2');
        //     if (courseId === '' || courseId === 'new')
        //       courseId = courseDetails?.data?.course?.course_id;

        //     console.log(courseId);

        //     if (courseId === 'new' && status === 'succeeded') {
        //       console.log('else 3');
        //       dispatch(
        //         getCourseById({
        //           course_id: courseDetails?.data?.course?.course_id
        //         })
        //       );
        //     }
        //   }
        // }
      };
      // Fetch videos immediately on mount
      fetchVideos();

      // Set an interval to fetch videos every 1 minute (60000 milliseconds)
      const intervalId = setInterval(() => {
        fetchVideos();
      }, 300000);

      // Clear the interval when the component unmounts
      return () => {
        console.log("Clearing interval");
        clearInterval(intervalId);
      };
    }
  }, [dispatch, isModalVisible, isUpdatingModalOpen, courseId]);

  const handleEditClick = () => {
    setIsModalVisible(true);
  };

  const handleSave = (values) => {
    console.log(values);
    console.log(courseDet);
    console.log(courseDetails);
    console.log(courseDetails?.data?.course);

    let desc = "";
    let setCourse = "";
    if (values?.courseName) {
      setCourse = values.courseName;
    } else {
      setCourse = courseDet?.courseName;
    }
    console.log(setCourse);
    if (values?.description) {
      desc = values.description;
    } else {
      desc = courseDet?.description;
    }
    console.log(desc);

    const updatedCourse = {
      ...courseDet,
      description: desc ? desc : courseDetails?.data?.course?.description,
      title: setCourse ? setCourse : courseDetails?.data?.course?.title,
    };
    dispatch(updateCourseContent(updatedCourse))
      .then(() => {
        // toast.success(<>Course Image and description saved successfully</>, {
        //   style: { fontSize: '15px', autoClose: 5000, marginRight: '150px' } // You can still adjust the font size if needed
        // });
        setIsModalVisible(false);
        dispatch(getCourseById({ course_id: updatedCourse?.course_id }));
      })
      .catch((error) => {
        toast.error(<>Failed to save the course content:, {error.message}</>);
      });
  };
  const toggleNote = () => {
    setShowNote((prevShowNote) => !prevShowNote);
  };
  const handleIconClick = () => {
    setShowNote((prevState) => !prevState);
  };

  const handleFileChange = async ({ fileList }) => {
    const updatedFileList = Array.isArray(fileList) ? fileList : [];
    const file = updatedFileList[0]?.originFileObj;

    if (file) {
      const newFileName = courseDetails?.data?.course?.course_id;
      const renamedFile = new File([file], newFileName, { type: file.type });

      const updatedCourse = {
        ...courseDet,
        thumbnail_image: newFileName,
      };
      setCourseDet(updatedCourse);

      const formData = new FormData();
      Object.keys(courseDetails?.data?.course?.upload_url.fields).forEach(
        (key) => {
          formData.append(
            key,
            courseDetails?.data?.course?.upload_url.fields[key]
          );
        }
      );
      formData.append("file", renamedFile);

      try {
        const response = await axios.post(
          courseDetails?.data?.course?.upload_url.url,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Ensure this is correct
            },
          }
        );
        if (response.status === 204) {
          toast.success(<>File uploaded successfully</>);
        } else {
          toast.error(<>File upload failed with status: ,{response.status}</>);
        }
      } catch (error) {
        console.error("File upload error:", error);
        toast.error(<>File upload error: ,{error.message}</>);
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const modalPopupOpen = (flag) => {
    console.log(flag);
    setIsUpdatingModalOpen(flag);
  };

  return (
    <>
      {status === "succeeded" ? (
        <div className={styles.wrapper}>
          <div className={styles.courseContent}>
            <div className={styles.thumbnail}>
              <Image
                height={200}
                width={300}
                preview={false}
                src={
                  imageFile
                    ? `https://va-sc-images.s3.amazonaws.com/${imageFile}`
                    : require(`../../asset/images/course.png`)
                }
              />
            </div>
            <div className={styles.contnet}>
              <div className={styles.actions}>
                <Button
                  shape="circle"
                  className={styles.uploadIcon}
                  icon={<EditOutlined />}
                  onClick={handleEditClick}
                />
              </div>
              <div className={styles.contnetAction}>
                <VaTitle
                  className={styles.h5}
                  level={5}
                  text={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
              </div>

              <VaText
                className={styles.text}
                text={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.Indexing}>
            {courseData?.map((item) => (
              <Indexing
                key={item.lesson_index}
                data={item}
                lessonId={item.lesson_id}
                courseId={
                  courseId !== "new"
                    ? courseId
                    : courseDetails?.data?.course?.course_id
                }
                generatedVideoList={courseDetails?.data}
                modalPopupOpen={modalPopupOpen}
              />
            ))}
          </div>
          <div className={styles.formWrapper}>
            <Modal
              title={
                <span style={{ fontWeight: "bold" }}>Edit Course Details</span>
              }
              open={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              footer={[
                <Button key="back" onClick={() => setIsModalVisible(false)}>
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => form.submit()}
                >
                  Save
                </Button>,
              ]}
            >
              <Form
                name="generate"
                form={form}
                onFinish={handleSave}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  label="Name"
                  name="courseName"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: 'Please input your Course Name!'
                  //   }
                  // ]}
                >
                  <Input defaultValue={courseName} />
                </Form.Item>
                <Form.Item label="Description" name="description">
                  <Input defaultValue={description} />
                </Form.Item>
              </Form>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{ position: "relative" }}
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                >
                  <Upload
                    multiple={false}
                    beforeUpload={() => false} // Prevent auto upload
                    fileList={selectedFileList}
                    onChange={handleFileChange}
                    accept="image/*" // Accept only image files
                  >
                    <Button
                      type="primary"
                      icon={<UploadOutlined />}
                      style={{ backgroundColor: "#2596be" }}
                    >
                      Upload
                    </Button>
                  </Upload>

                  {/* This will show the message when hovered */}
                  {hover && (
                    <span
                      style={{
                        marginTop: "8px",
                        position: "absolute",
                        top: "40px", // adjust the value based on button's height
                        left: "0",
                        fontSize: "12px",
                        textWrap: "nowrap",
                      }}
                    >
                      Upload image
                    </span>
                  )}
                </div>

                {/* This will place the note next to the upload button */}
                <QuestionCircleOutlined
                  onClick={handleIconClick}
                  style={{
                    color: "orange",
                    fontSize: "16px",
                    marginLeft: "15px", // adjust spacing between button and icon
                    cursor: "pointer",
                  }}
                />

                {showNote && (
                  <span
                    style={{
                      fontSize: "12px",
                      marginLeft: "10px", // adjust spacing between icon and note
                    }}
                  >
                    Note: Upload a 2000x2000 resolution image for optimal view
                  </span>
                )}
              </div>
            </Modal>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", height: "500px" }}>
          <Spin
            size="large"
            className="spinner"
            style={{ display: "block", margin: "0 auto", marginTop: "250px" }}
          />
          <div style={{ marginTop: "20px" }}>
            <h3>Setting up the structure, hold on for a moment!</h3>
          </div>
        </div>
      )}
    </>
  );
}
