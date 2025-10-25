import { BaseNode } from './BaseNode';
import { Position } from 'reactflow';

export const FilterNode = ({ id, data }) => {
  const config = {
    title: 'Filter',
    icon: '🔍',
    fields: [
      {
        name: 'condition',
        label: 'Condition',
        type: 'select',
        defaultValue: 'equals',
        options: [
          { value: 'equals', label: 'Equals' },
          { value: 'contains', label: 'Contains' },
          { value: 'greater', label: 'Greater Than' },
          { value: 'less', label: 'Less Than' },
        ],
      },
      {
        name: 'value',
        label: 'Value',
        type: 'text',
        defaultValue: '',
      },
    ],
    handles: [
      { type: 'target', position: Position.Left, id: `${id}-input` },
      { type: 'source', position: Position.Right, id: `${id}-true`, style: { top: '40%' } },
      { type: 'source', position: Position.Right, id: `${id}-false`, style: { top: '60%' } },
    ],
  };

  return <BaseNode id={id} data={data} config={config} />;
};
