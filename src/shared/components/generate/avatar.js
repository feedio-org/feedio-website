import React, { useRef, useState } from "react";
import { Image, Empty } from "antd";
import styles from "./generate.module.scss";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";

const audioFiles = {
  A0: " ",
  A1: "https://cdn.openai.com/API/docs/audio/alloy.wav",
  A2: "https://cdn.openai.com/API/docs/audio/echo.wav",
  A3: "https://cdn.openai.com/API/docs/audio/fable.wav",
  A4: "https://cdn.openai.com/API/docs/audio/onyx.wav",
  A5: "https://cdn.openai.com/API/docs/audio/nova.wav",
  A6: "https://cdn.openai.com/API/docs/audio/shimmer.wav",
};

export default function AnimationsAudio({
  onAvatarSelect,
  selectedAvatar,
  onAudioSelect,
  // selectedAudio,
  selectedText,
  avatarWithAudio,
  onTextChange,
}) {
  const [selectedAudioWithKey, setSelectedAudioWithKey] = useState("A0");
  const [playing, setPlaying] = useState(false);
  const [audioKey, setAudioKey] = useState(0);
  const [hoveredImage, setHoveredImage] = useState(null);
  const audioRef = useRef(null);

  const imageData = [
    {
      id: 0,
      image_name: "none",
      src: "",
      audio: "A0",
    },
    {
      id: 1,
      image_name: "avatar_1",
      audio: "A1",
    },
    {
      id: 2,
      image_name: "avatar_2",
      audio: "A2",
    },
    {
      id: 3,
      image_name: "avatar_3",
      audio: "A3",
    },
    {
      id: 4,
      image_name: "avatar_4",
      audio: "A4",
    },
    {
      id: 5,
      image_name: "avatar_5",
      audio: "A5",
    },
    {
      id: 6,
      image_name: "avatar_6",
      audio: "A6",
    },
    {
      id: 7,
      image_name: "avatar_7",
      audio: "A1",
    },
    {
      id: 8,
      image_name: "avatar_8",
      audio: "A2",
    },
    {
      id: 9,
      image_name: "avatar_9",
      audio: "A3",
    },
    {
      id: 10,
      image_name: "avatar_10",
      audio: "A4",
    },
    {
      id: 11,
      image_name: "avatar_11",
      audio: "A5",
    },
    {
      id: 12,
      image_name: "avatar_12",
      audio: "A6",
    },
    {
      id: 13,
      image_name: "avatar_13",
      audio: "A1",
    },
    {
      id: 14,
      image_name: "avatar_14",
      audio: "A2",
    },
    {
      id: 15,
      image_name: "avatar_15",
      audio: "A3",
    },
  ];

  const handleAudioPlayPause = (audioKey) => {
    if (playing && selectedAudioWithKey === audioKey) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      setSelectedAudioWithKey(audioKey);
      onAudioSelect(audioKey);
      setPlaying(true);
      setAudioKey((prevKey) => prevKey + 1);
    }
  };

  return (
    <div className={styles.backgroundWrapper}>
      {imageData.map((item) => (
        <div
          key={item.id}
          className={`${styles.bgCard} ${
            selectedAvatar === item.image_name ? styles.selectedAvatar : ""
          }`}
          onClick={() => {onAudioSelect(item.audio); onAvatarSelect(item);}}
          onMouseEnter={() => setHoveredImage(item.id)}
          onMouseLeave={() => setHoveredImage(null)}
        >
          {item.image_name === "none" ? (
            <div className={styles.noneOption}>
              <Empty
                style={{ paddingBottom: "30px" }}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Clear Avatar"
              />
            </div>
          ) : (
            <div className={`${styles.avatarCard} rounded`}>
              <Image
                preview={false}
                src={require(`../../../asset/images/avatar/${item.image_name}.jpg`)}
                className={styles.avatarImage}
              />
              {hoveredImage === item.id && (
                <div className={styles.overlay}>
                  <div className={styles.iconWrapper}>
                    {playing && selectedAudioWithKey === item.audio ? (
                      <PauseCircleOutlined
                        className={styles.icon}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAudioPlayPause(item.audio);
                        }}
                      />
                    ) : (
                      <PlayCircleOutlined
                        className={styles.icon}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAudioPlayPause(item.audio);
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Audio playback element */}
      {selectedAudioWithKey && selectedAudioWithKey !== "A0" && (
        <audio
          ref={audioRef}
          key={audioKey}
          autoPlay={playing}
          controls
          style={{ display: "none" }}
        >
          <source src={audioFiles[selectedAudioWithKey]} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}
