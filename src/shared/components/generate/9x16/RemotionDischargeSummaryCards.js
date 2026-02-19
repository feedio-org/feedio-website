import { InfoCircleOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Col, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { AbsoluteFill, Img } from "remotion";
import { Animated, Fade, Scale } from "remotion-animated";
import LocalAvatar_1 from '../../../../asset/images/avatar/avatar_1.jpg';
import { Rnd } from "react-rnd";

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

const RemotionDischargeSummaryCards = ({ title, selectedAvatar, background, scene_text_color, contentPosition, setContentPosition }) => {
  const [avatarSrc, setAvatarSrc] = useState(LocalAvatar_1);
  const [selectedWidget, setSelectedWidget] = useState(null);

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

  const handleDragStop = (e, data) => {
    const newPosition = {
      x: Math.max(0, data.x),
      y: Math.max(0, data.y)
    };
    setContentPosition(newPosition);
  };

  return (
    <AbsoluteFill
      className="items-center"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Title (Top 10%) */}
      <Animated
        absolute
        animations={[Scale({ by: 1.75, initial: 10 }), Fade({ to: 1, initial: 0 })]}
        style={{
          width: '50%',
          height: "10%",
          position: "absolute",
          top: "5%",
          textAlign: "center",
        }}
      >
        <div style={{ color: scene_text_color.title, fontSize: "2.5rem", fontWeight: "bold" }}>
          {title}
        </div>
      </Animated>

      {/* Middle Section (50%) with two cards stacked */}
      <Animated
        animations={[Fade({ to: 1, initial: 0, start: 0, duration: TITLE_DURATION * 2 })]}
        style={{
          position: "absolute",
          top: "35%", // Positioned after the title
          width: "100%",
          height: "70%", // 50% of the height for the cards
          display: "flex",
          flexDirection: "column", // Stack the cards vertically
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 0",
        }}
      >
        <Rnd
          minWidth={200}
          minHeight={200}
          bounds="parent"
          dragGrid={[1, 1]}
          resizeGrid={[1, 1]}
          style={{
            background: "transparent",
            position: "absolute",
            width: 300,
            height: 300,
            zIndex: 1,
            overflow: "hidden",
            transition: "all 0.1s ease",
          }}
          defaultSize={{ x: contentPosition?.x || 50, y: contentPosition?.y || 850 }}
          onDragStop={(e, data) => handleDragStop(e, data)}
        >
          {/* Card 1: Patient Info */}
          <div
            style={{
              width: "80%", // Each card will take up 80% of the screen width
              maxWidth: "600px",
              ...borderStyle("CARD1"),
              marginBottom: "20px", // Space between the cards
            }}
            onClick={() => handleSelectWidget("CARD1")}
          >
          
            <Card
              title={<Title level={4} style={{ marginBottom: "10px", color: "#1890ff" }}><UserOutlined /> Patient Info</Title>}
              style={{
                width: "100%",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                marginTop: "20px",
              }}
              bordered={false}
            >
              <Row gutter={[16, 5]}>
                {/* Patient Information */}
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
              </Row>
            </Card>
          </div>

          {/* Card 2: Doctor Info */}
          <div
            style={{
              width: "80%", // Each card will take up 80% of the screen width
              maxWidth: "600px",
              ...borderStyle("CARD2"),
            }}
            onClick={() => handleSelectWidget("CARD2")}
          >
            <Card
              title={<Title level={4} style={{ marginBottom: "10px", color: "#1890ff" }}><UserOutlined /> Doctor Info</Title>}
              style={{
                width: "100%",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                marginTop: "20px",
              }}
              bordered={false}
            >
              <Row gutter={[16, 5]}>
                {/* Doctor Information */}
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
        </Rnd>

      </Animated>

      {/* Avatar Section (Bottom 40%) */}
      <AbsoluteFill
        style={{
          position: "absolute",
          top: "35%", // Positioned at the bottom 40% of the screen
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {avatarSrc ? (
          <Img
            src={avatarSrc}
            alt="Avatar"
            style={{ width: "300px", height: "300px", borderRadius: "10px", objectFit: "cover" }}
          />
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default RemotionDischargeSummaryCards;
