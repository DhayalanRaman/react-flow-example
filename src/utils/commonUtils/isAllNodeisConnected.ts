import { Edge } from "reactflow";

// Function to check if all nodes in a graph are connected to each other
export default function isAllNodeisConnected(nodes: any[], edges: Edge[]): boolean {

    // Extract IDs of all nodes from the nodes array
    const allNodesIds = nodes.map((node) => node?.id);

    // Extract IDs of source nodes from all edges
    const allSourceEdges = edges.map((edge) => edge.source);

    // Variable to count unconnected nodes
    let count = 0;

    // Iterate over each node ID
    for (let i = 0; i < allNodesIds.length; i++) {
        // Check if the current node ID is not included in source edges
        if (!allSourceEdges.includes(allNodesIds[i])) {
            // If not connected to any other node, increment the count
            count++;
        }
    }

    // If the count of unconnected nodes is greater than or equal to 2, return false
    if (count >= 2) {
        return false;
    }

    // If all nodes are connected, return true
    return true;
}
