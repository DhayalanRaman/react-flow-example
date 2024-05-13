'use client'
import React, { useCallback, useEffect, useState, useRef } from "react";
import ReactFlow, {
  addEdge,
  Background,
  useEdgesState,
  ReactFlowProvider,
  useNodesState,
} from "reactflow";

// Utils
import { isAllNodeisConnected } from "@/utils/commonUtils";
import { nodes as initialNodes, edges as initialEdges } from "@/utils/constants";

// Styles
import "reactflow/dist/style.css";
import MessageNode from "../MessageNode/MessageNode";
import Sidebar from "../Sidebar/Sidebar";

let id = 0;
const getId = (): string => `dndnode_${id++}`;
const nodeTypes = { node: MessageNode };
const Flow: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [nodeName, setNodeName] = useState<string>("Node 1");

  const onInit = (instance: any): void => setReactFlowInstance(instance);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

const onDrop = (event: React.DragEvent<HTMLDivElement>): void => {
  event.preventDefault();
  const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
  if (!reactFlowBounds || !reactFlowWrapper.current) return;

  const type = event.dataTransfer.getData("application/reactflow");
  const label = event.dataTransfer.getData("content");
  const position = {
    x: event.clientX - reactFlowBounds.left,
    y: event.clientY - reactFlowBounds.top,
  };

  if (!position) return;

  const newNode = {
    id: getId(),
    type,
    position,
    data: { heading: "Send Message", content: label },
  };
  
  setNodes((es) => es.concat(newNode));
  setSelectedNode(newNode.id);
};


  const onConnect = useCallback(
    (params: any): void =>  setEdges((eds) =>
      addEdge({ ...params, markerEnd: { type: "arrowclosed" } }, eds)
    ),
    [setNodes]
  );

  useEffect(() => {
    const node = nodes.find((node) => node.selected);
    if (node) {
      setSelectedNode(node);
      setIsSelected(true);
    } else {
      setSelectedNode(null);
      setIsSelected(false);
    }
  }, [nodes]);


  useEffect(() => {
    setNodeName(selectedNode?.data?.content || selectedNode);
  }, [selectedNode]);
  
  useEffect(() => {
    textRef?.current?.focus();
  }, [selectedNode]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode?.id) {
          node.data = {
            ...node.data,
            content: nodeName || " "
          };
        }
        return node;
      })
    );
  }, [nodeName, setNodes]);

  const saveHandler = (): void => {
    if (isAllNodeisConnected(nodes, edges)) {
      alert("Congrats its correct");
    } else {
      alert("Please connect source nodes (Cannot Save Flow)");
    }
  };

  return (
    <>
      <button onClick={saveHandler}>Save</button>
      <div className="dndflow">
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onConnect={onConnect}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onLoad={onInit}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              attributionPosition="top-right"
            >
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          </div>

          <Sidebar isSelected={isSelected} textRef={textRef} nodeName={nodeName} setNodeName={setNodeName} />
        </ReactFlowProvider>
      </div>
    </>
  );
};

export default Flow;
