import { Button, Divider, Form, Image, Input } from 'antd';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { VaDescription, VaTitle } from 'shared/components/typography';
import logo from './logo.svg';

import styles from './signin.module.scss';

import {
  CognitoUserAttribute
} from 'amazon-cognito-identity-js';
import UserPool from '../../../AWSCognitoUserPool';

function CreateAccount() {
  const [form] = Form.useForm();
  let navigate = useNavigate();
  const [, setLoading] = useState(false);

  const handleFinish = async (values) => {

    setLoading(true);

    const userPool = UserPool; //new CognitoUserPool(UserPool);

    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: values.email
      })
    ];

    userPool.signUp(
      values.email,
      values.password,
      attributeList,
      null,
      (err, result) => {

        if (err) {
          setLoading(false);

          setLoading(false);

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
          return;
        }

        toast.success(
          'Check your email for Verification code.'
        );
        navigate('/account/verify', {
          state: { email: values.email }
        });
      }
    );
  };

    const handleEnterKey = (event) => {
      if (event.keyCode === 13) {
        form.submit();
      }
    }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <Image height={45} src={logo} preview={false} />
          <VaTitle
            className={styles.title}
            level={5}
            text="Welcome to Feedio"
          />
          <VaDescription
            className={styles.desc}
            text="Using your work email will improve your experience."
          />
        </div>
        <Form
          name="basic"
          layout="vertical"
          onFinish={handleFinish}
          onKeyUp={handleEnterKey}
          form={form}
          autoComplete="off"
        >
          <Form.Item label="Name" name="name">
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            label="Work email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Work email!",
              },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
        </Form>
        <div className={styles.footer}>
          <Button onClick={() => form.submit()} type="primary">
            Continue
          </Button>
        </div>
        <Divider plain>or</Divider>
        {/* <div className={styles.otherLogin}>
          <Button className={styles.gbtn} icon={<GoogleOutlined />}>
            Continue with Google
          </Button>
        </div> */}
        <div className={styles.otherLogin}>
          <Button onClick={() => navigate("/account/login")} type="link">
            Already a member?
            <span className={styles.link}>Log in</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;
