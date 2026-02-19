import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import { Button, Form, Image, Input } from 'antd';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { VaDescription, VaTitle } from 'shared/components/typography';
import { VaContext } from 'shared/rbac/context';
import UserPool from '../../../AWSCognitoUserPool';
import logo from './logo.svg';
import styles from './signin.module.scss';

function Login() {
  const [form] = Form.useForm();
  const authCxt = useContext(VaContext);
  let navigate = useNavigate();
  const [, setLoading] = useState(false);

  useEffect(() => {
    if (authCxt.authenticated) {
      navigate('/dashboard');
    }
  }, []);

  const onFinish = async (values) => {
    const userData = {
      Username: values.email,
      Pool: UserPool
    };

    const cognitoUser = new CognitoUser(userData);

    const authenticationDetails = new AuthenticationDetails({
      Username: values.email,
      Password: values.password
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        // toast.success(<>Login Successfull! Welcome back, {values.email}!</>);
        setLoading(false);
        authCxt.handleAuthentication(result);
        navigate('/dashboard');
      },
      onFailure: (err) => {
        console.error('Authentication failed:', err);
        setLoading(false);
        // Handle specific error messages
        if (err.code === 'UserNotFoundException') {
          toast.error(
            'User does not exist. Please check your email and try again.'
          );
        } else if (err.code === 'NotAuthorizedException') {
          toast.error('Incorrect username or password. Please try again.');
        } else if (err.code === 'UserNotConfirmedException') {
          toast.error(
            'Your account is not confirmed. Please check your email for the confirmation link.'
          );
        } else {
          // Generic error message for other cases
          toast.error(
            'An error occurred during login. Please try again later.'
          );
        }
      }
    });
  };

    const handleEnterKey = (event) => {
      if (event.keyCode === 13) {
        form.submit();
      }
    };

  return (
    <div className={styles.wrapper}>
      {!authCxt.authenticated ? (
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
            onFinish={onFinish}
            onKeyUp={handleEnterKey}
            form={form}
            autoComplete="off"
          >
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
              Continue with email
            </Button>
            <Button
              onClick={() => navigate("/account/forgot-password")}
              type="text"
            >
              Forgot password?
            </Button>
          </div>
          {/* <Divider plain>or</Divider> */}
          {/* <div className={styles.otherLogin}>
            <Button className={styles.gbtn} icon={<GoogleOutlined />}>
              Continue with Google
            </Button>
          </div> */}
          <div className={styles.otherLogin}>
            <Button
              onClick={() => navigate("/account/create-account")}
              type="link"
            >
              New to Feedio?
              <span className={styles.link}>Sign up</span>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Login;
