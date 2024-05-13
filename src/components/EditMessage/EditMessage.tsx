import React from "react";

interface Props {
    textRef: React.RefObject<HTMLTextAreaElement>;
  nodeName: string;
  setNodeName: React.Dispatch<React.SetStateAction<string>>;
}

const EditMessage: React.FC<Props> = ({ textRef, nodeName, setNodeName }) => {
  return (
    <div className="updatenode__controls">
      <label>Text</label>
      <textarea
        ref={textRef}
        value={nodeName || ""}
        onChange={(evt) => setNodeName(evt.target.value)}
      />
    </div>
  );
};

export default EditMessage;
