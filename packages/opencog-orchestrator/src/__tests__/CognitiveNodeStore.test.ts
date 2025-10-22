import { CognitiveNodeStore } from '../core/CognitiveNodeStore';
import type { CognitiveNode } from '../types';

describe('CognitiveNodeStore', () => {
  let store: CognitiveNodeStore;

  beforeEach(() => {
    store = new CognitiveNodeStore();
  });

  describe('initialization', () => {
    it('should initialize with foundational nodes', () => {
      const nodes = store.getAllNodes();
      expect(nodes.length).toBeGreaterThan(0);
      
      // Check for foundational nodes
      const foundationalNodes = nodes.filter(n => n.metadata.foundational === true);
      expect(foundationalNodes.length).toBeGreaterThan(0);
    });

    it('should have proper foundational connections', () => {
      const nodes = store.getAllNodes();
      const connectedNodes = nodes.filter(n => n.connections.length > 0);
      expect(connectedNodes.length).toBeGreaterThan(0);
    });
  });

  describe('node management', () => {
    it('should add new nodes', () => {
      const initialCount = store.getAllNodes().length;
      
      const newNode: CognitiveNode = {
        id: 'test-node-1',
        type: 'concept',
        name: 'TestConcept',
        truthValue: { strength: 0.8, confidence: 0.7 },
        attentionValue: { shortTermImportance: 0.6, longTermImportance: 0.4, veryLongTermImportance: 0.2 },
        connections: [],
        metadata: { test: true },
        created: new Date(),
        lastUpdated: new Date()
      };

      store.addNode(newNode);
      
      const finalCount = store.getAllNodes().length;
      expect(finalCount).toBe(initialCount + 1);
      
      const retrievedNode = store.getNode('test-node-1');
      expect(retrievedNode).toBeDefined();
      expect(retrievedNode!.name).toBe('TestConcept');
    });

    it('should update existing nodes', () => {
      const newNode: CognitiveNode = {
        id: 'update-test-node',
        type: 'concept',
        name: 'OriginalName',
        truthValue: { strength: 0.5, confidence: 0.5 },
        attentionValue: { shortTermImportance: 0.3, longTermImportance: 0.3, veryLongTermImportance: 0.3 },
        connections: [],
        metadata: {},
        created: new Date(),
        lastUpdated: new Date()
      };

      store.addNode(newNode);
      
      store.updateNode('update-test-node', {
        name: 'UpdatedName',
        truthValue: { strength: 0.9, confidence: 0.8 }
      });

      const updatedNode = store.getNode('update-test-node');
      expect(updatedNode!.name).toBe('UpdatedName');
      expect(updatedNode!.truthValue.strength).toBe(0.9);
      expect(updatedNode!.truthValue.confidence).toBe(0.8);
    });

    it('should query nodes by criteria', () => {
      // Add test nodes with different properties
      const conceptNode: CognitiveNode = {
        id: 'concept-test',
        type: 'concept',
        name: 'ConceptTest',
        truthValue: { strength: 0.9, confidence: 0.8 },
        attentionValue: { shortTermImportance: 0.9, longTermImportance: 0.5, veryLongTermImportance: 0.3 },
        connections: [],
        metadata: {},
        created: new Date(),
        lastUpdated: new Date()
      };

      const schemaNode: CognitiveNode = {
        id: 'schema-test',
        type: 'schema',
        name: 'SchemaTest',
        truthValue: { strength: 0.6, confidence: 0.7 },
        attentionValue: { shortTermImportance: 0.4, longTermImportance: 0.6, veryLongTermImportance: 0.5 },
        connections: [],
        metadata: {},
        created: new Date(),
        lastUpdated: new Date()
      };

      store.addNode(conceptNode);
      store.addNode(schemaNode);

      // Query by type
      const conceptNodes = store.queryNodes('concept');
      expect(conceptNodes.some(n => n.id === 'concept-test')).toBe(true);

      // Query by attention
      const highAttentionNodes = store.queryNodes(undefined, 0.8);
      expect(highAttentionNodes.some(n => n.id === 'concept-test')).toBe(true);
      expect(highAttentionNodes.some(n => n.id === 'schema-test')).toBe(false);

      // Query by truth value
      const highTruthNodes = store.queryNodes(undefined, undefined, 0.8);
      expect(highTruthNodes.some(n => n.id === 'concept-test')).toBe(true);
      expect(highTruthNodes.some(n => n.id === 'schema-test')).toBe(false);
    });
  });

  describe('connections', () => {
    it('should create connections between nodes', () => {
      const node1: CognitiveNode = {
        id: 'connection-test-1',
        type: 'concept',
        name: 'Node1',
        truthValue: { strength: 0.7, confidence: 0.6 },
        attentionValue: { shortTermImportance: 0.5, longTermImportance: 0.4, veryLongTermImportance: 0.3 },
        connections: [],
        metadata: {},
        created: new Date(),
        lastUpdated: new Date()
      };

      const node2: CognitiveNode = {
        id: 'connection-test-2',
        type: 'concept',
        name: 'Node2',
        truthValue: { strength: 0.8, confidence: 0.7 },
        attentionValue: { shortTermImportance: 0.6, longTermImportance: 0.5, veryLongTermImportance: 0.4 },
        connections: [],
        metadata: {},
        created: new Date(),
        lastUpdated: new Date()
      };

      store.addNode(node1);
      store.addNode(node2);

      store.createConnection('connection-test-1', 'connection-test-2', 0.8);

      const updatedNode1 = store.getNode('connection-test-1')!;
      const updatedNode2 = store.getNode('connection-test-2')!;

      expect(updatedNode1.connections).toContain('connection-test-2');
      expect(updatedNode2.connections).toContain('connection-test-1');
      expect(updatedNode1.metadata['connection_connection-test-2']).toBeDefined();
      expect(updatedNode2.metadata['connection_connection-test-1']).toBeDefined();
    });
  });

  describe('synergy dynamics', () => {
    it('should calculate synergy dynamics', () => {
      const dynamics = store.calculateSynergyDynamics();
      
      expect(dynamics).toBeDefined();
      expect(typeof dynamics.coherence).toBe('number');
      expect(typeof dynamics.complexity).toBe('number');
      expect(typeof dynamics.adaptability).toBe('number');
      expect(typeof dynamics.emergence).toBe('number');

      // All values should be between 0 and 1
      expect(dynamics.coherence).toBeGreaterThanOrEqual(0);
      expect(dynamics.coherence).toBeLessThanOrEqual(1);
      expect(dynamics.complexity).toBeGreaterThanOrEqual(0);
      expect(dynamics.complexity).toBeLessThanOrEqual(1);
      expect(dynamics.adaptability).toBeGreaterThanOrEqual(0);
      expect(dynamics.adaptability).toBeLessThanOrEqual(1);
      expect(dynamics.emergence).toBeGreaterThanOrEqual(0);
      expect(dynamics.emergence).toBeLessThanOrEqual(1);
    });
  });

  describe('streams', () => {
    it('should provide observable streams of nodes', (done) => {
      store.getNodesStream().subscribe(nodes => {
        expect(Array.isArray(nodes)).toBe(true);
        expect(nodes.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should provide observable streams of patterns', (done) => {
      store.getPatternsStream().subscribe(patterns => {
        expect(Array.isArray(patterns)).toBe(true);
        done();
      });
    });

    it('should provide active nodes stream', (done) => {
      store.getActiveNodesStream(0.5).subscribe(activeNodes => {
        expect(Array.isArray(activeNodes)).toBe(true);
        done();
      });
    });
  });

  describe('pattern detection', () => {
    it('should detect emergent patterns with high attention nodes', () => {
      // Add multiple high attention nodes
      for (let i = 0; i < 5; i++) {
        const node: CognitiveNode = {
          id: `high-attention-${i}`,
          type: 'concept',
          name: `HighAttention${i}`,
          truthValue: { strength: 0.8, confidence: 0.7 },
          attentionValue: { shortTermImportance: 0.9, longTermImportance: 0.6, veryLongTermImportance: 0.4 },
          connections: [],
          metadata: {},
          created: new Date(),
          lastUpdated: new Date()
        };
        store.addNode(node);
      }

      // Wait a bit for pattern detection to occur
      setTimeout(() => {
        store.getPatternsStream().subscribe(patterns => {
          const emergentPatterns = patterns.filter(p => p.type === 'emergence');
          expect(emergentPatterns.length).toBeGreaterThan(0);
        });
      }, 100);
    });
  });
});