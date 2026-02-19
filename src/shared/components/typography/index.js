import React from "react";
import { Typography } from 'antd';
const { Text, Paragraph, Title } = Typography;

function VaText(props) {
  const { text } = props;
  return (
    <Text {...props}>{text}</Text>

  );
}


function VaDescription(props) {
  const { text } = props;
  return (
    <Paragraph {...props}>
      {text}
    </Paragraph>

  );
}

function VaTitle(props) {
  const { text,  level} = props;
  return (
    <Title {...props} level={level}>{text}</Title>
  );
}

export {VaText, VaDescription, VaTitle};