import React from 'react';
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';
import {
  Animated,
  Animation,
  Fade,
  Move,
  Scale,
  Size
} from 'remotion-animated';
import useAnimations from '../useAnimations';

const TITLE_DURATION = 60;
const STATE_DURATION = 60;

const TextComponent = ({ textContent }) => {
  return <pre>{textContent}</pre>;
};

const RemotionTitleSlide = ({ title, content, background, animationStyle, scene_text_color }) => {

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const animations = useAnimations();
  const animation = animations[animationStyle];

  // const animations = {
  //   fadeIn: {
  //     opacity: spring({ frame, fps, from: 0, to: 1, durationInFrames: 30 })
  //   },
  //   slideUp: {
  //     transform: `translateY(${spring({
  //       frame,
  //       fps,
  //       from: 100,
  //       to: 0,
  //       durationInFrames: 30
  //     })}%)`
  //   }
  //   // Add more animations as needed
  // };

  return (
    <AbsoluteFill
      className="items-center justify-center"
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100%'
      }}
    >
      <Animated
        absolute
        animations={[
          Scale({ by: 1.75, initial: 10 }),
          Fade({ to: 1, initial: 0 })
        ]}
        // style={{
        //   // top: '10%'
        //   ...animation
        // }}
      >
        <div style={{ color: scene_text_color.title }} className="text-5xl font-bold grid justify-center">
          {title}
          {/* <MarkdownRenderer content={title} /> */}
        </div>
        {/* <div className="text-gray-200 text-5xl font-bold leading-relaxed justify-center">
          {title}
        </div> */}
      </Animated>
    </AbsoluteFill>
  );
};

export default RemotionTitleSlide;