import { Col } from "antd";
function VaCol(props) {
  const { children, span=12 } = props;
  return (<Col span={span}>
    {children}
  </Col>);
}

export default VaCol;