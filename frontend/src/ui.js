import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap, Panel } from 'reactflow';
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
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedEdges, setSelectedEdges] = useState([]);
  
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

  // Handle selection changes
  const onSelectionChange = useCallback(({ nodes, edges }) => {
    setSelectedNodes(nodes);
    setSelectedEdges(edges);
  }, []);

  // Delete selected nodes and edges
  const onDelete = useCallback(() => {
    if (selectedNodes.length > 0 || selectedEdges.length > 0) {
      const nodeIds = selectedNodes.map(node => node.id);
      const edgeIds = selectedEdges.map(edge => edge.id);

      // Delete nodes
      if (nodeIds.length > 0) {
        onNodesChange(
          nodeIds.map(id => ({
            id,
            type: 'remove',
          }))
        );
      }

      // Delete edges
      if (edgeIds.length > 0) {
        onEdgesChange(
          edgeIds.map(id => ({
            id,
            type: 'remove',
          }))
        );
      }

      setSelectedNodes([]);
      setSelectedEdges([]);
    }
  }, [selectedNodes, selectedEdges, onNodesChange, onEdgesChange]);

  // Keyboard shortcuts for delete
  const onKeyDown = useCallback(
    (event) => {
      // Delete or Backspace key
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        onDelete();
      }
      // Ctrl+Z for undo (placeholder - can implement undo/redo later)
      if (event.ctrlKey && event.key === 'z') {
        console.log('Undo - feature can be added');
      }
    },
    [onDelete]
  );

  return (
    <div 
      ref={reactFlowWrapper} 
      style={{ width: '100vw', height: '70vh', position: 'relative' }}
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType='smoothstep'
        deleteKeyCode={['Backspace', 'Delete']}
        multiSelectionKeyCode='Shift'
        selectNodesOnDrag={false}
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

        {/* Help Panel */}
        <Panel position="top-right" style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          fontSize: '12px',
          maxWidth: '280px',
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#667eea' }}>
            ⌨️ Keyboard Shortcuts
          </div>
          <div style={{ lineHeight: '1.8', color: '#555' }}>
            <div><strong>Delete/Backspace:</strong> Delete selected</div>
            <div><strong>Click:</strong> Select node/edge</div>
            <div><strong>Shift + Click:</strong> Multi-select</div>
            <div><strong>Drag:</strong> Move nodes</div>
          </div>
        </Panel>

        {/* Delete Button Panel */}
        {(selectedNodes.length > 0 || selectedEdges.length > 0) && (
          <Panel position="top-center" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '10px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>
              {selectedNodes.length > 0 && `${selectedNodes.length} node(s)`}
              {selectedNodes.length > 0 && selectedEdges.length > 0 && ' & '}
              {selectedEdges.length > 0 && `${selectedEdges.length} edge(s)`} selected
            </span>
            <button
              onClick={onDelete}
              style={{
                background: '#ff4757',
                color: '#fff',
                border: 'none',
                padding: '6px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#ff3838';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#ff4757';
                e.target.style.transform = 'scale(1)';
              }}
            >
              🗑️ Delete
            </button>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};