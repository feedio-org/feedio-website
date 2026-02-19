import { CloudOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { Table, Tag } from "antd";
import { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, Img } from "remotion";
import { Animated, Fade, Scale } from "remotion-animated";
import LocalAvatar_1 from '../../../../asset/images/avatar/avatar_1.jpg';
import { data } from "../constant";
import { Rnd } from "react-rnd";

const TITLE_DURATION = 60;

const RemotionDischargeSummaryTable = ({ title, selectedAvatar, content, background, animationStyle, imageId, imageType, scene_text_color, contentPosition, setContentPosition }) => {

  console.log("contentPosition", contentPosition);
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

  const handleDragStop = (e, data) => {
    const newPosition = {
      x: Math.max(0, data.x),
      y: Math.max(0, data.y)
    };
    setContentPosition(newPosition);
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    const newPosition = {
      x: position.x,
      y: position.y,
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
        position: "relative",
      }}
    >
   
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
        <div style={{ color: scene_text_color.title, fontSize: "2.5rem", fontWeight: "bold" }}>
          {title}
        </div>
      </Animated>

      <Animated
        animations={[Fade({ to: 1, initial: 0, start: 0, duration: TITLE_DURATION * 2 })]}
        style={{
          position: "absolute",
          top: "25%",
          height: "50%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          paddingTop: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            ...borderStyle("TABLE"),
          }}
          onClick={() => handleSelectWidget("TABLE")}
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
            onResizeStop={(e, direction, ref, delta, position) =>
              handleResizeStop(e, direction, ref, delta, position)
            }
          >
            <Table columns={columns} dataSource={data} pagination={false} size={data.length > 5 ? "small" : "middle"} />
          </Rnd>
        </div>
      </Animated>

      
      <AbsoluteFill
        style={{
          position: "absolute",
          top: "25%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {avatarSrc ? (
          <Img src={avatarSrc} alt="Avatar" style={{ width: "300px", height: "300px", borderRadius: "10px", objectFit: "cover" }}/>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default RemotionDischargeSummaryTable;
