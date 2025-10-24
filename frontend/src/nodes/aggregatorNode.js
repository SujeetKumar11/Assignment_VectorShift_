// FILE: nodes/aggregatorNode.js
// ==========================================

import { BaseNode } from './BaseNode';
import { Position } from 'reactflow';

export const AggregatorNode = ({ id, data }) => {
  const config = {
    title: 'Aggregator',
    icon: '📊',
    fields: [
      {
        name: 'method',
        label: 'Method',
        type: 'select',
        defaultValue: 'concat',
        options: [
          { value: 'concat', label: 'Concatenate' },
          { value: 'sum', label: 'Sum' },
          { value: 'average', label: 'Average' },
          { value: 'max', label: 'Maximum' },
        ],
      },
    ],
    handles: [
      { type: 'target', position: Position.Left, id: `${id}-input1`, style: { top: '33%' } },
      { type: 'target', position: Position.Left, id: `${id}-input2`, style: { top: '50%' } },
      { type: 'target', position: Position.Left, id: `${id}-input3`, style: { top: '66%' } },
      { type: 'source', position: Position.Right, id: `${id}-output` },
    ],
    minHeight: 120,
  };

  return <BaseNode id={id} data={data} config={config} />;
};