import { Input, Select } from 'antd';
import { useState } from 'react';
import styles from './generate.module.scss';
const { TextArea } = Input;

// Sample audio files for each option
const audioFiles = {
  A0: ' ',
  A1: 'https://cdn.openai.com/API/docs/audio/alloy.wav',
  A2: 'https://cdn.openai.com/API/docs/audio/echo.wav',
  A3: 'https://cdn.openai.com/API/docs/audio/fable.wav',
  A4: 'https://cdn.openai.com/API/docs/audio/onyx.wav',
  A5: 'https://cdn.openai.com/API/docs/audio/nova.wav',
  A6: 'https://cdn.openai.com/API/docs/audio/shimmer.wav',
};

export default function Audio({
  onAudioSelect,
  selectedAudio,
  selectedText,
  onTextChange
}) {
  const [audioSrc, setAudioSrc] = useState(audioFiles['A0']); // To store the selected audio source
  const [audioKey, setaudioKey] = useState(0); // To force re-render of audio element

  const handleChange = (value) => {
    onAudioSelect(value); // Update state or perform other actions
    setAudioSrc(audioFiles[value]); // Set the corresponding audio file
    setaudioKey(prevKey => prevKey + 1); // Increment key to force re-render of audio element
  };
  return (
    <div className={styles.audioWrapper}>
      <div className={styles.audioSelect}>
        <label>Select Audio</label>
        <Select
          // defaultValue={selectedAudio}
          value={selectedAudio}
          style={{
            width: '80%'
          }}
          options={[
            {
              value: 'A0',
              label: 'None'
            },
            {
              value: 'A1',
              label: 'Male 1'
            },
            {
              value: 'A2',
              label: 'Male 2'
            },
            {
              value: 'A3',
              label: 'Male 3'
            },
            {
              value: 'A4',
              label: 'Male 4'
            },
            {
              value: 'A5',
              label: 'Female 1'
            },
            {
              value: 'A6',
              label: 'Female 2'
            }
          ]}
          onChange={handleChange}
        />
      </div>

	  {/* Audio preview section */}
      {audioSrc && (
        <div className={styles.audioPreview}>
          <audio key={audioKey} controls>
            <source src={audioSrc} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}
