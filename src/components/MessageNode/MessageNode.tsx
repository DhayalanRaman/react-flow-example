import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { style } from "./MessageNodeStyles";
import Image from "next/image";

interface NodeProps {
  data: {
    heading: string;
    content: string;
  };
  selected: boolean;
}

const MessageNode: React.FC<NodeProps> = ({ data, selected }) => {
  let customTitle = { ...style.title };
  customTitle.backgroundColor = "#08c9bd";

  return (
    <div className="text-updater-node">
      <div style={{ ...style.body, ...(selected ? style.selected : {}) }}>
        <div style={{...customTitle, gap: 5, width: "100%", display: "flex" ,justifyContent: "space-between", alignItems: "center"}}>
          <Image
            src="/assets/message.svg"
            alt="message"
            width={20}
            height={20}
          />
          <div>{data.heading}</div>
          <Image
            src="/assets/whatts.png"
            alt="message"
            width={15}
            height={15}
          />
        </div>
        <div style={style.contentWrapper}>{data.content}</div>
      </div>
      <Handle type="source" position={Position.Right} id="b" />
      <Handle type="target" position={Position.Left} id="a" />
    </div>
  );
};

export default memo(MessageNode);
