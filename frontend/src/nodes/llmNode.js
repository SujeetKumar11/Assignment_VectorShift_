import { Handle, Position } from 'reactflow';

export const LLMNode = ({ id, data }) => {
  return (
    <div
      style={{
        width: 220,
        minHeight: 140,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: '2px solid #5a67d8',
        borderRadius: '12px',
        padding: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        color: '#fff',
        position: 'relative',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-system`}
        style={{
          top: '35%',
          background: '#4CAF50',
          width: '12px',
          height: '12px',
          border: '2px solid #fff',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-prompt`}
        style={{
          top: '65%',
          background: '#2196F3',
          width: '12px',
          height: '12px',
          border: '2px solid #fff',
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '10px',
          borderBottom: '1px solid rgba(255,255,255,0.3)',
          paddingBottom: '8px',
        }}
      >
        <span style={{ marginRight: '8px', fontSize: '18px' }}>🤖</span>
        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>LLM</span>
      </div>

      <div style={{ fontSize: '12px', marginBottom: '8px' }}>
        <div style={{ marginBottom: '4px', opacity: 0.9 }}>
          • System (green)
        </div>
        <div style={{ opacity: 0.9 }}>
          • Prompt (blue)
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-response`}
        style={{
          top: '50%',
          background: '#FF9800',
          width: '12px',
          height: '12px',
          border: '2px solid #fff',
        }}
      />
    </div>
  );
};