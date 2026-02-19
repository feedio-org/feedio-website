import { Col, Row, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';
const {  Text } = Typography;

const BackgroundAnimation = ({ handleBackgroundAnimation, backgroundAnimation }) => {
  const [selectedAnimation, setSelectedAnimation] = useState('None');

  useEffect(() => {
    setSelectedAnimation(backgroundAnimation);
  }, [backgroundAnimation]);
  
  const handleSelectionChange = (value) => {
    handleBackgroundAnimation(value);
    setSelectedAnimation(value);
  };

  return (
    <div className='bg-white p-3 h-[24rem] select-none'>

      <Row justify="center" gutter={16}>
        <Col span={8}>
          <Select
            defaultValue="None"
            style={{ width: '100%' }}
            onChange={handleSelectionChange}
          >
            <Select.Option value="None">None</Select.Option>
            <Select.Option value="zoom-in">Zoom In</Select.Option>
            <Select.Option value="zoom-out" disabled>Zoom Out</Select.Option>
          </Select>
        </Col>

     

      </Row>

      <Row justify="" className='mt-4 p-3'>
        <Col span={5}>
          {selectedAnimation === 'None' ? (
            <Text></Text>
          ) : (
            <Text strong>Preview : </Text>
          )}
        </Col>
        <Col span={14}>
          {selectedAnimation === 'None' ? (
            <Text disabled>Select an animation to see the preview</Text>
          ) : (
            <img src={"https://images.unsplash.com/photo-1736297150541-89378f055b96?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} alt={selectedAnimation} className='rounded-lg'/>
          )}
        </Col>
      </Row>
    
    </div>
  );
};

export default BackgroundAnimation;
