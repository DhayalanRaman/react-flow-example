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

// Incremental ID generator function
let id = 0;
const getId = (): string => `dndnode_${id++}`;

// Define node types
const nodeTypes = { node: MessageNode };

// Main Flow component
const Flow: React.FC = () => {
  // Refs for elements
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  // State variables
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [nodeName, setNodeName] = useState<string>("Node 1");

  // Function to initialize React Flow instance
  const onInit = (instance: any): void => setReactFlowInstance(instance);

  // Function to handle drag over event
  const onDragOver = (event: React.DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  // Function to handle drop event
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

  // Function to handle connection creation
  const onConnect = useCallback(
    (params: any): void =>
      setEdges((eds) =>
        addEdge({ ...params, markerEnd: { type: "arrowclosed" } }, eds)
      ),
    [setNodes]
  );

  // Effect to update selected node state
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

  // Effect to update node name state
  useEffect(() => {
    setNodeName(selectedNode?.data?.content || selectedNode);
  }, [selectedNode]);

  // Effect to focus on text area when node is selected
  useEffect(() => {
    textRef?.current?.focus();
  }, [selectedNode]);

  // Effect to update node data content
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode?.id) {
          node.data = {
            ...node.data,
            content: nodeName || " ",
          };
        }
        return node;
      })
    );
  }, [nodeName, setNodes]);

  // Function to handle save button click
  const saveHandler = (): void => {
    if (isAllNodeisConnected(nodes, edges)) {
      alert("Congrats its correct");
    } else {
      alert("Please connect source nodes (Cannot Save Flow)");
    }
  };

  // Render the component
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

          <Sidebar
            isSelected={isSelected}
            textRef={textRef}
            nodeName={nodeName}
            setNodeName={setNodeName}
          />
        </ReactFlowProvider>
      </div>
    </>
  );
};

export default Flow;
