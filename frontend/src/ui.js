import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { FilterNode } from './nodes/filterNode';
import { TransformNode } from './nodes/transformNode';
import { AggregatorNode } from './nodes/aggregatorNode';
import { DelayNode } from './nodes/delayNode';
import { NotificationNode } from './nodes/notificationNode';
import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  filter: FilterNode,
  transform: TransformNode,
  aggregator: AggregatorNode,
  delay: DelayNode,
  notification: NotificationNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => {
    return { id: nodeID, nodeType: type };
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={reactFlowWrapper} style={{ width: '100vw', height: '70vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType='smoothstep'
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#667eea', strokeWidth: 2 },
        }}
      >
        <Background 
          color="#cbd5e0" 
          gap={gridSize} 
          size={1}
          style={{ background: 'linear-gradient(to bottom, #f0f4f8 0%, #e2e8f0 100%)' }}
        />
        <Controls 
          showInteractive={false}
          style={{ 
            button: { 
              background: '#fff',
              borderBottom: '1px solid #e0e0e0',
            }
          }}
        />
        <MiniMap 
          nodeColor={(node) => {
            const colors = {
              customInput: '#4CAF50',
              customOutput: '#E91E63',
              llm: '#667eea',
              text: '#FF9800',
              filter: '#00BCD4',
              transform: '#FF5722',
              aggregator: '#9C27B0',
              delay: '#795548',
              notification: '#F44336',
            };
            return colors[node.type] || '#999';
          }}
          maskColor="rgba(240, 244, 248, 0.8)"
          style={{
            background: '#fff',
            border: '2px solid #e2e8f0',
          }}
        />
      </ReactFlow>
    </div>
  );
};