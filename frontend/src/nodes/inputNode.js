// FILE: nodes/inputNode.js
// ==========================================

import { BaseNode } from './BaseNode';
import { Position } from 'reactflow';

export const InputNode = ({ id, data }) => {
  const config = {
    title: 'Input',
    icon: '📥',
    fields: [
      {
        name: 'inputName',
        label: 'Name',
        type: 'text',
        defaultValue: id.replace('customInput-', 'input_'),
      },
      {
        name: 'inputType',
        label: 'Type',
        type: 'select',
        defaultValue: 'Text',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'File' },
        ],
      },
    ],
    handles: [
      { type: 'source', position: Position.Right, id: `${id}-value` },
    ],
    minWidth: 220,
    minHeight: 120,
  };

  return <BaseNode id={id} data={data} config={config} />;
};