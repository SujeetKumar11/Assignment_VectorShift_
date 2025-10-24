// FILE: nodes/outputNode.js
// ==========================================

import { BaseNode } from './BaseNode';
import { Position } from 'reactflow';

export const OutputNode = ({ id, data }) => {
  const config = {
    title: 'Output',
    icon: '📤',
    fields: [
      {
        name: 'outputName',
        label: 'Name',
        type: 'text',
        defaultValue: id.replace('customOutput-', 'output_'),
      },
      {
        name: 'outputType',
        label: 'Type',
        type: 'select',
        defaultValue: 'Text',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'Image', label: 'Image' },
        ],
      },
    ],
    handles: [
      { type: 'target', position: Position.Left, id: `${id}-value` },
    ],
    minWidth: 220,
    minHeight: 120,
  };

  return <BaseNode id={id} data={data} config={config} />;
};
