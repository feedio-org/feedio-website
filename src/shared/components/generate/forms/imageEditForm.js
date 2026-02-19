import { Button, Form, Input, Select, Space } from "antd";
import FormBuilder from "antd-form-builder";
import React, { useEffect, useState } from "react";
import { LinkOutlined, DisconnectOutlined } from "@ant-design/icons";

const ImageEditForm = ({ form, onFinish, imageInitialValues }) => {
  const [linked, setLinked] = useState(false);

  useEffect(() => {
    imageInitialValues && form.setFieldsValue({
      scene_image_size: { width: imageInitialValues.width, height: imageInitialValues.height },
      scene_image_position: "right",
    });
  }, [form]);

  const handleSubmit = (values) => {
    if (!values.scene_image_position) {
      values.scene_image_position = "right";
    }
    onFinish(values);
  };

  const handleWidthChange = (e) => {
    const width = e.target.value;
    const height = linked ? width : form.getFieldValue("scene_image_size")?.height;
    form.setFieldsValue({ scene_image_size: { width, height } });
  };

  const handleHeightChange = (e) => {
    const height = e.target.value;
    const width = linked ? height : form.getFieldValue("scene_image_size")?.width;
    form.setFieldsValue({ scene_image_size: { width, height } });
  };

  const toggleLink = () => {
    setLinked((prev) => !prev);
    if (!linked) {
      const width = form.getFieldValue("scene_image_size")?.width;
      form.setFieldsValue({
        scene_image_size: { width, height: width },
      });
    }
  };

  const ImagePositionSelect = ({ value, onChange }) => (
    <Select
      defaultValue="right"
      style={{ width: 120 }}
      value={value}
      onChange={onChange}
      options={[
        { value: "left", label: "Left" },
        { value: "right", label: "Right" },
      ]}
    />
  );

  const ImageSizeInput = () => {
    const sceneImageSize = form.getFieldValue("scene_image_size") || { width: "", height: "" };

    return (
      <Space direction="vertical" align="center" style={{ width: "100%", marginLeft: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          W:
          <Input
            type="number"
            placeholder="Width"
            value={sceneImageSize.width}
            onChange={handleWidthChange}
            style={{ width: "85px" }}
          />
          <Button
            type="text"
            icon={linked ? <LinkOutlined /> : <DisconnectOutlined />}
            onClick={toggleLink}
          />
          H:
          <Input
            type="number"
            placeholder="Height"
            value={sceneImageSize.height}
            onChange={handleHeightChange}
            style={{ width: "85px" }}
          />
        </div>
      </Space>
    );
  };

  const meta = {
    columns: 4,
    formItemLayout: null,
    colon: true,
    vertical: true,
    fields: [
      { key: "scene_image_position", label: "Image Position", colSpan: 2, widget: ImagePositionSelect },
      { key: "scene_image_size", label: "Image Size", widget: ImageSizeInput, colSpan: 3 },
    ],
  };

  return (
    <div className="p-6 bg-[#E5E4E2] rounded-lg">
      <Form form={form} onFinish={handleSubmit}>
        <FormBuilder form={form} meta={meta} />
      </Form>
    </div>
  );
};

export default ImageEditForm;
