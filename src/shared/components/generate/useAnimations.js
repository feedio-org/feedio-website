import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

const useAnimations = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return {
    fadeIn: {
      opacity: spring({ frame, fps, from: 0, to: 1, durationInFrames: 30 })
    },
    zoomIn: {
      transform: `scale(${spring({
        frame,
        fps,
        from: 0,
        to: 1,
        durationInFrames: 30
      })})`,
      opacity: spring({ frame, fps, from: 0, to: 1, durationInFrames: 30 })
    },
    slideDown: {
      transform: `translateY(${spring({
        frame,
        fps,
        from: -100,
        to: 0,
        durationInFrames: 30
      })}%)`,
      opacity: spring({ frame, fps, from: 0, to: 1, durationInFrames: 30 })
    },
    rollIn: {
      transform: `translateX(${spring({
        frame,
        fps,
        from: -100,
        to: 0,
        durationInFrames: 30
      })}) rotate(${spring({
        frame,
        fps,
        from: -120,
        to: 0,
        durationInFrames: 30
      })}deg)`,
      opacity: spring({ frame, fps, from: 0, to: 1, durationInFrames: 30 })
    },
    bounceIn: {
      transform: `scale(${spring({
        frame,
        fps,
        from: 0.3,
        to: 1,
        durationInFrames: 30
      })})`,
      opacity: spring({ frame, fps, from: 0, to: 1, durationInFrames: 30 })
    },
    rotateIn: {
      transform: `rotate(${spring({
        frame,
        fps,
        from: 180,
        to: 0,
        durationInFrames: 30
      })}deg)`,
      opacity: spring({ frame, fps, from: 0, to: 1, durationInFrames: 30 })
    },
    lightSpeedIn: {
      transform: `translateX(${spring({
        frame,
        fps,
        from: 100,
        to: 0,
        durationInFrames: 30
      })}) skewX(${spring({
        frame,
        fps,
        from: -30,
        to: 0,
        durationInFrames: 30
      })}deg)`,
      opacity: spring({ frame, fps, from: 0, to: 1, durationInFrames: 30 })
    },
    flipInX: {
      transform: `perspective(400px) rotateX(${spring({
        frame,
        fps,
        from: 90,
        to: 0,
        durationInFrames: 30
      })}deg)`,
      opacity: spring({ frame, fps, from: 0, to: 1, durationInFrames: 30 })
    }
    // Add more animations as needed
  };
};

export default useAnimations;
