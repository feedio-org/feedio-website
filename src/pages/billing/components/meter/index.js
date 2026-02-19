import { Gauge } from "@ant-design/plots";

const PriceGauge = ({ initialBalance }) => {


  const config = {
    width: 320,
    height: 320,
    autoFit: true,
    data: {
      target: initialBalance,
      total: 300,
      name: "price",
      thresholds: [50, 200, 300],
    },
    legend: false,
    scale: {
      color: {
        range: ["#F4664A", "#FAAD14", "green"],
      },
    },
    statistic: {
      title: false,
      content: false,
    },
    style: {
      textContent: (target, total) => `\n\n\n\n\nMinutes：${target}`,
    },
  };
  return <Gauge {...config} />;
};

export default PriceGauge;