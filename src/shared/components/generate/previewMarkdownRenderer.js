import React, { useEffect, useState } from 'react';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  dark,
  okaidia,
  darcula
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  CustomOrderedList,
  CustomUnorderedList,
  CustomParaList,
  CustomCodeList
} from './previewCustomStyledComponent';

const MarkdownRenderer = ({ content }) => {
  const [fontSize, setFontSize] = useState('2rem');

  // Split the markdown content into parts
  const parts = content.split(/(!\[.*\]\(.*\))/);

  // Extract image URLs
  const imageRegex = /!\[.*\]\((.*)\)/;

  const hasImages = parts.some((part) => imageRegex.test(part));
  function countLinesInString(str) {
    return str.split('\n').length;
  }
  useEffect(() => {
    // Calculate the content length
    const contentLength = parts.reduce((acc, part) => acc + part.length, 0);
    let newFontSize;
    // console.log(imageRegex);
    // console.log(parts);
    // console.log(content);
    let lineCount = countLinesInString(content);
    // console.log(lineCount);

    // Adjust the font size based on the content length
    if (hasImages) {
      newFontSize =
        Math.min(1.8, Math.max(1.8, 1500 / contentLength / 1.4)) + 'rem';
      if (lineCount > 9) {
        newFontSize = '1.5rem';
      } else if (lineCount <= 9 && lineCount > 5) {
        newFontSize = '2.25rem';
      } else {
        newFontSize = '3.0rem';
      }
    } else {
      newFontSize = Math.min(1.8, Math.max(1.8, 1500 / contentLength)) + 'rem';
      if (lineCount > 15) {
        newFontSize = '1.5rem';
      } else if (lineCount <= 15 && lineCount > 9) {
        newFontSize = '2.0rem';
      } else if (lineCount <= 9 && lineCount > 5) {
        newFontSize = '2.75rem';
      } else {
        newFontSize = '3.5rem';
      }
    }

    // newFontSize = '1rem';

    setFontSize(newFontSize);
  }, [parts]);

  const components = {
    ol: ({ node, ...props }) => <CustomOrderedList {...props} />,
    ul: ({ node, ...props }) => <CustomUnorderedList {...props} />,
    p: ({ node, ...props }) => <CustomParaList {...props} />,
    code: ({ node, ...props }) => <CustomCodeList {...props} />,
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');

      return !inline && match ? (
        <SyntaxHighlighter
          style={okaidia}
          language={match[1]}
          PreTag="div"
          children={String(children).replace(/\n$/, '')}
          {...props}
        />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <div style={{ fontSize, paddingTop: '30px', paddingBottom: '10px' }}>
      {hasImages ? (
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 1, paddingRight: '10px' }}>
            {parts.map((part, index) => {
              const match = imageRegex.exec(part);
              if (match) return null; // Skip images in the left column
              return (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  key={index}
                  components={components}
                >
                  {part}
                </ReactMarkdown>
              );
            })}
          </div>
          <div style={{ flex: 1, margin: 'auto' }}>
            {parts.map((part, index) => {
              const match = imageRegex.exec(part);
              if (match) {
                return (
                  <img
                    key={index}
                    src={match[1]}
                    alt={`Image ${index}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '350px',
                      marginBottom: '10px'
                    }}
                  />
                );
              }
              return null; // Skip non-images in the right column
            })}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ReactMarkdown children={content} components={components} />
        </div>
      )}
    </div>
  );
};

export default MarkdownRenderer;
