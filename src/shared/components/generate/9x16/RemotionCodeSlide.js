import { AbsoluteFill } from "remotion";
import { Animated, Fade } from 'remotion-animated';
import MarkdownRenderer from '../previewMarkdownRenderer';

const RemotionCodeSlide = ({ title, content, background, animationStyle }) => {
  const captions = content;

  return (
    <AbsoluteFill className="items-center justify-center" style={{
      backgroundImage: `url(${background})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100%',
      color: 'white'
    }}>

      <Animated animations={[
          Fade({ to: 1, initial: 0, start: 0, duration: 60 })
        ]}>
        <MarkdownRenderer content={captions} />
      </Animated>

    </AbsoluteFill>
  );
};

export default RemotionCodeSlide;
