import { CloudOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Table, Tag } from "antd";
import { useEffect, useMemo, useState } from "react";
import { Rnd } from "react-rnd";
import { AbsoluteFill, Img } from "remotion";
import { Animated, Fade, Scale } from "remotion-animated";
import { data } from "../constant";

import LocalAvatar_1 from '../../../../asset/images/avatar/avatar_1.jpg';

const TITLE_DURATION = 60;


const RemotionDischargeSummaryTable = ({
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


  const widget = widgetPositions[0] || {};

  const [avatarSrc, setAvatarSrc] = useState(LocalAvatar_1);

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
            left: widget?.position?.x || 50, // Default x position if undefined
            top: widget?.position?.y || 850, // Default y position if undefined
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
            <div style={{ ...borderStyle("TABLE") }} onClick={() => handleSelectWidget("TABLE")}>
              <Table columns={columns} dataSource={data} pagination={false} size={data.length > 5 ? "small" : "middle"} />
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

export default RemotionDischargeSummaryTable;
