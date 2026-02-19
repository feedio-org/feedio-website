import { AbsoluteFill, Img } from "remotion";
import { Animated, Fade, Scale } from "remotion-animated";
const TITLE_DURATION = 60;

const TextComponent = ({ textContent }) => {
  return <p>{textContent}</p>;
};

const RemotionTextImageSlide = ({title, content, background, animationStyle, imageId, imageType, imagePosition, imageSize, scene_text_color }) => {
  
  const isImageOnLeft = imagePosition === "left";
  const contentStyle = {
    width: "50%",
    top: "5%",
    position: "absolute",
    left: isImageOnLeft ? "50%" : "5%",
    padding: "2rem",
  };

  const imageContainerStyle = {
    width: "calc(50% - 4rem)",
    height: "calc(100% - 4rem)",
    top: "5%",
    left: isImageOnLeft ? "5%" : "75%",
    margin: "2rem",
    overflow: "hidden",
    position: "absolute",
    transform: isImageOnLeft ? "translateX(0)" : "translateX(-50%)",
  };

  return (
    <AbsoluteFill className="items-center justify-center"
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

      {/* Content Area */}
      <AbsoluteFill className="justify-center" style={contentStyle}>
        <code style={{ color: scene_text_color.content }} className="text-4xl pl-14 gap-10 grid justify-center">
          {Array.isArray(content) && content.length > 0
            ? content.map((textContent, index) => (
              <TextComponent key={index} textContent={textContent} />
            ))
            : null}
        </code>
      </AbsoluteFill>

      {/* Image Area */}
      <AbsoluteFill className="items-center justify-center" style={imageContainerStyle}>
        <Animated animations={[Fade({ to: 1, initial: 0, start: 0, duration: TITLE_DURATION * 2 })]}>
          {/* Render default image if MP4; otherwise, render the uploaded image */}
          {imageType === "MP4" ? (
            <Img src={require("../../../../asset/images/course1.png")} />
          ) : (
            imageId && <Img src={`https://va-sc-images.s3.amazonaws.com/${imageId}`} width={imageSize?.width} height={imageSize?.height}/>
          )}
        </Animated>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default RemotionTextImageSlide;
