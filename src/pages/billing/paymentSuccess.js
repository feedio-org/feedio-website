import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { sessionStatus } from './redux/billingSlice';
import { useDispatch, useSelector } from 'react-redux';
import { VaText, VaTitle } from 'shared/components/typography';
import { Button, Result, Spin } from 'antd';
import styles from './billing.module.scss';

const PaymentSuccess = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const { paySessionStatus, paymentSessionStatus, paymentSessionStatusError } =
    useSelector((state) => state.billing);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);

    const sessionId = query.get('session_id');
    if (sessionId) {
      // Dispatch the session status action
      dispatch(sessionStatus({ session_id: sessionId }))
        .then(() => {
          toast.success(<>Payment was successful! Thank you for your purchase.</>);
        })
        .catch(() => {
          toast.error(<>Payment failed! Please try again.</>);
        });
    }

    const timer = setTimeout(() => {
      setLoading(false); 
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch, location.search]);
  if (loading) {
    return (
      <div className={styles.paymentSuccess}>
        <div style={{ display: 'grid', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
          <VaText style={{ textAlign: 'center', marginTop: '20px' }}>
            Processing your payment, please wait...
          </VaText>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.paymentSuccess}>
      {paySessionStatus === 'succeeded' &&
      paymentSessionStatus?.status === 'complete' ? (
        <div style={{ display: 'grid' }}>
          <Result
            status="success"
            title="Successfully Purchased !"
            subTitle="You can Generate videos without any Interruption..."
            extra={[
              <Button type="primary" key="console" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
            ]}
          />
        </div>
      ) : (
        <div style={{ display: 'grid' }}>
          <Result
            status="error"
            title="Payment failed, Please try again."
            subTitle="Your payment has not been processed."
            extra={[
              <Button type="default" key="console" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>,
              <Button key="buy" onClick={() => navigate('/billings')} type="primary">Try Again</Button>,
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
