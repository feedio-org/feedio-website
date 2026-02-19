import React, { useState } from 'react';
import { Select, Input, Radio } from 'antd';
import { FontColorsOutlined } from '@ant-design/icons';
import styles from './generate.module.scss';

const { Option } = Select;

export default function EditText({scene_text_color, onscene_text_colorChange}) {
  
  const [selectedOption, setSelectedOption] = useState('title');
  const [selectedFontColorTitle, setSelectedFontColorTitle] = useState(scene_text_color.title);
  const [selectedFontColorContent, setSelectedFontColorContent] = useState(scene_text_color.content);

  const handleFontColorChange = (e) => {
    
    if (selectedOption === 'title') {
      setSelectedFontColorTitle(e.target.value);
    } else {
      setSelectedFontColorContent(e.target.value);
    }
    
    // setSelectedFontColor(selectedOption === 'title' ? scene_text_color.title : scene_text_color.content)
    onscene_text_colorChange(e.target.value, selectedOption);
  };
  const handleOptionChange = (e) => {
    
    setSelectedOption(e.target.value);
    
    // setSelectedFontColor(e.target.value === 'title' ? scene_text_color.title : scene_text_color.content)
  };   

  return (
    <div className={styles.backgroundWrappers}>
      <div className={styles.editTextContainer} style={{ marginLeft: '10px' }}>
        <div className={styles.option}>
          <Radio.Group onChange={handleOptionChange} value={selectedOption}>
            <Radio value="title">Title</Radio>
            <Radio value="content">Content</Radio>
          </Radio.Group>

          <label style={{ marginLeft: '10px' }}>Font Color: </label>

            <Input
              type="color"
              value={selectedOption === 'title' ? selectedFontColorTitle : selectedFontColorContent} 
              onChange={handleFontColorChange}
              style={{ width: '100px', marginLeft: '5px' }}
              prefix={<FontColorsOutlined />}
            />
          
        </div>
      </div>
    </div>
  );
}
