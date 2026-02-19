import {
  AppstoreAddOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  RedoOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Form, Input, Modal, Popover, Select, Tag } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
import { VaTitle } from "../typography";
import styles from "./generate.module.scss";
import WidgetForm from "./widgetForm";

const { TextArea } = Input;

const helpContent = (
  <div>
    <p>
      Hey there! Feel free to <strong>edit</strong> and <strong>view</strong>{" "}
      your text based on your needs.
    </p>
  </div>
);

export default function ContentText({
  selectedMarkupText,
  onMarkupTextChange,
  handleSceneTitleChange,
  selectedTitle,
  sceneType,
  handleSceneTypeChange,
  onFinishRegenerateScene,
  selectedWidget,
  handleWidgetChange,
  handleWidgetRemove,
  selectedWidgetList,
}) {
  const [form] = Form.useForm();
  const [widgetModalOpen, setWidgetModalOpen] = useState(false);

  const options = [
    { value: "CODE_SLIDE", label: "Code" },
    { value: "CONTENT_SLIDE", label: "Content" },
    { value: "CONTENT_SLIDE_WITH_IMAGE", label: "Content with Media" },
    { value: "TITLE_SLIDE", label: "Title" },
    { value: "IMAGE_ONLY_SLIDE", label: "Media" },
    {
      value: "WIDGET_SLIDE",
      label: "Slide with Widget",
      newFeature: true,
      disabled: true,
    },
    {
      value: "DISCHARGE_SUMMARY_CARD",
      label: "Discharge Summary Card",
      newFeature: true,
    },
    {
      value: "DISCHARGE_SUMMARY_CARDS",
      label: "Discharge Summary Card (2)",
      newFeature: true,
    },
    {
      value: "DISCHARGE_SUMMARY_TABLE",
      label: "Discharge Summary Table",
      newFeature: true,
    },
  ];

  const handleWidget = (e) => {
    setWidgetModalOpen(false);
    handleWidgetChange(e);
  };

  const [loadings, setLoadings] = useState([false]);

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
      toast.success("Regenerated Scene Successfully");
    }, 3000);
  };

  // Function to handle the delete action
  const handleDelete = (index) => {
    // Logic for deleting a widget from the list
    // E.g., update state to remove widget at the index
    console.log(`Delete widget at index ${index}`);
  };

  // Function to handle the update action
  const handleUpdate = (index) => {
    // Logic for updating a widget
    // E.g., open a modal or trigger an edit action
    console.log(`Update widget at index ${index}`);
  };

  const AvatarImage = (widget) => {
    switch (widget) {
    case "CARD":
      return "https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*QXO1SKEdIzYAAAAAAAAAAAAADrJ8AQ/original";
    case "TABLE":
      return "https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*3yz3QqMlShYAAAAAAAAAAAAADrJ8AQ/original";
    case "IMAGE":
      return "https://via.placeholder.com/150";
    default:
      return "https://via.placeholder.com/150";
    }
  };

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.contentActions}>
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <FileTextOutlined style={{ marginRight: "8px" }} />
          <VaTitle level={5} text="Content Text" />
          <Popover content={helpContent} title="Help">
            <QuestionCircleOutlined
              style={{
                marginLeft: "280px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            />
          </Popover>
        </div>
        <div className={styles.videoText} style={{ width: "420px" }}>
          <TextArea
            rows={8}
            placeholder="maxLength is 6"
            value={selectedMarkupText}
            name="sceneMarkupText"
            onChange={(event) => onMarkupTextChange(event)}
          />
        </div>
        <Form layout="horizontal" style={{ width: "100%", marginTop: "20px" }}>
          <Form.Item label="Scene Title:" style={{ marginBottom: "1rem" }}>
            <Input value={selectedTitle} onChange={handleSceneTitleChange} />
          </Form.Item>

          <Form.Item label="Scene Type:" style={{ marginBottom: "1rem" }}>
            <Select
              value={sceneType}
              onChange={handleSceneTypeChange}
              style={{ width: "100%" }}
              placeholder="Select Scene Type"
            >
              {options.map((option) => (
                <Select.Option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>{option.label}</span>
                    {option.newFeature && (
                      <Tag
                        color="green"
                        bordered={false}
                        style={{ marginLeft: "8px" }}
                      >
                        New
                      </Tag>
                    )}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {sceneType === "WIDGET_SLIDE" && (
            <Form.Item label="Scene Widget:" style={{ marginBottom: "1rem" }}>
              <Button
                style={{ alignItems: "center" }}
                type="primary"
                icon={<AppstoreAddOutlined />}
                loading={loadings[0]}
                onClick={() => setWidgetModalOpen(true)}
                disabled={
                  sceneType !== "WIDGET_SLIDE" || selectedWidgetList.length > 0
                }
              >
                Add Widget
              </Button>

              {selectedWidgetList.length > 0 &&
                selectedWidgetList.map((widget, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "8px",
                      marginRight: "8px",
                      marginLeft: "8px",
                      display: "inline-block",
                      position: "relative",
                    }}
                  >
                    <Popover
                      content={
                        <div
                          style={{
                            padding: "12px",
                            borderRadius: "12px",
                            width: "180px",
                          }}
                          trigger="hover"
                          placement="bottom"
                        >
                          <Button
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleUpdate(index)}
                            style={{
                              marginBottom: "8px",
                              width: "100%", // Full width for buttons to make them look more balanced
                              textAlign: "left",
                              paddingLeft: "12px",
                              borderRadius: "8px", // Rounded corners for the buttons
                              transition: "all 0.2s ease",
                            }}
                          >
                            Update
                          </Button>

                          <Button
                            size="small"
                            icon={<RedoOutlined />}
                            // onClick={() => handleChangeWidget(index)}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              paddingLeft: "12px",
                              borderRadius: "8px",
                              transition: "all 0.2s ease",
                            }}
                          >
                            Change Widget
                          </Button>
                          <Button
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(index)}
                            style={{
                              marginTop: "8px",
                              width: "100%",
                              textAlign: "left",
                              paddingLeft: "12px",
                              borderRadius: "8px",
                              transition: "all 0.2s ease",
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      }
                      trigger="hover"
                      placement="bottom"
                    >
                      <Avatar
                        shape="square"
                        src={AvatarImage(widget.name)} // Use the correct image source for the avatar
                        style={{
                          cursor: "pointer",
                          border: "2px solid #f0f0f0", // Light border effect for visual distinction
                          transition: "transform 0.3s ease, border 0.3s ease", // Smooth transition for scale and border
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.1)"; // Smooth scale-up effect on hover
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)"; // Reset scale
                        }}
                      />
                    </Popover>
                  </div>
                ))}
            </Form.Item>
          )}
        </Form>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            style={{ alignItems: "center", marginLeft: "250px" }}
            type="primary"
            icon={<ReloadOutlined />}
            loading={loadings[0]}
            onClick={() => {
              enterLoading(0);
              onFinishRegenerateScene();
            }}
          >
            Regenerate Scene
          </Button>
        </div>
      </div>

      <Modal
        title="Widgets"
        open={widgetModalOpen}
        onCancel={() => setWidgetModalOpen(false)}
        onOk={() => setWidgetModalOpen(false)}
        maskClosable={false}
        footer={[
          <>
            <Button key="back" onClick={() => setWidgetModalOpen(false)}>
              Cancel
            </Button>
            <Button key="add" type="primary" onClick={() => form.submit()}>
              Add Widget
            </Button>
          </>,
        ]}
      >
        <div
          style={{
            marginBottom: "20px",
            backgroundColor: "#f5f5f5",
            padding: "15px",
          }}
        >
          <WidgetForm
            selectedWidget={selectedWidget}
            selectedWidgetList={selectedWidgetList}
            handleWidget={handleWidget}
            selectedMarkupText={selectedMarkupText}
            form={form}
          />
        </div>
      </Modal>
    </div>
  );
}
