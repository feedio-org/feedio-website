import React from 'react';
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img
} from 'remotion';
import {
  Animated,
  Animation,
  Fade,
  Move,
  Scale,
  Size
} from 'remotion-animated';


const TITLE_DURATION = 60;

const RemotionImageSlide = ({
  title,
  content,
  background,
  animationStyle,
  imageId,
  imageType,
  scene_text_color
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  var imageFile = '';

  if (imageType === 'MP4') {
    // Use the default image for MP4
    imageFile = require('../../../../asset/images/course1.png');
  } else if (imageId !== '' && imageId !== null) {
    imageFile = `https://va-sc-images.s3.amazonaws.com/${imageId}`;
  }

  const animations = {
    fadeIn: {
      opacity: spring({ frame, fps, from: 0, to: 1, durationInFrames: 30 })
    },
    slideUp: {
      transform: `translateY(${spring({
        frame,
        fps,
        from: 100,
        to: 0,
        durationInFrames: 30
      })}%)`
    }
    // Add more animations as needed
  };

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
        style={{
          top: '7%',
          width: '50%',
          height: '10%'
        }}
      >
        <div style={{ color: scene_text_color.title }} className="text-5xl font-bold leading-relaxed">
          {title}
        </div>
      </Animated>

      <AbsoluteFill
        className="items-center justify-center"
        style={{
          width: '100%',
          height: '100%',
          top: '10%',
          margin: '2rem',
          overflow: 'hidden'
        }}
      >
        <Animated
          animations={[
            Fade({ to: 1, initial: 0, start: 0, duration: TITLE_DURATION * 2 })
          ]}
        >
          {imageId ? <Img src={imageFile} /> : null}
        </Animated>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default RemotionImageSlide;
