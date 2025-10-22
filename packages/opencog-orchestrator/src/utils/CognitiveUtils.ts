import type { 
  CognitiveNode, 
  TruthValue, 
  AttentionValue,
  CognitivePattern,
  SynergyDynamics 
} from '../types';

/**
 * Utility functions for cognitive operations
 */

/**
 * Calculate truth value from confidence and strength
 */
export function calculateTruthValue(evidence: number[], prior: number = 0.5): TruthValue {
  const count = evidence.length;
  const positiveEvidence = evidence.filter(e => e > 0.5).length;
  
  const strength = count > 0 ? positiveEvidence / count : prior;
  const confidence = Math.min(1.0, count / (count + 1)); // K parameter of 1
  
  return { strength, confidence };
}

/**
 * Update truth value with new evidence
 */
export function updateTruthValue(current: TruthValue, evidence: number): TruthValue {
  const newEvidence = evidence > 0.5 ? 1 : 0;
  const currentCount = current.confidence / (1 - current.confidence + 0.001); // Approximate count
  
  const newCount = currentCount + 1;
  const newPositive = current.strength * currentCount + newEvidence;
  
  return {
    strength: newPositive / newCount,
    confidence: Math.min(1.0, newCount / (newCount + 1))
  };
}

/**
 * Calculate attention spread between connected nodes
 */
export function calculateAttentionSpread(
  sourceAttention: AttentionValue,
  connectionStrength: number,
  spreadFactor: number = 0.3
): AttentionValue {
  return {
    shortTermImportance: sourceAttention.shortTermImportance * connectionStrength * spreadFactor,
    longTermImportance: sourceAttention.longTermImportance * connectionStrength * spreadFactor * 0.8,
    veryLongTermImportance: sourceAttention.veryLongTermImportance * connectionStrength * spreadFactor * 0.6
  };
}

/**
 * Decay attention values over time
 */
export function decayAttention(attention: AttentionValue, decayRate: number = 0.01): AttentionValue {
  return {
    shortTermImportance: Math.max(0, attention.shortTermImportance - decayRate),
    longTermImportance: Math.max(0, attention.longTermImportance - decayRate * 0.5),
    veryLongTermImportance: Math.max(0, attention.veryLongTermImportance - decayRate * 0.2)
  };
}

/**
 * Calculate semantic similarity between two cognitive nodes
 */
export function calculateSemanticSimilarity(node1: CognitiveNode, node2: CognitiveNode): number {
  // Simple Jaccard similarity based on connections and metadata
  const connections1 = new Set(node1.connections);
  const connections2 = new Set(node2.connections);
  
  const intersection = [...connections1].filter(x => connections2.has(x)).length;
  const union = new Set([...connections1, ...connections2]).size;
  
  const connectionSimilarity = union > 0 ? intersection / union : 0;
  
  // Name similarity (simple string comparison)
  const nameSimilarity = calculateStringSimilarity(node1.name, node2.name);
  
  // Type similarity
  const typeSimilarity = node1.type === node2.type ? 1 : 0;
  
  return (connectionSimilarity * 0.5 + nameSimilarity * 0.3 + typeSimilarity * 0.2);
}

/**
 * Calculate string similarity using Levenshtein distance
 */
export function calculateStringSimilarity(str1: string, str2: string): number {
  const maxLength = Math.max(str1.length, str2.length);
  if (maxLength === 0) return 1;
  
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return 1 - distance / maxLength;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array.from({ length: str1.length + 1 }, () => 
    Array.from({ length: str2.length + 1 }, () => 0)
  );
  
  for (let i = 0; i <= str1.length; i++) {
    matrix[i][0] = i;
  }
  
  for (let j = 0; j <= str2.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  
  return matrix[str1.length][str2.length];
}

/**
 * Normalize attention values to ensure they stay within bounds
 */
export function normalizeAttention(attention: AttentionValue): AttentionValue {
  return {
    shortTermImportance: Math.max(0, Math.min(1, attention.shortTermImportance)),
    longTermImportance: Math.max(0, Math.min(1, attention.longTermImportance)),
    veryLongTermImportance: Math.max(0, Math.min(1, attention.veryLongTermImportance))
  };
}

/**
 * Calculate pattern strength based on node involvement
 */
export function calculatePatternStrength(
  pattern: CognitivePattern,
  nodes: Map<string, CognitiveNode>
): number {
  const involvedNodes = pattern.nodeIds
    .map(id => nodes.get(id))
    .filter((node): node is CognitiveNode => node !== undefined);
  
  if (involvedNodes.length === 0) return 0;
  
  const avgTruthStrength = involvedNodes.reduce((sum, node) => 
    sum + node.truthValue.strength, 0
  ) / involvedNodes.length;
  
  const avgAttention = involvedNodes.reduce((sum, node) => 
    sum + node.attentionValue.shortTermImportance, 0
  ) / involvedNodes.length;
  
  const connectivity = calculateNodeConnectivity(involvedNodes);
  
  return (avgTruthStrength * 0.4 + avgAttention * 0.4 + connectivity * 0.2);
}

/**
 * Calculate connectivity density within a set of nodes
 */
export function calculateNodeConnectivity(nodes: CognitiveNode[]): number {
  if (nodes.length < 2) return 0;
  
  const nodeIds = new Set(nodes.map(n => n.id));
  let internalConnections = 0;
  
  nodes.forEach(node => {
    const internalConnectionCount = node.connections.filter(id => nodeIds.has(id)).length;
    internalConnections += internalConnectionCount;
  });
  
  // Each connection is counted twice (once for each endpoint), so divide by 2
  const actualConnections = internalConnections / 2;
  const maxPossibleConnections = (nodes.length * (nodes.length - 1)) / 2;
  
  return maxPossibleConnections > 0 ? actualConnections / maxPossibleConnections : 0;
}

/**
 * Generate a cognitive fingerprint for a node (for similarity matching)
 */
export function generateCognitiveFingerprint(node: CognitiveNode): string {
  const features = [
    node.type,
    node.name.substring(0, 10),
    Math.floor(node.truthValue.strength * 100).toString(),
    Math.floor(node.truthValue.confidence * 100).toString(),
    Math.floor(node.attentionValue.shortTermImportance * 100).toString(),
    node.connections.length.toString()
  ];
  
  return features.join('|');
}

/**
 * Calculate cognitive distance between two nodes
 */
export function calculateCognitiveDistance(node1: CognitiveNode, node2: CognitiveNode): number {
  const truthDistance = Math.abs(node1.truthValue.strength - node2.truthValue.strength);
  const confidenceDistance = Math.abs(node1.truthValue.confidence - node2.truthValue.confidence);
  const attentionDistance = Math.abs(
    node1.attentionValue.shortTermImportance - node2.attentionValue.shortTermImportance
  );
  
  return (truthDistance + confidenceDistance + attentionDistance) / 3;
}

/**
 * Find most similar nodes to a given node
 */
export function findSimilarNodes(
  targetNode: CognitiveNode,
  nodePool: CognitiveNode[],
  topK: number = 5
): Array<{ node: CognitiveNode; similarity: number }> {
  const similarities = nodePool
    .filter(node => node.id !== targetNode.id)
    .map(node => ({
      node,
      similarity: calculateSemanticSimilarity(targetNode, node)
    }))
    .sort((a, b) => b.similarity - a.similarity);
  
  return similarities.slice(0, topK);
}

/**
 * Calculate system entropy (measure of disorder/uncertainty)
 */
export function calculateSystemEntropy(nodes: CognitiveNode[]): number {
  if (nodes.length === 0) return 0;
  
  // Calculate entropy based on attention distribution
  const attentionValues = nodes.map(n => n.attentionValue.shortTermImportance);
  const sum = attentionValues.reduce((acc, val) => acc + val, 0);
  
  if (sum === 0) return Math.log(nodes.length); // Maximum entropy
  
  const probabilities = attentionValues.map(val => val / sum);
  const entropy = -probabilities.reduce((acc, p) => {
    if (p > 0) {
      return acc + p * Math.log(p);
    }
    return acc;
  }, 0);
  
  return entropy;
}

/**
 * Detect cognitive clusters based on connection patterns
 */
export function detectCognitiveClusters(
  nodes: CognitiveNode[],
  minClusterSize: number = 3
): CognitiveNode[][] {
  const clusters: CognitiveNode[][] = [];
  const visited = new Set<string>();
  
  nodes.forEach(node => {
    if (visited.has(node.id)) return;
    
    const cluster = exploreCluster(node, nodes, visited);
    if (cluster.length >= minClusterSize) {
      clusters.push(cluster);
    }
  });
  
  return clusters;
}

/**
 * Explore a cluster starting from a node using DFS
 */
function exploreCluster(
  startNode: CognitiveNode,
  allNodes: CognitiveNode[],
  visited: Set<string>
): CognitiveNode[] {
  const cluster: CognitiveNode[] = [];
  const stack = [startNode];
  const nodeMap = new Map(allNodes.map(n => [n.id, n]));
  
  while (stack.length > 0) {
    const currentNode = stack.pop()!;
    
    if (visited.has(currentNode.id)) continue;
    
    visited.add(currentNode.id);
    cluster.push(currentNode);
    
    // Add connected nodes to stack
    currentNode.connections.forEach(connectedId => {
      const connectedNode = nodeMap.get(connectedId);
      if (connectedNode && !visited.has(connectedId)) {
        stack.push(connectedNode);
      }
    });
  }
  
  return cluster;
}

/**
 * Calculate emergence score for a set of nodes
 */
export function calculateEmergenceScore(
  nodes: CognitiveNode[],
  patterns: CognitivePattern[]
): number {
  const nodeIds = new Set(nodes.map(n => n.id));
  const relevantPatterns = patterns.filter(p => 
    p.nodeIds.some(id => nodeIds.has(id))
  );
  
  if (relevantPatterns.length === 0) return 0;
  
  const avgPatternStrength = relevantPatterns.reduce((sum, p) => sum + p.strength, 0) / relevantPatterns.length;
  const connectivity = calculateNodeConnectivity(nodes);
  const diversity = calculateNodeDiversity(nodes);
  
  return (avgPatternStrength * 0.4 + connectivity * 0.3 + diversity * 0.3);
}

/**
 * Calculate diversity in a set of nodes
 */
function calculateNodeDiversity(nodes: CognitiveNode[]): number {
  const types = new Set(nodes.map(n => n.type));
  const uniqueNames = new Set(nodes.map(n => n.name));
  
  const typesDiversity = types.size / 4; // Assuming 4 possible types
  const namesDiversity = uniqueNames.size / nodes.length;
  
  return (typesDiversity + namesDiversity) / 2;
}