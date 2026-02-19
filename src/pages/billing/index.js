import { ClockCircleOutlined } from "@ant-design/icons";
import { loadStripe } from "@stripe/stripe-js";
import { Col, Modal, Row, Spin, Table, Tag } from "antd";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VaTitle } from "shared/components/typography";
import styles from "./billing.module.scss";
import PriceGauge from "./components/meter";
import PriceCard from "./components/price";
import {
  checkoutPricing,
  getBillingActivities,
  getUsageQuota,
} from "./redux/billingSlice";

// Load your Stripe publishable key
const stripePromise = loadStripe(
  "pk_live_51QBrHeCEoVTYWzcpD0ilphRMPyJ65sEzKQdkr2mh6R12Bi9RtWmEXLAHWjiT3z1jK9dbQSAbI30fCb268x8M7X6B00Ij5n6qdo"
);

export default function Billings() {
  const dispatch = useDispatch();
  const [balanceQuota, setBalanceQuota] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [billingList, setBillingList] = useState(null);
  const [isLoading, setLoading] = useState({});
  const { usageQuota, status, billingActivityList, billingActivityStatus } =
    useSelector((state) => state.billing);

  useEffect(() => {
    dispatch(getUsageQuota());
    dispatch(getBillingActivities());
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded" && usageQuota) {
      let balance = usageQuota?.data?.balance;
      balance = parseFloat((balance / 60).toFixed(2));
      setBalanceQuota(balance);
      if (balance !== null && balance <= 0) {
        setIsModalVisible(true);
      } else {
        setIsModalVisible(false);
      }
    }
  }, [balanceQuota, status, usageQuota]);

  useEffect(() => {
    if (billingActivityStatus === "succeeded") {
      setBillingList(billingActivityList?.activities);
    }
  }, [billingActivityList, billingActivityStatus]);

  // Handle the OK button or any action in the modal
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const pricingData = [
    {
      plan: "Basic",
      minutes: "+ 30",
      payment_plan: "PAY_10_USD",
      price: 10,
      tag: "",
      features: ["Minutes of", "video Generation"],
    },
    {
      plan: "Pro",
      minutes: "+ 150",
      payment_plan: "PAY_50_USD",
      price: 50,
      tag: "Most Popular",
      features: ["Minutes of", "video Generation"],
    },
    {
      plan: "Business",
      minutes: "+ 300",
      payment_plan: "PAY_100_USD",
      price: 90,
      tag: "",
      features: ["Minutes of", "video Generation"],
    },
  ];

  const handleBuyNow = async (paymentPlan, index) => {
    setLoading((prevState) => ({
      ...prevState,
      [index]: true, // Use the index to identify the specific card
    }));
    const stripe = await stripePromise;

    // Assume checkoutPricing dispatch will return the clientSecret
    const response = await dispatch(
      checkoutPricing({ payment_plan: paymentPlan })
    );
    // Access the clientSecret directly from response.payload.data
    const sessionId = response?.payload?.data?.id;
    // Redirect to Stripe Checkout using session.id
    const checkout = await stripe.redirectToCheckout({
      sessionId: sessionId, // Use the session ID here
    });

    setLoading((prevState) => ({
      ...prevState,
      [index]: false,
    }));
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (text) => {
        return format(new Date(text), "dd-MM-yyyy HH:mm");
      },
    },
    {
      title: "Activity",
      dataIndex: "activity_type",
      key: "activity_type",
      render: (text) => {
        return (
          <div>
            <Tag color="#fa861c">
              {text === "QUOTA_CONSUMED" ? "Video Generation" : "Usage"}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Duration",
      dataIndex: "quota",
      key: "quota",
      render: (text) => {
        const minutes = text / 60;
        return (
          <div>
            <ClockCircleOutlined style={{ marginRight: ".8rem" }} />
            {minutes.toFixed(2)} {minutes > 1 ? "minutes" : "minute"}
          </div>
        );
      },
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div>
        <VaTitle
          level={5}
          text="Billing - Usage Report & Add-on"
          style={{ marginTop: "10px", fontSize: "19px", fontWeight: "bold" }}
        />
        {status === "succeeded" ? (
          <div
            className={`grid grid-cols-12 gap-6 items-center ${styles.card}`}
          >
            {/* PriceGauge Component */}
            <div className="col-span-12 md:col-span-4 flex justify-center">
              <PriceGauge initialBalance={balanceQuota} />
            </div>

            {/* Billing History Section */}
            <div className="col-span-12 md:col-span-8 flex flex-col justify-center items-center text-center">
              <VaTitle
                level={3}
                text="Billing History"
                style={{ marginTop: "2rem", padding: "1rem" }}
              />
              <div className="w-full overflow-x-auto">
                <Table
                  columns={columns}
                  dataSource={billingList}
                  rowKey="activity_id"
                  size="small"
                  pagination={{
                    pageSize: 5,
                    showSizeChanger: false,
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", height: "500px" }}>
            <Spin
              size="large"
              className="spinner"
              style={{ display: "block", margin: "0 auto", marginTop: "200px" }}
            />
            <div style={{ marginTop: "20px" }}>
              <h3>Loading, please wait...</h3>
            </div>
          </div>
        )}
      </div>

      {/* Pricing cards */}
      <div className="pricing-card bg-white pb-24 ">
        <div className="p-10">
          <h2 className="text-3xl font-bold tracking-tight text-center mt-12 sm:text-5xl">
            Pricing
          </h2>
          <p className="max-w-3xl mx-auto mt-4 text-xl text-center">
            Get started on our free plan and upgrade when you are ready.
          </p>
        </div>
        <Row gutter={[16, 16]} justify="center">
          {pricingData.map((item, index) => (
            <Col
              key={index}
              xs={24}
              sm={24}
              md={12}
              lg={6}
              className="pt-[5rem]"
            >
              <PriceCard
                key={index}
                minutes={item.minutes}
                plan={item.plan}
                paymentPlan={item.payment_plan}
                price={item.price}
                features={item.features}
                tag={item.tag}
                isLoading={isLoading}
                index={index}
                handleBuyNow={handleBuyNow}
              />
            </Col>
          ))}
        </Row>
      </div>

      <Modal
        title="Upgrade"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleOk}
        okText="Ok"
      >
        <p>
          You've hit your video generation limit! Upgrade now to Generate Video.
        </p>
      </Modal>
    </div>
  );
}
