import {
  LaptopOutlined,
  MobileOutlined
} from "@ant-design/icons";
import { Radio } from 'antd';

const AspectSelect = ({onAspectChange}) => {

  const handleAspectChange = (e) => {
    onAspectChange(e.target.value);
  };

  return (
    <div>
      <Radio.Group
        className="ratio-radio-group"
        defaultValue="16:9"
        style={{ display: "flex", alignItems: "center" }}
        onChange={handleAspectChange}
      >
        <Radio
          value="16:9"
          className="ratio-radio"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px",
            borderRadius: "10px",
            transition: "all 0.3s ease",
          }}
        >
          <LaptopOutlined
            style={{
              fontSize: "36px",
              color: "#1890ff",
              marginRight: "8px",
            }}
          />
          <span style={{ fontSize: "18px", color: "#333" }}>
                        16:9
          </span>
        </Radio>
        <Radio
          value="9:16"
          className="ratio-radio"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px",
            borderRadius: "10px",
            transition: "all 0.3s ease",
          }}
        >
          <MobileOutlined
            style={{
              fontSize: "36px",
              color: "#1890ff",
              marginRight: "8px",
            }}
          />
          <span style={{ fontSize: "18px", color: "#333" }}>
                        9:16
          </span>
        </Radio>
      </Radio.Group>
    </div>
  );
};

export default AspectSelect;
