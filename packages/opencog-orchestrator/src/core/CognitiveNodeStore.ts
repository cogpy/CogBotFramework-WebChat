import { BehaviorSubject, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import type { 
  CognitiveNode, 
  TruthValue, 
  AttentionValue,
  CognitivePattern,
  SynergyDynamics 
} from '../types';

export class CognitiveNodeStore {
  private nodes = new Map<string, CognitiveNode>();
  private patterns = new Map<string, CognitivePattern>();
  private nodesSubject = new BehaviorSubject<Map<string, CognitiveNode>>(new Map());
  private patternsSubject = new BehaviorSubject<Map<string, CognitivePattern>>(new Map());

  constructor() {
    this.initializeFoundationalNodes();
  }

  /**
   * Initialize foundational cognitive nodes that form the base of the architecture
   */
  private initializeFoundationalNodes(): void {
    const foundationalNodes: Partial<CognitiveNode>[] = [
      {
        id: 'self-awareness',
        type: 'concept',
        name: 'SelfAwareness',
        truthValue: { strength: 0.8, confidence: 0.9 },
        attentionValue: { shortTermImportance: 0.9, longTermImportance: 0.8, veryLongTermImportance: 0.9 }
      },
      {
        id: 'user-intent',
        type: 'concept', 
        name: 'UserIntent',
        truthValue: { strength: 0.7, confidence: 0.8 },
        attentionValue: { shortTermImportance: 0.8, longTermImportance: 0.6, veryLongTermImportance: 0.5 }
      },
      {
        id: 'conversation-context',
        type: 'concept',
        name: 'ConversationContext',
        truthValue: { strength: 0.9, confidence: 0.8 },
        attentionValue: { shortTermImportance: 1.0, longTermImportance: 0.7, veryLongTermImportance: 0.6 }
      },
      {
        id: 'adaptive-learning',
        type: 'schema',
        name: 'AdaptiveLearning',
        truthValue: { strength: 0.6, confidence: 0.7 },
        attentionValue: { shortTermImportance: 0.5, longTermImportance: 0.9, veryLongTermImportance: 0.8 }
      },
      {
        id: 'pattern-recognition',
        type: 'schema',
        name: 'PatternRecognition', 
        truthValue: { strength: 0.8, confidence: 0.9 },
        attentionValue: { shortTermImportance: 0.7, longTermImportance: 0.8, veryLongTermImportance: 0.7 }
      }
    ];

    foundationalNodes.forEach(nodeData => {
      const node: CognitiveNode = {
        id: nodeData.id!,
        type: nodeData.type!,
        name: nodeData.name!,
        truthValue: nodeData.truthValue!,
        attentionValue: nodeData.attentionValue!,
        connections: [],
        metadata: { foundational: true },
        created: new Date(),
        lastUpdated: new Date()
      };
      this.addNode(node);
    });

    // Create foundational connections
    this.createConnection('self-awareness', 'user-intent', 0.7);
    this.createConnection('user-intent', 'conversation-context', 0.8);
    this.createConnection('conversation-context', 'adaptive-learning', 0.6);
    this.createConnection('adaptive-learning', 'pattern-recognition', 0.9);
    this.createConnection('pattern-recognition', 'self-awareness', 0.5);
  }

  /**
   * Add a new cognitive node to the store
   */
  addNode(node: CognitiveNode): void {
    this.nodes.set(node.id, { ...node, lastUpdated: new Date() });
    this.nodesSubject.next(new Map(this.nodes));
    this.detectEmergentPatterns();
  }

  /**
   * Update an existing cognitive node
   */
  updateNode(id: string, updates: Partial<CognitiveNode>): void {
    const existingNode = this.nodes.get(id);
    if (existingNode) {
      const updatedNode = { ...existingNode, ...updates, lastUpdated: new Date() };
      this.nodes.set(id, updatedNode);
      this.nodesSubject.next(new Map(this.nodes));
      this.updateAttentionValues(id);
    }
  }

  /**
   * Get a node by ID
   */
  getNode(id: string): CognitiveNode | undefined {
    return this.nodes.get(id);
  }

  /**
   * Get all nodes
   */
  getAllNodes(): CognitiveNode[] {
    return Array.from(this.nodes.values());
  }

  /**
   * Query nodes by type and criteria
   */
  queryNodes(
    type?: CognitiveNode['type'], 
    minAttention?: number, 
    minTruth?: number
  ): CognitiveNode[] {
    return Array.from(this.nodes.values()).filter(node => {
      if (type && node.type !== type) return false;
      if (minAttention && node.attentionValue.shortTermImportance < minAttention) return false;
      if (minTruth && node.truthValue.strength < minTruth) return false;
      return true;
    });
  }

  /**
   * Create a connection between two nodes
   */
  createConnection(nodeId1: string, nodeId2: string, strength: number): void {
    const node1 = this.nodes.get(nodeId1);
    const node2 = this.nodes.get(nodeId2);
    
    if (node1 && node2) {
      if (!node1.connections.includes(nodeId2)) {
        node1.connections.push(nodeId2);
      }
      if (!node2.connections.includes(nodeId1)) {
        node2.connections.push(nodeId1);
      }
      
      // Create connection metadata
      node1.metadata[`connection_${nodeId2}`] = { strength, created: new Date() };
      node2.metadata[`connection_${nodeId1}`] = { strength, created: new Date() };
      
      this.nodesSubject.next(new Map(this.nodes));
    }
  }

  /**
   * Update attention values based on usage and connections
   */
  private updateAttentionValues(nodeId: string): void {
    const node = this.nodes.get(nodeId);
    if (!node) return;

    // Increase short-term importance on recent access
    node.attentionValue.shortTermImportance = Math.min(1.0, 
      node.attentionValue.shortTermImportance + 0.1
    );

    // Spread activation to connected nodes
    node.connections.forEach(connectedId => {
      const connectedNode = this.nodes.get(connectedId);
      if (connectedNode) {
        const connectionStrength = node.metadata[`connection_${connectedId}`]?.strength || 0.5;
        const activationSpread = node.attentionValue.shortTermImportance * connectionStrength * 0.3;
        
        connectedNode.attentionValue.shortTermImportance = Math.min(1.0,
          connectedNode.attentionValue.shortTermImportance + activationSpread
        );
      }
    });
  }

  /**
   * Detect emergent patterns in the cognitive network
   */
  private detectEmergentPatterns(): void {
    const nodes = Array.from(this.nodes.values());
    const highAttentionNodes = nodes.filter(n => n.attentionValue.shortTermImportance > 0.7);
    
    if (highAttentionNodes.length >= 3) {
      const patternId = `emergent_${Date.now()}`;
      const pattern: CognitivePattern = {
        id: patternId,
        type: 'emergence',
        strength: this.calculatePatternStrength(highAttentionNodes),
        frequency: 1,
        lastObserved: new Date(),
        nodeIds: highAttentionNodes.map(n => n.id)
      };
      
      this.patterns.set(patternId, pattern);
      this.patternsSubject.next(new Map(this.patterns));
    }
  }

  /**
   * Calculate the strength of a cognitive pattern
   */
  private calculatePatternStrength(nodes: CognitiveNode[]): number {
    const avgAttention = nodes.reduce((sum, node) => 
      sum + node.attentionValue.shortTermImportance, 0
    ) / nodes.length;
    
    const avgTruth = nodes.reduce((sum, node) => 
      sum + node.truthValue.strength, 0
    ) / nodes.length;
    
    const connectionDensity = this.calculateConnectionDensity(nodes);
    
    return (avgAttention * 0.4 + avgTruth * 0.3 + connectionDensity * 0.3);
  }

  /**
   * Calculate connection density within a set of nodes
   */
  private calculateConnectionDensity(nodes: CognitiveNode[]): number {
    const nodeIds = new Set(nodes.map(n => n.id));
    let connections = 0;
    let possible = 0;
    
    nodes.forEach(node => {
      const internalConnections = node.connections.filter(id => nodeIds.has(id));
      connections += internalConnections.length;
      possible += nodes.length - 1;
    });
    
    return possible > 0 ? connections / possible : 0;
  }

  /**
   * Calculate current synergy dynamics
   */
  calculateSynergyDynamics(): SynergyDynamics {
    const nodes = Array.from(this.nodes.values());
    const patterns = Array.from(this.patterns.values());
    
    const coherence = this.calculateCoherence(nodes);
    const complexity = this.calculateComplexity(nodes, patterns);
    const adaptability = this.calculateAdaptability(nodes);
    const emergence = this.calculateEmergence(patterns);
    
    return { coherence, complexity, adaptability, emergence };
  }

  /**
   * Calculate system coherence
   */
  private calculateCoherence(nodes: CognitiveNode[]): number {
    const avgTruthConfidence = nodes.reduce((sum, node) => 
      sum + node.truthValue.confidence, 0
    ) / nodes.length;
    
    const attentionVariance = this.calculateAttentionVariance(nodes);
    const coherence = avgTruthConfidence * (1 - attentionVariance);
    
    return Math.max(0, Math.min(1, coherence));
  }

  /**
   * Calculate attention variance as a measure of system stability
   */
  private calculateAttentionVariance(nodes: CognitiveNode[]): number {
    const attentions = nodes.map(n => n.attentionValue.shortTermImportance);
    const mean = attentions.reduce((sum, val) => sum + val, 0) / attentions.length;
    const variance = attentions.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / attentions.length;
    return Math.sqrt(variance);
  }

  /**
   * Calculate system complexity
   */
  private calculateComplexity(nodes: CognitiveNode[], patterns: CognitivePattern[]): number {
    const nodeComplexity = nodes.length / 100; // Normalized by expected max
    const patternComplexity = patterns.length / 50;
    const connectionComplexity = nodes.reduce((sum, node) => sum + node.connections.length, 0) / (nodes.length * 10);
    
    return Math.min(1, (nodeComplexity + patternComplexity + connectionComplexity) / 3);
  }

  /**
   * Calculate system adaptability
   */
  private calculateAdaptability(nodes: CognitiveNode[]): number {
    const recentUpdates = nodes.filter(node => 
      Date.now() - node.lastUpdated.getTime() < 60000 // Within last minute
    ).length;
    
    const adaptabilityScore = recentUpdates / nodes.length;
    return Math.min(1, adaptabilityScore);
  }

  /**
   * Calculate emergence level
   */
  private calculateEmergence(patterns: CognitivePattern[]): number {
    const emergentPatterns = patterns.filter(p => p.type === 'emergence');
    const avgStrength = emergentPatterns.reduce((sum, p) => sum + p.strength, 0) / 
                      (emergentPatterns.length || 1);
    
    return Math.min(1, avgStrength);
  }

  /**
   * Observable stream of nodes
   */
  getNodesStream(): Observable<CognitiveNode[]> {
    return this.nodesSubject.asObservable().pipe(
      map(nodeMap => Array.from(nodeMap.values()))
    );
  }

  /**
   * Observable stream of patterns
   */
  getPatternsStream(): Observable<CognitivePattern[]> {
    return this.patternsSubject.asObservable().pipe(
      map(patternMap => Array.from(patternMap.values()))
    );
  }

  /**
   * Observable stream of high-attention nodes
   */
  getActiveNodesStream(minAttention: number = 0.7): Observable<CognitiveNode[]> {
    return this.getNodesStream().pipe(
      map(nodes => nodes.filter(node => node.attentionValue.shortTermImportance >= minAttention))
    );
  }
}