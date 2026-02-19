import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VaText, VaTitle } from 'shared/components/typography';
import { Button, Result } from 'antd';
import styles from './billing.module.scss';

import { CloseOutlined } from '@ant-design/icons';
const PaymentCancel = () => {
  let navigate = useNavigate();
  return (
    <div className={styles.paymentSuccess}>
      <div style={{ display: 'grid' }}>
        <Result
          title="Payment Cancelled !"
          subTitle="Your payment has been cancelled, You can try again."
          extra={[
            <Button type="default" key="console" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>,
            <Button key="buy" onClick={() => navigate('/billings')} type="primary">Try Again</Button>,
          ]}
        />
      </div>
    </div>
  );
};

export default PaymentCancel;
