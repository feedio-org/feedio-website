import { Select, Space } from "antd";
import { ScenesOptions } from "pages/dashboard/contsnat";
import React from "react";

const ScenesSelect = () => {
  return (
    <div>
      <Select
        placeholder="Select the number of slides"
        options={ScenesOptions}
        defaultValue="5-7"
        optionRender={(option) => (
          <Space style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span role="img" aria-label={option.data.label}>
                {option.data.emoji}
              </span>
              <span>
                {option.data.label}
              </span>
            </div>
            <span style={{ color: "#888", fontSize: "0.9em", Left: "10px" }}>{option.data.desc}</span>
          </Space>
        )}
      />
    </div>
  );
};

export default ScenesSelect;
