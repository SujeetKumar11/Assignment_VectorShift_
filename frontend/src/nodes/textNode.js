// FILE: nodes/textNode.js
// ==========================================

import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 250, height: 150 });

  useEffect(() => {
    const regex = /\{\{(\s*[\w]+\s*)\}\}/g;
    const matches = [...currText.matchAll(regex)];
    const extractedVars = matches.map(match => match[1].trim());
    const uniqueVars = [...new Set(extractedVars)];
    setVariables(uniqueVars);

    const lines = currText.split('\n').length;
    const longestLine = Math.max(...currText.split('\n').map(line => line.length), 10);
    
    const newWidth = Math.max(250, Math.min(500, longestLine * 8 + 60));
    const newHeight = Math.max(150, Math.min(400, lines * 25 + 100));
    
    setDimensions({ width: newWidth, height: newHeight });
  }, [currText]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  return (
    <div
      style={{
        width: dimensions.width,
        minHeight: dimensions.height,
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        border: '2px solid #ca5179ff',
        borderRadius: '12px',
        padding: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        color: '#fff',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {variables.map((variable, index) => (
        <Handle
          key={`${id}-${variable}`}
          type="target"
          position={Position.Left}
          id={`${id}-${variable}`}
          style={{ 
            top: `${((index + 1) * 100) / (variables.length + 1)}%`,
            background: '#4CAF50',
            width: '12px',
            height: '12px',
            border: '2px solid #fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        />
      ))}

      <div style={{ 
        fontWeight: 'bold', 
        marginBottom: '10px',
        borderBottom: '1px solid rgba(255,255,255,0.3)',
        paddingBottom: '8px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <span style={{ marginRight: '8px', fontSize: '18px' }}>📝</span>
        <span style={{ fontSize: '14px' }}>Text</span>
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <label style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <span style={{ fontSize: '12px', marginBottom: '6px' }}>Text:</span>
          <textarea
            value={currText}
            onChange={handleTextChange}
            placeholder="Type here... Use {{variable}} for dynamic inputs"
            style={{
              flex: 1,
              width: '100%',
              padding: '8px',
              border: '1px solid rgba(255,255,255,0.5)',
              borderRadius: '6px',
              fontSize: '13px',
              minHeight: '80px',
              maxHeight: dimensions.height - 80 + 'px',
              resize: 'none',
              background: 'rgba(255,255,255,0.95)',
              color: '#333',
              fontFamily: 'inherit',
              lineHeight: '1.5',
              overflow: 'auto',
            }}
          />
        </label>
        
        {variables.length > 0 && (
          <div style={{ 
            marginTop: '8px', 
            fontSize: '11px', 
            opacity: 0.9,
            padding: '6px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '4px',
          }}>
            <strong>Variables:</strong> {variables.join(', ')}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{ 
          background: '#FF9800',
          width: '12px',
          height: '12px',
          border: '2px solid #fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  );
};
