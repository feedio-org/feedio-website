import { Row } from "antd";
function VaRow(props) {
  const { children, gutter=20, className} = props;
  return (<Row gutter={gutter} className={className}>
    {children}
  </Row>);
}

export default VaRow;