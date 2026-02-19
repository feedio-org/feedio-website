/* eslint-disable jsx-a11y/no-redundant-roles */
import { Button } from "antd";
import React from "react";
import { ShoppingCartOutlined } from "@ant-design/icons";
const PriceCard = ({
  features,
  minutes,
  paymentPlan,
  price,
  handleBuyNow,
  tag,
  plan,
  isLoading,
  index,
}) => {
  return (
    <div className="relative p-8 border border-gray-200 rounded-2xl shadow-sm flex flex-col">
      <div className="flex-1 pb-8">
        <h3 className="text-xl font-semibold">{plan}</h3>
        {tag && (
          <p className="absolute top-0 py-1.5 px-4 bg-fio-primary text-white rounded-full text-xs font-semibold uppercase tracking-wide transform -translate-y-1/2">
            Most popular
          </p>
        )}
        <p className="mt-4 flex items-baseline">
          <span className="text-5xl font-extrabold tracking-tight">
            ${price}
          </span>
          {/* <span className="ml-1 text-xl font-semibold">/month</span> */}
        </p>
        <p className="mt-6">You want to learn and have a personal assistant</p>
        <ul role="list" className="mt-6 space-y-6">
          <li className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0 w-6 h-6 text-fio-primary"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span className="ml-3">{minutes} minutes</span>
          </li>
          
        </ul>
      </div>
      <Button
        type="primary"
        size="large"
        onClick={() => handleBuyNow(paymentPlan, index)}
        // disabled={isLoading[index]}
        loading={isLoading[index]}
        icon={<ShoppingCartOutlined style={{ fontSize: "26px" }}/>}
      >
        Buy now
      </Button>
    </div>
  );
};

export default PriceCard;
