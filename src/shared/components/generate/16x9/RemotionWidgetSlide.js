import { CloudOutlined, InfoCircleOutlined, MoonOutlined, SunOutlined, UserOutlined } from "@ant-design/icons";
import { Card, Col, Row, Table, Tag, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, Img } from "remotion";
import { Animated, Fade, Scale } from "remotion-animated";
import { data } from "../constant";
import { Rnd } from "react-rnd";

const TITLE_DURATION = 60;
const { Title, Text } = Typography;

// const TextComponent = ({ textContent }) => <p>{textContent}</p>;

const RemotionWidgetSlide = ({
  title,
  content,
  background,
  scene_text_color,
  widgetsData,
  imageId,
  imagePosition,
  selectedAvatar,
  imageType,
  setWidgetsData,
}) => {
  const [selectedWidget, setSelectedWidget] = useState(null);

  const [widgetPositions, setWidgetPositions] = useState([]);

  useEffect(() => {
    if (widgetsData && widgetsData.length > 0) {
      setWidgetPositions(widgetsData);
    }
  }, [widgetsData]);

  const handleDragStop = (e, data, widgetName) => {
    setWidgetPositions((prevState) =>
      prevState.map((widget) =>
        widget.name === widgetName
          ? { ...widget, position: { x: data.x, y: data.y } }
          : widget
      )
    );
  };

  const handleResizeStop = (e, direction, ref, delta, position, widgetName) => {
    setWidgetPositions((prevState) =>
      prevState.map((widget) =>
        widget.name === widgetName
          ? {
            ...widget,
            size: {
              width: ref.offsetWidth,
              height: ref.offsetHeight,
            },
            position: {
              x: position.x,
              y: position.y,
            },
          } // Update size and position
          : widget
      )
    );
  };

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).map((key) => {
      const column = {
        title: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize column title
        dataIndex: key,
        key,
      };

      if (key === "time") {
        column.render = (_, { time }) => (
          <>
            {time?.map((t) => {
              let color = "";
              let icon = null;
              if (t === "morning") {
                color = "volcano";
                icon = <SunOutlined style={{ color: "volcano" }} />;
              } else if (t === "evening") {
                color = "green";
                icon = <CloudOutlined style={{ color: "green" }} />;
              } else if (t === "night") {
                color = "geekblue";
                icon = <MoonOutlined style={{ color: "geekblue" }} />;
              }

              return (
                <Tag color={color} key={t} style={{ margin: "0 5px" }} bordered={false}>
                  {icon}
                  <span style={{ marginLeft: 5 }}>{t.toUpperCase()}</span>
                </Tag>
              );
            })}
          </>
        );
      } else if (Array.isArray(data[0][key])) {
        column.render = (_, { [key]: values }) => (
          <>
            {values.map((value, index) => (
              <Tag key={index}>{value}</Tag>
            ))}
          </>
        );
      }

      return column;
    });
  }, [data]);

  const handleSelectWidget = (widgetName) => {

  


    setSelectedWidget(widgetName);
    // setWidgetsData((prevList) => [
    //   ...prevList,
    //   { widget: widgetName, position: widgetPositions.find((w) => w.name === widgetName), index: prevList.length,  },
    // ]);
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

  const renderWidget = (widget) => {
    const widgetName = widget?.name;
    switch (widgetName) {
    case "CARD":
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginRight: "20px",
            ...borderStyle("CARD"),
          }}
          onClick={() => handleSelectWidget("CARD")}
        >
          <Card
            title={
              <div style={{ textAlign: "center" }}>
                <Title level={4} style={{ marginBottom: "10px", color: "#1890ff" }}>
                  <UserOutlined style={{ marginRight: "10px" }} />
                    Summary
                </Title>
              </div>
            }
            style={{
              width: 550,
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
              marginTop: "20px",
            }}
            bordered={false}
          >
            <Row gutter={[16, 16]}>
              {Object?.entries(widget?.content).map(([key, value]) => (
                <Col span={12} key={key} style={{ paddingLeft: "2rem", paddingBottom: "1rem" }}>
                  <div style={{ marginBottom: "8px", display: "flex", alignItems: "center" }}>
                    <InfoCircleOutlined
                      style={{ marginRight: "8px", color: "#1890ff", fontSize: "14px" }}
                    />
                    <Text strong style={{ fontSize: "14px", color: "#595959" }}>
                      {key}
                    </Text>
                  </div>
                  <div style={{ paddingLeft: "26px" }}>
                    <Text style={{ fontSize: "14px", color: "#000" }}>{value}</Text>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      );
    case "TABLE":
      return (
        <div style={{ ...borderStyle("TABLE") }} onClick={() => handleSelectWidget("TABLE")}>
          <Table columns={columns} dataSource={data} pagination={false} size={data.length > 5 ? "small" : "middle"} />
        </div>
      );
    case "IMAGE":
      return (
        <>
          {imageId && (
            <Img
              style={{ ...borderStyle("IMAGE") }}
              onClick={() => handleSelectWidget("IMAGE")}
              src={`https://va-sc-images.s3.amazonaws.com/${imageId}`}
            />
          )}
        </>
      );
    default:
      return null;
    }
  };
  const widget = widgetPositions[0] || {};

  const [avatarSrc, setAvatarSrc] = useState(null);

  useEffect(() => {
    if (selectedAvatar) {
      try {
        // Dynamically import the image
        const avatar = require(`../../../../asset/images/avatar/${selectedAvatar}.jpg`);
        setAvatarSrc(avatar);
      } catch (e) {
        setAvatarSrc(null);
      }
    }
  }, [selectedAvatar]);

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
        style={{ top: "10%" }}
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
            left: widget?.position?.x || 50, // Default x position if undefined
            top: widget?.position?.y || 450, // Default y position if undefined
            width: widget?.size?.width || 100, // Default width if undefined
            height: widget?.size?.height || 100, // Default height if undefined
            zIndex: 1,
            overflow: "hidden",
            transition: "all 0.1s ease",
            // Add additional styles, for example: borderStyle('IMAGE') if needed
          }}
          onDragStop={(e, data) => handleDragStop(e, data, "widget1")}
          onResizeStop={(e, direction, ref, delta, position) =>
            handleResizeStop(e, direction, ref, delta, position, "widget1")
          }
        >
          <Animated animations={[Fade({ to: 1, initial: 0, start: 0, duration: TITLE_DURATION * 2 })]}>
            {renderWidget(widgetsData[0])}
          </Animated>
        </Rnd>
      </AbsoluteFill>

      <AbsoluteFill className="justify-center" style={contentStyle}>
        {/* <code style={{ color: scene_text_color.content }} className="text-4xl pl-14 gap-10 grid justify-center">
          {Array.isArray(content) && content.length > 0
            ? content.map((textContent, index) => (
              <TextComponent key={index} textContent={textContent} />
            ))
            : null}
        </code> */}

        {/* Your content rendering */}
        {selectedAvatar && avatarSrc ? (
          <Img src={avatarSrc} alt="Avatar" style={{ width: "500px", height: "500px", borderRadius: "10px" }} />
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default RemotionWidgetSlide;
