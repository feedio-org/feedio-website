import { Button, Image } from 'antd';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { VaText, VaTitle } from 'shared/components/typography';
import logo from './logo.svg';

import VaOTP from 'shared/components/otp';
import styles from './verify.module.scss';

import { CognitoUser } from 'amazon-cognito-identity-js';
import UserPool from '../../../AWSCognitoUserPool';

function VerifyAccount() {
  const location = useLocation();
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');

  const email = location.state?.email; // Retrieve email from the previous page state

  const handleFinish = (values) => {
    const userPool = UserPool; //new CognitoUser(UserPool);

    setLoading(true);
    var userData = {
      Username: email,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(otp, true, (err, result) => {
      setLoading(false);
      if (err) {
        toast.error(err.message || JSON.stringify(err));
        return;
      }
      toast.success(<>Account verified successfully!</>);
      navigate('/account/login');
    });
  };

  const onChangeOtp = (value) => {
    setOtp(value);
  };
  const [clicked, setClicked] = useState(false);
  const handleResendCode = () => {
    setClicked(true); // Mark the text as clicked
    if (!email) {
      toast.success(<>Unable to resend code. Email is missing.</>);
      return;
    }

    var userData = {
      Username: email,
      Pool: UserPool
    };
    const cognitoUser = new CognitoUser(userData);

    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        toast.error(err.message || JSON.stringify(err));
        return;
      }
      toast.success(<>Verification code resent successfully.</>);
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <Image height={45} src={logo} preview={false} />
          <VaTitle
            className={styles.title}
            level={5}
            text="Verify Your Account"
          />
        </div>
        <VaOTP onChangeOtp={onChangeOtp} numInputs={6} />
        <div className={styles.footer}>
          <Button onClick={handleFinish} type="primary" loading={loading}>
            Verify
          </Button>
          <VaText
            style={{
              cursor: 'pointer',
              color: clicked ? 'red' : 'blue', // Change color based on click state
              textDecoration: clicked ? 'none' : 'underline' // Optional: underline on hover
            }}
            onClick={handleResendCode}
            text="Resend verification code?"
          />
        </div>
      </div>
    </div>
  );
}

export default VerifyAccount;
