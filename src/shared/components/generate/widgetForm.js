import { Divider, Form, Radio, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { WIDGET_LIST } from "./constant";

const { Title } = Typography;

const WidgetForm = ({ selectedWidget, handleWidget, form, selectedMarkupText }) => {
  
  const [selectedValue, setSelectedValue] = useState(null);


  useEffect(() => {
    if (selectedWidget) {
      setSelectedValue(selectedWidget.value);
    }
  }, [selectedWidget]);

  console.log("selectedMarkupText", selectedMarkupText);
  const handleFinish = (values) => {

    let contentJson = {};
    try {
      contentJson = JSON.parse(selectedMarkupText);
    } catch (e) {
      console.error("Invalid JSON content, using default empty object", e);
      contentJson = {};
    }

    if (selectedMarkupText) {
      values["content"] = contentJson;
    }

    values["width"] = "100px";
    values["height"] = "100px";;
    values["position"] = { "x": 50, "y": 450 };
    handleWidget(values);
  };

  return (
    <div>
      <Form
        form={form}
        onFinish={handleFinish}
        layout="vertical"
        name="widgetForm"
        style={{ width: "100%" }}
        initialValues={{ name: selectedValue }}>
        <Form.Item name="name" style={{ width: "100%" }}>
          <Radio.Group
            value={selectedValue}
            style={{ width: "100%" }}
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            {WIDGET_LIST.map((widget) => (
              <Radio
                value={widget.value}
                key={widget.value}
                disabled={widget.disable}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                  padding: "10px",
                  borderRadius: "8px",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={widget.thumbnail}
                    alt={widget.label}
                    style={{
                      width: "50px",
                      height: "50px",
                      marginRight: "10px",
                      borderRadius: "4px",
                    }}
                  />
                  <div>
                    <Title level={5} style={{ margin: 0, fontWeight: "500" }}>
                      {widget.label}
                    </Title>
                    <p style={{ margin: 0, fontSize: "12px", color: "#595959" }}>
                      {widget.discretion}
                    </p>
                  </div>
                </div>
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        <Divider />

        {/* Alignment Radio Group (Disabled for now, as per your original code) */}
        <Form.Item
          wrapperCol={{
            offset: 0,
            span: 24,
          }}
          name="alignment"
          label="Widget Position"
        >
          <Radio.Group defaultValue="center" buttonStyle="solid" disabled>
            <Radio.Button value="left">Left</Radio.Button>
            <Radio.Button value="center">Center</Radio.Button>
            <Radio.Button value="right">Right</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </div>
  );
};

export default WidgetForm;
