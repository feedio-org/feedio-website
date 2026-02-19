import React from 'react';
import styles from './generate.module.scss';
import { Select, Input } from 'antd';
import { VaTitle } from '../typography';
import { SoundOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
const { TextArea } = Input;

const helpContent = (
  <div>
    <p>
      Feel free to <strong>customize</strong> your audio narration
    </p>
    <p>text based on your needs.</p>
  </div>
);

export default function AudioText({ selectedText, onTextChange }) {

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.contentActions}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <SoundOutlined style={{ marginRight: '8px' }} />
          <VaTitle level={5} text="Audio Text" />
          <Popover content={helpContent} title="Help">
            <QuestionCircleOutlined
              style={{
                marginLeft: '295px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            />
          </Popover>
        </div>
        <div className={styles.audioText} style={{width:'420px'}}>
          <TextArea
            rows={14}
            placeholder="maxLength is 6"
            value={selectedText}
            name="selectedText"
            onChange={(event) => onTextChange(event)}
          />
        </div>
      </div>
    </div>
  );
}
