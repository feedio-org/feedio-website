"use client";
import React, {useState} from "react";
import OtpInput from 'react-otp-input';

import styles from './otp.module.scss';

function VaOTP({numInputs, onChangeOtp}) {
  const [otp, setOtp] = useState('');

  const onSetOtp=(val)=>{
    onChangeOtp(val);
    setOtp(val);
  };
  return (<div className={styles.wrapper}>
    <OtpInput
      value={otp}
      onChange={onSetOtp}
      numInputs={numInputs? numInputs : 6}
      placeholder="****"
      renderSeparator={<span>&nbsp; &nbsp; </span>}
      renderInput={(props) => <input {...props} />}
    />
  </div>);
}

export default VaOTP;