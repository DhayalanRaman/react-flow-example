import React, { useRef } from "react";
import EditMessage from "../EditMessage/EditMessage";
import Image from "next/image";

// Props interface defining the structure of props passed to Sidebar component
interface Props {
  isSelected: boolean; // Indicates whether a node is selected
  textRef: React.RefObject<HTMLTextAreaElement>; // Ref object for text area
  nodeName: string; // Name of the node
  setNodeName: React.Dispatch<React.SetStateAction<string>>; // Function to set node name
}

// Sidebar component
const Sidebar: React.FC<Props> = ({ isSelected, textRef, nodeName, setNodeName }) => {
  // Function to handle drag start event
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string, content: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("content", content);
    event.dataTransfer.effectAllowed = "move";
  };

  // Render the sidebar
  return (
    <aside>
      {isSelected ? (
        // Render EditMessage component if a node is selected
        <EditMessage
          textRef={textRef}
          nodeName={nodeName}
          setNodeName={setNodeName}
        />
      ) : (
        // Render draggable message node if no node is selected
        <div
          className="dndnode-btn"
          onDragStart={(event) => onDragStart(event, "node", "message")}
          draggable
          style={{display: "flex", alignItems: "center"}}
        >
            <Image
            src="/assets/message.svg"
            alt="message"
            width={20}
            height={20}
          />
          <span>Message</span>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
