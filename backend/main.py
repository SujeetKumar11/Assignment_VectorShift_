from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Set

app = FastAPI()

# CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Node(BaseModel):
    id: str
    type: str
    position: Dict
    data: Dict


class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: str = None
    targetHandle: str = None


class PipelineRequest(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool


def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Check if the graph is a Directed Acyclic Graph (DAG) using DFS.
    
    Args:
        nodes: List of node objects
        edges: List of edge objects
        
    Returns:
        True if the graph is a DAG, False if it contains cycles
    """
    # Build adjacency list
    graph: Dict[str, List[str]] = {node.id: [] for node in nodes}
    
    for edge in edges:
        if edge.source in graph:
            graph[edge.source].append(edge.target)
    
    # Track visited nodes and recursion stack
    visited: Set[str] = set()
    rec_stack: Set[str] = set()
    
    def has_cycle(node_id: str) -> bool:
        """DFS helper to detect cycles."""
        visited.add(node_id)
        rec_stack.add(node_id)
        
        # Visit all neighbors
        for neighbor in graph.get(node_id, []):
            if neighbor not in visited:
                if has_cycle(neighbor):
                    return True
            elif neighbor in rec_stack:
                # Found a back edge (cycle)
                return True
        
        rec_stack.remove(node_id)
        return False
    
    # Check all nodes (handles disconnected components)
    for node_id in graph:
        if node_id not in visited:
            if has_cycle(node_id):
                return False
    
    return True


@app.get('/')
def read_root():
    """Health check endpoint."""
    return {'Ping': 'Pong', 'status': 'running'}


@app.post('/pipelines/parse', response_model=PipelineResponse)
async def parse_pipeline(pipeline: PipelineRequest) -> PipelineResponse:
    """
    Parse pipeline and analyze its structure.
    
    Args:
        pipeline: PipelineRequest containing nodes and edges
        
    Returns:
        PipelineResponse with number of nodes, edges, and DAG status
        
    Raises:
        HTTPException: If pipeline validation fails
    """
    try:
        # Calculate number of nodes and edges
        num_nodes = len(pipeline.nodes)
        num_edges = len(pipeline.edges)
        
        # Check if the graph is a DAG
        dag_status = is_dag(pipeline.nodes, pipeline.edges)
        
        return PipelineResponse(
            num_nodes=num_nodes,
            num_edges=num_edges,
            is_dag=dag_status
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error parsing pipeline: {str(e)}"
        )


@app.get('/pipelines/validate')
async def validate_pipeline_structure(nodes: int = 0, edges: int = 0):
    """
    Additional endpoint to validate pipeline constraints.
    
    Args:
        nodes: Number of nodes
        edges: Number of edges
        
    Returns:
        Validation status and warnings
    """
    warnings = []
    
    if nodes == 0:
        warnings.append("Pipeline has no nodes")
    
    if edges > nodes * (nodes - 1):
        warnings.append("Too many edges for the number of nodes")
    
    return {
        "valid": len(warnings) == 0,
        "warnings": warnings,
        "max_possible_edges": nodes * (nodes - 1) if nodes > 0 else 0
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)