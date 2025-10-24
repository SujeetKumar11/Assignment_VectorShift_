// Updated toolbar.js with new nodes
// ==========================================

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
  return (
    <div style={{ 
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderBottom: '2px solid #5a67d8',
    }}>
      <h2 style={{ 
        margin: '0 0 15px 0',
        color: '#fff',
        fontSize: '20px',
      }}>
        Node Palette
      </h2>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '12px',
      }}>
        <DraggableNode type='customInput' label='📥 Input' />
        <DraggableNode type='llm' label='🤖 LLM' />
        <DraggableNode type='customOutput' label='📤 Output' />
        <DraggableNode type='text' label='📝 Text' />
        <DraggableNode type='filter' label='🔍 Filter' />
        <DraggableNode type='transform' label='⚡ Transform' />
        <DraggableNode type='aggregator' label='📊 Aggregator' />
        <DraggableNode type='delay' label='⏰ Delay' />
        <DraggableNode type='notification' label='🔔 Notification' />
      </div>
    </div>
  );
};
