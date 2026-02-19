import React, { useState } from 'react';
import styles from './settings.module.scss';
import { VaTitle } from 'shared/components/typography';
import { Button, Form, Input, message, Upload, Radio } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import { CognitoUser } from 'amazon-cognito-identity-js';
import UserPool from '../../AWSCognitoUserPool';

export default function Settings() {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [, setLoading] = useState(false);

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none'
      }}
      type="button"
    >
      <div
        style={{
          marginTop: 8
        }}
      >
        Upload
      </div>
    </button>
  );

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };


  const handleFinish = (values) => { };

  const notify = (message, duration = 5000) => {
    toast.error(message, { duration });
  };
  const notifySuccess = (message, duration = 5000) => {
    toast.success(message, { duration });
  };

  const handlePassChange = async (values) => {
    setLoading(true);
    const userPool = UserPool;
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      notify('User not logged in.');
      setLoading(false);
      return;
    }

    // Validate new password and confirm password
    if (values.password !== values.confirmPassword) {
      notify('New password and confirm password do not match.');
      setLoading(false);
      return;
    }

    if (values.password === values.currentPassword) {
      notify('New password must be different from the current password.');
      setLoading(false);
      return;
    }

    cognitoUser.getSession((err, session) => {
      if (err) {
        notify(`Session error: ${err.message}`);
        setLoading(false);
        return;
      }
      cognitoUser.changePassword(
        values.currentPassword,
        values.password,
        function (err, result) {
          if (err) {
            if (err.code === 'InvalidPasswordException') {
              notify(`Password must meet the criteria:
              - At least 8 characters long
              - At least one uppercase letter
              - At least one lowercase letter
              - At least one numeric character
              - At least one special character`);
            } else {
              notify(
                err.message || 'An error occurred. Please try again later.'
              );
            }
            // notify(err);
            // alert(err.message || JSON.stringify(err));
            return;
          }
          if (result === 'SUCCESS') {
            notifySuccess('New Password changed successfully');
            setLoading(false);
            return;
          }
        }
      );

      // cognitoUser.changePassword(values.currentPassword, values.password, {
      //   onSuccess() {
      //     console.log('Password confirmed!');
      //     toast.success('Password successfully changed!');
      //     setLoading(false);
      //   },
      //   onFailure(err) {
      //     setLoading(false);
      //     console.error(err);
      //     if (err.code === 'InvalidPasswordException') {
      //       notify(`Password must meet the criteria:
      //       - At least 8 characters long
      //       - At least one uppercase letter
      //       - At least one lowercase letter
      //       - At least one numeric character
      //       - At least one special character`);
      //     } else {
      //       notify(err.message || 'An error occurred. Please try again later.');
      //     }
      //   }
      // });
    });
  };

  // const handlePassChange = async (values) => {
  //   console.log(values);
  //   setLoading(true);
  //   const userPool = UserPool; //new CognitoUser(UserPool);
  //   const cognitoUser = userPool.getCurrentUser();
  //   // Validate new password and confirm password
  //   if (values.password !== values.confirmPassword) {
  //     toast.error('New password and confirm password do not match.');
  //     setLoading(false);
  //     return;
  //   }

  //   if (values.password === values.currentPassword) {
  //     toast.error('New password must be different from the current password.');
  //     setLoading(false);
  //     return;
  //   }
  //   if (cognitoUser) {
  //     cognitoUser.getSession((err, session) => {
  //       if (err) {
  //         console.error(err);
  //         toast.error(`Session error: ${err.message}`); // Show error toast
  //         return;
  //       }
  //       // const cognitoUser = new CognitoUser(userData);
  //       cognitoUser.changePassword(values.currentPassword, values.password, {
  //         onSuccess() {
  //           console.log('Password confirmed!');
  //           toast.success(<>Password successfully changed!</>);
  //           // navigate('/account/login');
  //         },
  //         onFailure(err) {
  //           console.log(err);
  //           if (err.code === 'InvalidPasswordException') {
  //             const passwordPolicyMessage = `
  //     Password must meet the following criteria:
  //     - At least 8 characters long
  //     - At least one uppercase letter
  //     - At least one lowercase letter
  //     - At least one numeric character
  //     - At least one special character (e.g., !@#$%^&*)
  //   `;
  //             toast.error(passwordPolicyMessage, {
  //               duration: 8000,
  //               style: { whiteSpace: 'pre-line' }
  //             });
  //           } else {
  //             toast.error(
  //               err.message ||
  //                 'An error occurred during sign-up. Please try again later.',
  //               {
  //                 duration: 8000,
  //                 style: { whiteSpace: 'pre-line' }
  //               }
  //             );
  //           }
  //           console.log('Password not confirmed!');
  //         }
  //       });
  //     });
  //   }
  // };

  return (
    <div className={styles.wrapper}>
      <VaTitle level={5} text="Profile Management" />
      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          <VaTitle level={5} text="Password Update" />
          <div className={styles.passwordForm}>
            <Form
              name="basic"
              layout="vertical"
              onFinish={handlePassChange}
              form={form}
              autoComplete="off"
            >
              <Form.Item
                label="Current Password"
                name="currentPassword"
                rules={[
                  {
                    required: true,
                    message: 'Please input your current password!'
                  }
                ]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your password!'
                  }
                ]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Confirm password!'
                  }
                ]}
              >
                <Input.Password placeholder="Enter confirm password" />
              </Form.Item>
            </Form>
          </div>
          <div className={styles.footer}>
            <Button type="primary" onClick={() => form.submit()}>
              Save Changes
            </Button>
          </div>
        </div>
        {/* <div className={styles.card}>
          <VaTitle level={5} text='Profile Update'/>
          <div className={styles.profile}>
            <Upload
              name="avatar"
              listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {
                uploadButton
              }
            </Upload>
          </div>
          <div  className={styles.profileForm}>
            <Form
              name="basic"
              layout='vertical'
              onFinish={handleFinish}
              form={form}
              autoComplete="off"
            >
              <Form.Item
                label="First name"
                name="firstName"
            
                rules={[
                  {
                    required: true,
                    message: 'Please input your First Name!'
                  }
                ]}
              >
                <Input placeholder="Enter email"/>
              </Form.Item>
              <Form.Item
                label="Last Name"
                name="lastName"
            
                rules={[
                  {
                    required: true,
                    message: 'Please input your lastName!'
                  }
                ]}
              >
                <Input placeholder="Enter email"/>
              </Form.Item>
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
                <Input placeholder="Enter email"/>
              </Form.Item>

            </Form>
          </div>
          <div className={styles.footer}>
            <Button type='primary'>Save Changes</Button>
          </div>
        </div> */}
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <VaTitle level={5} text="Additional Options" />
            <div className={styles.watermarkForm}>
              <Form
                name="watermarkUpload"
                layout="vertical"
                onFinish={handleFinish}
                form={form1}
                autoComplete="off"
              >
                <Form.Item
                  label="Upload Watermark"
                  name="watermark"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  style={{ marginTop: '20px' }}
                  rules={[
                    {
                      required: true,
                      message: 'Please upload your watermark image!'
                    }
                  ]}
                >
                  <Upload
                    name="watermark"
                    listType="picture"
                    beforeUpload={() => false} // Prevent auto-upload
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item>
              </Form>
            </div>
            <div className={styles.footer}>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
