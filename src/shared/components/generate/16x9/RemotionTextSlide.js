import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig
} from 'remotion';
import {
  Animated,
  Fade,
  Scale
} from 'remotion-animated';

const TITLE_DURATION = 60;
const STATE_DURATION = 60;

const TextComponent = ({ textContent }) => {
  return <pre>{textContent}</pre>;
};

const RemotionTextSlide = ({ title, content, background, animationStyle, scene_text_color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
          top: '10%'
        }}
      >
        <div style={{ color: scene_text_color.title }} className="text-5xl font-bold leading-relaxed">
          {title}
        </div>
      </Animated>

      <AbsoluteFill className="justify-center" style={{ top: '5%' }}>
      <code style={{ color: scene_text_color.content }} className="text-4xl pl-14 gap-10 grid justify-center">
          {Array.isArray(content) && content.length > 0
            ? content.map((textContent, index) => {
              // Function to split textContent by spaces while maintaining lines of approx. 43 characters
              const splitTextByWords = (text, maxLineLength) => {
                const words = text.split(' ');
                const lines = [];
                let currentLine = '';

                words.forEach((word) => {
                  // Check if adding the next word exceeds the line length limit
                  if ((currentLine + word).length <= maxLineLength) {
                    currentLine += (currentLine ? ' ' : '') + word;
                  } else {
                    lines.push(currentLine);
                    currentLine = word; // Start a new line with the current word
                  }
                });

                // Push the last line if it exists
                if (currentLine) {
                  lines.push(currentLine);
                }

                return lines;
              };

              // Call the function with a max line length of 43
              const splitText = splitTextByWords(textContent, 90);

              return (
                <div key={index}>
            {splitText.map((line, lineIndex) => (
              <div
                key={lineIndex}
                style={{ marginBottom: '10px' }} // Apply inline style for gap
              >
                <TextComponent textContent={line} />
              </div>
            ))}
          </div>

              );
            })
            : null}
        </code>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default RemotionTextSlide;