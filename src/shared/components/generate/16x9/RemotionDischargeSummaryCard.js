import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Col, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { AbsoluteFill, Img } from "remotion";
import { Animated, Fade, Scale } from "remotion-animated";
import LocalAvatar_1 from '../../../../asset/images/avatar/avatar_1.jpg';

const { Title, Text } = Typography;

const TITLE_DURATION = 60;

const DummyData1 = {
  "patient": {
    "name": "John Doe",
    "age": 45,
    "gender": "Male",
    "patientId": "P123456",
    "admissionDate": "2024-12-20",
    "dischargeDate": "2025-01-04"
  },
  "doctor": {
    "name": "Dr. Jane Smith",
    "specialty": "Cardiology",
    "contact": "555-123-4567"
  }
};



const RemotionDischargeSummaryCards = ({
  title,
  background,
  scene_text_color,
  widgetsData,
  imageId,
  imagePosition,
  selectedAvatar,
}) => {
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [, setWidgetPositions] = useState([]);
  const [avatarSrc, setAvatarSrc] = useState(LocalAvatar_1);

  useEffect(() => {
    if (widgetsData && widgetsData.length > 0) {
      setWidgetPositions(widgetsData);
    }
  }, [widgetsData]);

  useEffect(() => {
    if (selectedAvatar) {
      try {
        const avatar = require(`../../../../asset/images/avatar/${selectedAvatar}.jpg`);
        setAvatarSrc(avatar);
      } catch (e) {
        setAvatarSrc(null);
      }
    }
  }, [selectedAvatar]);

  const handleSelectWidget = (widgetName) => {
    setSelectedWidget(widgetName);
    setTimeout(() => {
      setSelectedWidget(null);
    }, 2000);
  };

  const borderStyle = (widgetName) => {
    return selectedWidget === widgetName
      ? { border: "2px solid #1890ff", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }
      : {};
  };

  const isImageOnLeft = imagePosition === "left";
  const contentStyle = {
    width: "30%",
    top: "5%",
    position: "absolute",
    left: isImageOnLeft ? "50%" : "5%",
  };

  const imageContainerStyle = {
    width: "calc(70% - 4rem)",
    height: "calc(100% - 4rem)",
    top: "5%",
    left: isImageOnLeft ? "5%" : "75%",
    margin: "2rem",
    overflow: "hidden",
    position: "absolute",
    transform: isImageOnLeft ? "translateX(0)" : "translateX(-50%)",
  };

  return (
    <AbsoluteFill
      className="items-center justify-center"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100%",
      }}
    >
      <Animated
        absolute
        animations={[Scale({ by: 1.75, initial: 10 }), Fade({ to: 1, initial: 0 })]}
        style={{ top: "3%" }}
      >
        <div style={{ color: scene_text_color.title }} className="text-5xl font-bold leading-relaxed">
          {title}
        </div>
      </Animated>

      <AbsoluteFill className="justify-center" style={imageContainerStyle}>
        <Rnd
          minWidth={200}
          minHeight={200}
          bounds="parent"
          dragGrid={[10, 10]}
          resizeGrid={[10, 10]}
          style={{
            background: "transparent",
            position: "absolute",
            left: 70, // Default x position
            top: 750, // Default y position
            width: 100, // Default width
            height: 100, // Default height
            zIndex: 1,
            overflow: "hidden",
            transition: "all 0.1s ease",
          }}
        >
          {/* First Card: Patient and Doctor Details */}
          <Animated animations={[Fade({ to: 1, initial: 0, start: 0, duration: TITLE_DURATION * 2 })]}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginRight: "20px",
                ...borderStyle("CARD1"),
              }}
              onClick={() => handleSelectWidget("CARD1")}
            >
              <Card
                title={<Title level={4} style={{ marginBottom: "10px", color: "#1890ff" }}><UserOutlined /> Patient Info</Title>}
                style={{
                  width: 550,
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
                  marginTop: "20px",
                }}
                bordered={false}
              >
                <Row gutter={[16, 5]}>
                  {Object.entries(DummyData1.patient).map(([key, value]) => (
                    <Col span={12} key={key} style={{ paddingLeft: "2rem", paddingBottom: ".1rem" }}>
                      <div style={{ marginBottom: "8px", display: "flex", alignItems: "center" }}>
                        <InfoCircleOutlined style={{ marginRight: "8px", color: "#1890ff", fontSize: "14px" }} />
                        <Text strong style={{ fontSize: "14px", color: "#595959" }}>{key}</Text>
                      </div>
                      <div style={{ paddingLeft: "26px" }}>
                        <Text style={{ fontSize: "14px", color: "#000" }}>{value}</Text>
                      </div>
                    </Col>
                  ))}
                  {Object.entries(DummyData1.doctor).map(([key, value]) => (
                    <Col span={12} key={key} style={{ paddingLeft: "2rem", paddingBottom: ".1rem" }}>
                      <div style={{ marginBottom: "8px", display: "flex", alignItems: "center" }}>
                        <InfoCircleOutlined style={{ marginRight: "8px", color: "#1890ff", fontSize: "14px" }} />
                        <Text strong style={{ fontSize: "14px", color: "#595959" }}>{key}</Text>
                      </div>
                      <div style={{ paddingLeft: "26px" }}>
                        <Text style={{ fontSize: "14px", color: "#000" }}>{value}</Text>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            </div>
          </Animated>

        
        </Rnd>
      </AbsoluteFill>

      <AbsoluteFill className="justify-center" style={contentStyle}>
        {avatarSrc ? (
          <Img src={avatarSrc} alt="Avatar" style={{ width: "500px", height: "500px", borderRadius: "10px" }} />
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default RemotionDischargeSummaryCards;
