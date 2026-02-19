import React from 'react';
import { Tooltip } from 'antd';
import SVG from 'react-inlinesvg';
import styles from './icon.module.scss';


function VaIcon(props) {

  let { onClick, size,text, name, hover, className } = props;
  size = {
    height: size?.height ? size.height : 16,
    width: size?.width ? size.width : 16
  };

  try {
    return (
      <Tooltip title={text} {...props}>
        <div className={`${styles.wrapper} ${(onClick || hover) ? styles.pointer : ""}
      ${className ? className : ''} `}
        onClick={() => onClick && onClick}>
          <SVG src={`${process.env.PUBLIC_URL}/icons/${name}.svg`}
            width={size.width} height={size.height} title={name} />
        </div>
      </Tooltip>
    );
  } catch (e) {
    let err = `Icon Error: ${(!name) ? 'name is missing in prop' : e.message}`;
    return <span title={err} >icon error</span>;
  }
}

export default VaIcon;