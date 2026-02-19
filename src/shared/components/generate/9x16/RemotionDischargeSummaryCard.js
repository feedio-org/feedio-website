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

const RemotionDischargeSummaryCard = ({ title, selectedAvatar, content, background, animationStyle, imageId, imageType, scene_text_color, contentPosition, setContentPosition }) => {
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
      className="items-center justify-center"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Title */}
      <Animated
        absolute
        animations={[Scale({ by: 1.75, initial: 10 }), Fade({ to: 1, initial: 0 })]}
        style={{
          width: '50%',
          height: "10%",
          position: "absolute",
          top: "10%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: scene_text_color.title,
            fontSize: "3rem", // Equivalent to `text-5xl` in Tailwind
            fontWeight: "bold",
            wordWrap: "break-word", // This is the key for line breaking
            whiteSpace: "normal", // Ensures long words will break and the text will wrap normally
            width: "100%", // Ensures it takes full width
          }}
          className="w-full" // Ensure the container has full width
        >
          {title}
        </div>

      </Animated>


      {/* Card (Middle 50%) */}
      <Animated
        animations={[Fade({ to: 1, initial: 0, start: 0, duration: TITLE_DURATION * 2 })]}
        style={{
          position: "absolute",
          top: "25%", // Start 25% down from the top (after the title)
          height: "50%", // Occupy 50% of the height
          width: "100%",
          display: "flex",
          justifyContent: "center",
          paddingTop: "20px"
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
          <div
            style={{
              width: "80%",
              maxWidth: "550px",
              ...borderStyle("CARD1"),
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

      {/* Avatar (Bottom 40%) */}
      <AbsoluteFill
        style={{
          position: "absolute",
          top: "25%", // Position it at the bottom 40% of the screen
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

export default RemotionDischargeSummaryCard;
