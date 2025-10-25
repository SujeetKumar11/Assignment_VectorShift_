import { BaseNode } from './BaseNode';
import { Position } from 'reactflow';

export const DelayNode = ({ id, data }) => {
  const config = {
    title: 'Delay',
    icon: '⏰',
    fields: [
      {
        name: 'duration',
        label: 'Duration (ms)',
        type: 'number',
        defaultValue: '1000',
      },
    ],
    handles: [
      { type: 'target', position: Position.Left, id: `${id}-input` },
      { type: 'source', position: Position.Right, id: `${id}-output` },
    ],
  };

  return <BaseNode id={id} data={data} config={config} />;
};
