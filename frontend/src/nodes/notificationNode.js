// FILE: nodes/notificationNode.js
// ==========================================

import { BaseNode } from './BaseNode';
import { Position } from 'reactflow';

export const NotificationNode = ({ id, data }) => {
  const config = {
    title: 'Notification',
    icon: '🔔',
    fields: [
      {
        name: 'message',
        label: 'Message',
        type: 'textarea',
        defaultValue: 'Pipeline completed',
      },
      {
        name: 'priority',
        label: 'Priority',
        type: 'select',
        defaultValue: 'medium',
        options: [
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
        ],
      },
    ],
    handles: [
      { type: 'target', position: Position.Left, id: `${id}-trigger` },
    ],
  };

  return <BaseNode id={id} data={data} config={config} />;
};