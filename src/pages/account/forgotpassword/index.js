import { Button, Form, Image, Input } from 'antd';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import VaOTP from 'shared/components/otp';
import { VaTitle } from 'shared/components/typography';
import logo from './logo.svg';

import { CognitoUser } from 'amazon-cognito-identity-js';
import UserPool from '../../../AWSCognitoUserPool';

import styles from './signin.module.scss';

function ForgotPassword() {
  const [form] = Form.useForm();
  
  let navigate = useNavigate();
  const [, setLoading] = useState(false);
  const [isResetPass, setIsResetPass] = useState(false);
  const [otp, setOtp] = useState('');
  const [emailId, setEmailId] = useState('');

  const handleFinish = (values) => {
    const userPool = UserPool; //new CognitoUser(UserPool);

    setLoading(true);
    var userData = {
      Username: emailId,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmPassword(otp, values.password, {
      onSuccess() {
        toast.success(<>Password successfully changed!</>);
        navigate('/account/login');
      },
      onFailure(err) {
        if (err.code === 'InvalidPasswordException') {
          const passwordPolicyMessage = `
      Password must meet the following criteria:
      - At least 8 characters long
      - At least one uppercase letter
      - At least one lowercase letter
      - At least one numeric character
      - At least one special character (e.g., !@#$%^&*)
    `;
          toast.error(passwordPolicyMessage, {
            duration: 8000,
            style: { whiteSpace: 'pre-line' }
          });
        } else {
          toast.error(
            err.message ||
              'An error occurred during sign-up. Please try again later.',
            {
              duration: 8000,
              style: { whiteSpace: 'pre-line' }
            }
          );
        }
      }
    });
  };

  const handleRequestCode = (values) => {
    const userPool = UserPool; //new CognitoUser(UserPool);
    setEmailId(values.email);
    const cognitoUser = new CognitoUser({
      Username: values.email,
      Pool: userPool
    });

    cognitoUser.forgotPassword({
      onSuccess: (data) => {
        setIsResetPass(true);
        toast.success(
          <>Verification code sent to your email., {values.email}!</>
        );
      },
      onFailure: (err) => {
        // setError(err.message || JSON.stringify(err));
        toast.success(err.message);
      }
      // // Optional automatic callback
      // inputVerificationCode: (data) => {
      // }
    });
  };

  const onChangeOtp = (value) => {
    setOtp(value);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <Image height={45} src={logo} preview={false} />
          <VaTitle
            className={styles.title}
            level={5}
            text="Forgot your password?"
          />
        </div>
        {!isResetPass ? (
          <>
            <Form
              name="basic"
              layout="vertical"
              onFinish={handleRequestCode}
              form={form}
              autoComplete="off"
            >
              <Form.Item
                label="Work email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Work email!'
                  }
                ]}
              >
                <Input placeholder="Enter email" />
              </Form.Item>
            </Form>
            <div className={styles.footer}>
              <Button key="submit" onClick={() => form.submit()} type="primary">
                Reset
              </Button>
            </div>
          </>
        ) : (
          <>
            <Form
              name="basic"
              layout="vertical"
              onFinish={handleFinish}
              form={form}
              autoComplete="off"
            >
              <VaOTP onChangeOtp={onChangeOtp} numInputs={6} />
              <Form.Item
                label="Enter New Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your New Password!'
                  }
                ]}
              >
                <Input.Password placeholder="Enter New Password" />
              </Form.Item>
            </Form>
            <div className={styles.footer}>
              <Button key="submit" onClick={() => form.submit()} type="primary">
                Save
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
