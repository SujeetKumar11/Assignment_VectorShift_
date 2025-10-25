import { useState } from 'react';
import { useStore } from './store';

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setShowModal(true);

    try {
      const pipelineData = {
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data,
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
        })),
      };

      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pipelineData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error submitting pipeline:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setResult(null);
    setError(null);
  };

  return (
    <>
      {/* Submit Button */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px',
        gap: '12px',
      }}>
        <button 
          onClick={handleSubmit}
          disabled={nodes.length === 0}
          style={{
            padding: '14px 40px',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#fff',
            background: nodes.length === 0 
              ? '#ccc' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '10px',
            cursor: nodes.length === 0 ? 'not-allowed' : 'pointer',
            boxShadow: nodes.length === 0 
              ? 'none' 
              : '0 4px 15px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => {
            if (nodes.length > 0) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
          }}
        >
          <span style={{ fontSize: '20px' }}>🚀</span>
          Submit Pipeline
        </button>
        
        <div style={{ 
          fontSize: '13px', 
          color: '#666',
          background: '#f0f4f8',
          padding: '8px 16px',
          borderRadius: '8px',
          fontWeight: '500',
        }}>
          {nodes.length} nodes • {edges.length} edges
        </div>
      </div>

      {/* Interactive Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.3s ease',
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '0',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              animation: 'slideUp 0.3s ease',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              background: loading 
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : error 
                  ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
                  : result?.is_dag
                    ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                    : 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
              padding: '30px',
              color: '#fff',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                {loading ? '⏳' : error ? '' : result?.is_dag ? '' : ''}
              </div>
              <h2 style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
                {loading 
                  ? 'Analyzing Pipeline...' 
                  : error 
                    ? 'Analysis Failed'
                    : result?.is_dag 
                      ? 'Valid Pipeline!'
                      : 'Warning: Cycle Detected'}
              </h2>
            </div>

            {/* Content */}
            <div style={{ padding: '30px' }}>
              {loading && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #667eea',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 20px',
                  }} />
                  <p style={{ color: '#666', margin: '0' }}>
                    Processing your pipeline...
                  </p>
                </div>
              )}

              {error && (
                <div>
                  <div style={{
                    background: '#ffebee',
                    padding: '16px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    border: '2px solid #ff6b6b',
                  }}>
                    <p style={{ margin: '0', color: '#c62828', fontSize: '14px' }}>
                      <strong>Error:</strong> {error}
                    </p>
                  </div>
                  <p style={{ color: '#666', fontSize: '14px', margin: '0' }}>
                    Please make sure the backend is running on port 8000.
                  </p>
                </div>
              )}

              {result && !error && (
                <div>
                  {/* Stats Cards */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '16px',
                    marginBottom: '24px',
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      padding: '20px',
                      borderRadius: '12px',
                      color: '#fff',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
                        {result.num_nodes}
                      </div>
                      <div style={{ fontSize: '14px', opacity: 0.9 }}>
                        Nodes
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      padding: '20px',
                      borderRadius: '12px',
                      color: '#fff',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
                        {result.num_edges}
                      </div>
                      <div style={{ fontSize: '14px', opacity: 0.9 }}>
                        Edges
                      </div>
                    </div>
                  </div>

                  {/* DAG Status */}
                  <div style={{
                    background: result.is_dag 
                      ? 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
                      : 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                    padding: '20px',
                    borderRadius: '12px',
                    border: result.is_dag 
                      ? '2px solid #4CAF50'
                      : '2px solid #FF9800',
                    marginBottom: '20px',
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                    }}>
                      <div style={{ fontSize: '32px' }}>
                        {result.is_dag ? '✓' : '⚠'}
                      </div>
                      <div>
                        <div style={{ 
                          fontWeight: 'bold', 
                          fontSize: '16px',
                          color: result.is_dag ? '#2e7d32' : '#e65100',
                          marginBottom: '4px',
                        }}>
                          {result.is_dag ? 'Directed Acyclic Graph' : 'Cycle Detected'}
                        </div>
                        <div style={{ 
                          fontSize: '13px',
                          color: result.is_dag ? '#558b2f' : '#ef6c00',
                        }}>
                          {result.is_dag 
                            ? 'Your pipeline is valid and ready to execute!'
                            : 'Your pipeline contains cycles and may cause infinite loops.'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {!result.is_dag && (
                    <div style={{
                      background: '#fff9e6',
                      padding: '16px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      color: '#8B6914',
                      border: '1px solid #ffe082',
                    }}>
                      <strong>💡 How to fix:</strong>
                      <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                        <li>Select the edge causing the cycle</li>
                        <li>Press Delete or Backspace to remove it</li>
                        <li>Ensure data flows in one direction only</li>
                      </ul>
                    </div>
                  )}

                  {result.is_dag && (
                    <div style={{
                      background: '#e8f5e9',
                      padding: '16px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      color: '#2e7d32',
                      border: '1px solid #a5d6a7',
                    }}>
                      <strong>🎉 Great job!</strong> Your pipeline structure is optimal for execution.
                      All nodes will process in the correct order without loops.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '20px 30px',
              background: '#f8f9fa',
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
              <button
                onClick={closeModal}
                style={{
                  padding: '12px 32px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  color: '#fff',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};