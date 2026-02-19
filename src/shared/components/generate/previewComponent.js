import { Thumbnail } from "@remotion/player";
import { sceneTypeToComponent16x9 } from "./16x9/sceneTypeToComponent16x9";
import { sceneTypeToComponent9x16 } from "./9x16/sceneTypeToComponent9x16";

export default function PreviewComponent({
  aspectRatio,
  sceneType,
  selectedTitle,
  selectedContent,
  selectedBackground,
  selectedAnimation,
  imageId,
  imageType,
  imagePosition,
  selectedWidget,
  selectedWidgetsList,
  setSelectedWidgetsList,
  selectedAvatar,
  imageSize,
  scene_text_color,
  contentPosition,
  setContentPosition,
  setImageSize,
  contentSize
}) {
  const calculate9x16PreviewStyle = () => {
    const maxWidth = window.innerWidth < 1024 ? "100%" : "400px";
    const height = (1280 / 720) * parseInt(maxWidth, 10);
    return {
      width: maxWidth,
      height: `${height}px`,
      maxHeight: "calc(100vh - 100px)",
      overflow: "hidden"
    };
  };
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%"
  };


  if (aspectRatio === "16:9") {
    return (
      <Thumbnail
        component={sceneTypeToComponent16x9[sceneType]}
        compositionWidth={1280}
        compositionHeight={720}
        frameToDisplay={1000}
        durationInFrames={1200}
        fps={30}
        style={{
          width: "100%"
        }}
        inputProps={{
          title: selectedTitle,
          content: selectedContent,
          background: selectedBackground,
          animationStyle: selectedAnimation,
          imageId: imageId,
          imageType: imageType,
          imagePosition: imagePosition,
          widgetsData: selectedWidgetsList,
          selectedAvatar: selectedAvatar,
          setWidgetsData: setSelectedWidgetsList,
          imageSize: imageSize,
          scene_text_color: scene_text_color,
          contentSize: contentSize,
          contentPosition: contentPosition,
          setContentPosition: setContentPosition,
          setImageSize: setImageSize
        }}
      />
    );
  } else {
    return (
      <div style={containerStyle}>
        <Thumbnail
          component={sceneTypeToComponent9x16[sceneType]}
          compositionWidth={720}
          compositionHeight={1280}
          frameToDisplay={1000}
          durationInFrames={1200}
          fps={30}
          style={calculate9x16PreviewStyle()} // Apply dynamic style for 9x16 aspect ratio
          inputProps={{
            title: selectedTitle,
            content: selectedContent,
            background: selectedBackground,
            animationStyle: selectedAnimation,
            imageId: imageId,
            imageType: imageType,
            contentPosition: contentPosition,
            setContentPosition: setContentPosition,
            setImageSize: setImageSize,
            scene_text_color: scene_text_color,
            contentSize: contentSize
          }}
        />
      </div>
    );
  }
}
