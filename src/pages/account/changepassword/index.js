import React, { useCallback, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Image, Input } from 'antd';
import { VaContext } from 'shared/rbac/context';
import toast from 'react-hot-toast';
import { accountAPI } from '../account.service';
import { VaTitle } from 'shared/components/typography';
import logo from './logo.svg';

import styles from './change.module.scss';

function ChangePassword() {
  const [form] = Form.useForm();
  const authCxt = useContext(VaContext);
  let navigate = useNavigate();
  const [, setLoading] = useState(false);

  const handleFinish = useCallback((values) => {
    setLoading(true);
    accountAPI.login(values).then(
      (data) => {
        // toast.success(
        //   <>
        //     Login Successful! Welcome back ,{values.email}
        //   </>
        // );
        // toast.success(`Login Successful! Welcome back ${values.email}!`);
        setLoading(false);
        authCxt.handleAuthentication(data);
        if (!data?.isVerified) {
          navigate('/account/verify');
        } else {
          navigate('/dashboard');
        }
      },
      (err) => {
        if (err?.status === 2) {
          navigate(`/account/requested`);
          return;
        }
        if (!err?.isVerify) {
          toast.error(err?.error);
        }
        setLoading(false);
      }
    );
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <Image height={45} src={logo} preview={false} />
          <VaTitle className={styles.title} level={5} text="Change password" />
        </div>
        <Form
          name="basic"
          layout="vertical"
          onFinish={handleFinish}
          form={form}
          autoComplete="off"
        >
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
                message: 'Please input your password!'
              }
            ]}
          >
            <Input.Password placeholder="Enter Confirm password" />
          </Form.Item>
        </Form>
        <div className={styles.footer}>
          <Button onClick={() => form.submit()} type="primary">
            Update
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
