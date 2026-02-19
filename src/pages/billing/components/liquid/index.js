import { Liquid } from "@ant-design/plots";

const BalanceLiquid = ({ balance }) => {
  const config = {
    percent: 0.1,
    width: 280,
    height: 480,
    style: {
      outlineBorder: 8,
      outlineDistance: 0,
      waveLength: 228,
      color: ["#F4664A", "#FAAD14", "green"],
    },
  };
  return <Liquid {...config} />;
};

export default BalanceLiquid;