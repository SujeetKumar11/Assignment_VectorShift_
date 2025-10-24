// FILE: nodes/BaseNode.js
// ==========================================

import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

export const BaseNode = ({ 
  id, 
  data, 
  config 
}) => {
  const {
    title,
    fields = [],
    handles = [],
    minWidth = 220,
    minHeight = 100,
    icon,
  } = config;

  const [fieldValues, setFieldValues] = useState({});

  useEffect(() => {
    const initialValues = {};
    fields.forEach(field => {
      initialValues[field.name] = data?.[field.name] || field.defaultValue || '';
    });
    setFieldValues(initialValues);
  }, [data, fields]);

  const handleFieldChange = (fieldName, value) => {
    setFieldValues(prev => ({ ...prev, [fieldName]: value }));
  };

  const renderField = (field) => {
    const { name, label, type, options } = field;
    const value = fieldValues[name] || '';

    const inputStyle = {
      width: '100%',
      padding: '8px',
      marginTop: '4px',
      border: '1px solid rgba(255,255,255,0.5)',
      borderRadius: '6px',
      fontSize: '13px',
      background: 'rgba(255,255,255,0.95)',
      color: '#333',
      fontFamily: 'inherit',
    };

    switch (type) {
      case 'text':
        return (
          <label key={name} style={{ display: 'block', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', color: '#fff', display: 'block', marginBottom: '4px' }}>
              {label}:
            </span>
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(name, e.target.value)}
              style={inputStyle}
              placeholder={`Enter ${label.toLowerCase()}...`}
            />
          </label>
        );
      
      case 'textarea':
        return (
          <label key={name} style={{ display: 'block', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', color: '#fff', display: 'block', marginBottom: '4px' }}>
              {label}:
            </span>
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(name, e.target.value)}
              style={{
                ...inputStyle,
                minHeight: '70px',
                resize: 'vertical',
                lineHeight: '1.4',
              }}
              placeholder={`Enter ${label.toLowerCase()}...`}
            />
          </label>
        );
      
      case 'select':
        return (
          <label key={name} style={{ display: 'block', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', color: '#fff', display: 'block', marginBottom: '4px' }}>
              {label}:
            </span>
            <select
              value={value}
              onChange={(e) => handleFieldChange(name, e.target.value)}
              style={{
                ...inputStyle,
                cursor: 'pointer',
              }}
            >
              {options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        );
      
      case 'number':
        return (
          <label key={name} style={{ display: 'block', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', color: '#fff', display: 'block', marginBottom: '4px' }}>
              {label}:
            </span>
            <input
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(name, e.target.value)}
              style={inputStyle}
              placeholder={`Enter ${label.toLowerCase()}...`}
            />
          </label>
        );
      
      default:
        return null;
    }
  };

  const getHandleColor = (index) => {
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0'];
    return colors[index % colors.length];
  };

  const renderHandles = () => {
    const leftHandles = handles.filter(h => h.position === Position.Left);
    const rightHandles = handles.filter(h => h.position === Position.Right);

    return handles.map((handle, index) => {
      const { type, position, id: handleId, style = {} } = handle;
      
      const isLeft = position === Position.Left;
      const relevantHandles = isLeft ? leftHandles : rightHandles;
      const handleIndex = relevantHandles.indexOf(handle);
      
      const defaultStyle = {
        top: `${((handleIndex + 1) * 100) / (relevantHandles.length + 1)}%`,
        background: getHandleColor(handleIndex),
        width: '12px',
        height: '12px',
        border: '2px solid #fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      };

      return (
        <Handle
          key={handleId || `${type}-${position}-${index}`}
          type={type}
          position={position}
          id={handleId || `${id}-${type}-${index}`}
          style={{ ...defaultStyle, ...style }}
        />
      );
    });
  };

  return (
    <div
      style={{
        minWidth,
        minHeight,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: '2px solid #5a67d8',
        borderRadius: '12px',
        padding: '14px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        color: '#fff',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {renderHandles()}
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '12px',
        borderBottom: '1px solid rgba(255,255,255,0.3)',
        paddingBottom: '8px',
      }}>
        {icon && <span style={{ marginRight: '8px', fontSize: '18px' }}>{icon}</span>}
        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{title}</span>
      </div>
      
      <div style={{ flex: 1 }}>
        {fields.map(field => renderField(field))}
      </div>
    </div>
  );
};
