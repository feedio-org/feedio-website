import {
  AbsoluteFill,
  Img
} from "remotion";
import {
  Animated,
  Fade,
  Scale
} from "remotion-animated";


const TITLE_DURATION = 60;

const TextComponent = ({ textContent }) => {
  return <p>{textContent}</p>;
};

const RemotionTextImageSlide = ({
  title,
  content,
  background,
  animationStyle,
  imageId,
  imageType,
  scene_text_color
}) => {
 

  return (
    <AbsoluteFill
      className="items-center justify-center"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100%"
      }}
    >
      <Animated
        absolute
        animations={[
          Scale({ by: 1.75, initial: 10 }),
          Fade({ to: 1, initial: 0 })
        ]}
        style={{
          top: "5%",
          width: "50%",
          height: "10%"
        }}
      >
        <div style={{ color: scene_text_color.title }} className="text-5xl font-bold leading-relaxed">
          {title}
        </div>
      </Animated>

      <AbsoluteFill
        className="justify-center"
        style={{ height: "50%", top: "15%" }}
      >
        <code style={{ color: scene_text_color.content }} className="text-4xl pl-14 gap-10 grid justify-center">
          {Array.isArray(content) && content.length > 0
            ? content.map((textContent, index) => (
              <TextComponent key={index} textContent={textContent} />
            ))
            : null}
        </code>
      </AbsoluteFill>

      <AbsoluteFill
        className="items-center justify-center"
        style={{
          width: "100%",
          height: "50%",
          top: "50%"
        }}
      >
        <Animated
          animations={[
            Fade({ to: 1, initial: 0, start: 0, duration: TITLE_DURATION * 2 })
          ]}
        >
          {/* Render default image if MP4; otherwise, render the uploaded image */}
          {imageType === "MP4" ? (
            <Img src={require("../../../../asset/images/course1.png")} />
          ) : (
            imageId && <Img src={`https://va-sc-images.s3.amazonaws.com/${imageId}`} />
          )}
        </Animated>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default RemotionTextImageSlide;