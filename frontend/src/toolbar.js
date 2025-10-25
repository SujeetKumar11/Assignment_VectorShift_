import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
  return (
    <div style={{ 
      padding: '20px',
      background: '#08b1cbcd',
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
        gap: '15px',
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
