import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import type { 
  ArchitectureGenesis, 
  Mutation, 
  EmergentProperty,
  CognitiveNode,
  SynergyDynamics,
  AutonomousAgent
} from '../types';
import { CognitiveNodeStore } from './CognitiveNodeStore';
import { AutonomousAgentManager } from './AutonomousAgentManager';

export class ArchitectureGenesisEngine {
  private generations = new Map<string, ArchitectureGenesis>();
  private generationsSubject = new BehaviorSubject<Map<string, ArchitectureGenesis>>(new Map());
  private currentGeneration = 0;
  private mutationRate = 0.1;
  private selectionPressure = 0.8;
  private emergentThreshold = 0.7;

  constructor(
    private cognitiveStore: CognitiveNodeStore,
    private agentManager: AutonomousAgentManager
  ) {
    this.initializeFoundationalArchitecture();
    this.startEvolutionaryProcess();
  }

  /**
   * Initialize the foundational architecture as generation 0
   */
  private initializeFoundationalArchitecture(): void {
    const foundationalGenesis: ArchitectureGenesis = {
      generation: 0,
      fitness: 0.5,
      mutations: [],
      parentArchitectures: [],
      emergentProperties: [
        {
          name: 'BasicCognition',
          type: 'functional',
          strength: 0.6,
          stability: 0.8,
          novelty: 0.2
        },
        {
          name: 'AutonomousOperation',
          type: 'behavioral',
          strength: 0.5,
          stability: 0.7,
          novelty: 0.3
        }
      ]
    };

    this.generations.set('gen_0', foundationalGenesis);
    this.generationsSubject.next(new Map(this.generations));
  }

  /**
   * Start the evolutionary process
   */
  private startEvolutionaryProcess(): void {
    // Evolution cycle every 2 minutes
    interval(120000).subscribe(() => {
      this.evolveArchitecture();
    });

    // Fitness evaluation every 30 seconds
    interval(30000).subscribe(() => {
      this.evaluateCurrentFitness();
    });

    // Emergence detection every 45 seconds
    interval(45000).subscribe(() => {
      this.detectEmergentProperties();
    });
  }

  /**
   * Main evolution function
   */
  private evolveArchitecture(): void {
    const currentFitness = this.evaluateCurrentFitness();
    
    if (this.shouldEvolve(currentFitness)) {
      const newGeneration = this.generateNewArchitecture(currentFitness);
      this.currentGeneration++;
      
      const generationId = `gen_${this.currentGeneration}`;
      this.generations.set(generationId, newGeneration);
      this.generationsSubject.next(new Map(this.generations));
      
      this.applyArchitecturalMutations(newGeneration);
    }
  }

  /**
   * Determine if evolution should occur based on fitness and conditions
   */
  private shouldEvolve(currentFitness: number): boolean {
    // Evolve if fitness is below threshold or randomly for exploration
    const fitnessThreshold = 0.75;
    const explorationChance = 0.1;
    
    return currentFitness < fitnessThreshold || Math.random() < explorationChance;
  }

  /**
   * Evaluate current architecture fitness
   */
  private evaluateCurrentFitness(): number {
    const synergyDynamics = this.cognitiveStore.calculateSynergyDynamics();
    const agents = this.agentManager.getAllAgents();
    
    // Calculate cognitive fitness
    const cognitiveFitness = (
      synergyDynamics.coherence * 0.3 +
      synergyDynamics.adaptability * 0.3 +
      synergyDynamics.emergence * 0.2 +
      (1 - synergyDynamics.complexity * 0.5) * 0.2 // Prefer manageable complexity
    );
    
    // Calculate agent fitness
    const agentFitness = this.calculateAgentFitness(agents);
    
    // Calculate overall fitness
    const overallFitness = (cognitiveFitness * 0.6 + agentFitness * 0.4);
    
    // Update current generation fitness
    const currentGenId = `gen_${this.currentGeneration}`;
    const currentGen = this.generations.get(currentGenId);
    if (currentGen) {
      currentGen.fitness = overallFitness;
    }
    
    return overallFitness;
  }

  /**
   * Calculate fitness based on agent performance
   */
  private calculateAgentFitness(agents: AutonomousAgent[]): number {
    if (agents.length === 0) return 0;
    
    const performanceScores = agents.map(agent => {
      const performance = agent.status.performance;
      const goalProgress = agent.goals.reduce((sum, goal) => sum + goal.progress, 0) / agent.goals.length;
      
      return (
        (1 - performance.errorRate) * 0.3 +
        performance.learningRate * 0.25 +
        performance.adaptationSpeed * 0.25 +
        goalProgress * 0.2
      );
    });
    
    return performanceScores.reduce((sum, score) => sum + score, 0) / performanceScores.length;
  }

  /**
   * Generate a new architecture through evolution
   */
  private generateNewArchitecture(parentFitness: number): ArchitectureGenesis {
    const parentGenId = `gen_${this.currentGeneration}`;
    const parentGen = this.generations.get(parentGenId);
    
    const mutations = this.generateMutations(parentFitness);
    const emergentProperties = this.evolvEmergentProperties(parentGen?.emergentProperties || []);
    
    const newGeneration: ArchitectureGenesis = {
      generation: this.currentGeneration + 1,
      fitness: parentFitness, // Will be updated through evaluation
      mutations,
      parentArchitectures: [parentGenId],
      emergentProperties
    };
    
    return newGeneration;
  }

  /**
   * Generate mutations based on current system state
   */
  private generateMutations(currentFitness: number): Mutation[] {
    const mutations: Mutation[] = [];
    const mutationTypes: Mutation['type'][] = ['structural', 'parametric', 'behavioral'];
    
    // Number of mutations inversely related to fitness
    const numMutations = Math.ceil((1 - currentFitness) * 5);
    
    for (let i = 0; i < numMutations; i++) {
      if (Math.random() < this.mutationRate) {
        const mutationType = mutationTypes[Math.floor(Math.random() * mutationTypes.length)];
        const mutation = this.createSpecificMutation(mutationType, currentFitness);
        mutations.push(mutation);
      }
    }
    
    return mutations;
  }

  /**
   * Create a specific type of mutation
   */
  private createSpecificMutation(type: Mutation['type'], currentFitness: number): Mutation {
    const mutationStrategies = {
      structural: [
        'add-cognitive-node',
        'modify-node-connections',
        'restructure-attention-network',
        'create-new-agent-capability'
      ],
      parametric: [
        'adjust-attention-weights',
        'modify-truth-thresholds',
        'tune-learning-rates',
        'optimize-synergy-parameters'
      ],
      behavioral: [
        'modify-agent-goals',
        'adjust-response-patterns',
        'enhance-adaptation-strategies',
        'improve-coordination-mechanisms'
      ]
    };
    
    const strategies = mutationStrategies[type];
    const selectedStrategy = strategies[Math.floor(Math.random() * strategies.length)];
    
    return {
      type,
      location: this.identifyMutationLocation(type),
      change: selectedStrategy,
      impact: (1 - currentFitness) * Math.random(),
      timestamp: new Date()
    };
  }

  /**
   * Identify where a mutation should be applied
   */
  private identifyMutationLocation(type: Mutation['type']): string {
    const locations = {
      structural: ['cognitive-node-store', 'agent-manager', 'synergy-dynamics'],
      parametric: ['attention-values', 'truth-values', 'learning-parameters'],
      behavioral: ['agent-goals', 'response-generation', 'adaptation-logic']
    };
    
    const typeLocations = locations[type];
    return typeLocations[Math.floor(Math.random() * typeLocations.length)];
  }

  /**
   * Evolve emergent properties from parent generation
   */
  private evolvEmergentProperties(parentProperties: EmergentProperty[]): EmergentProperty[] {
    const evolvedProperties = parentProperties.map(property => {
      // Evolve existing properties
      return {
        ...property,
        strength: Math.min(1.0, Math.max(0.0, property.strength + (Math.random() - 0.5) * 0.2)),
        stability: Math.min(1.0, Math.max(0.0, property.stability + (Math.random() - 0.5) * 0.1)),
        novelty: Math.max(0.0, property.novelty - 0.1) // Novelty decreases over time
      };
    });
    
    // Potentially add new emergent properties
    if (Math.random() < 0.3) { // 30% chance of new emergence
      const newProperty = this.generateNewEmergentProperty();
      evolvedProperties.push(newProperty);
    }
    
    return evolvedProperties.filter(property => property.strength > 0.1); // Remove weak properties
  }

  /**
   * Generate a new emergent property
   */
  private generateNewEmergentProperty(): EmergentProperty {
    const propertyNames = [
      'SelfOrganization',
      'CollectiveIntelligence', 
      'AdaptiveResilience',
      'CreativeInsight',
      'HolisticIntegration',
      'DynamicEquilibrium',
      'EmergentConsciousness',
      'AutonomousEvolution'
    ];
    
    const propertyTypes: EmergentProperty['type'][] = ['behavioral', 'structural', 'functional'];
    
    return {
      name: propertyNames[Math.floor(Math.random() * propertyNames.length)],
      type: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
      strength: Math.random() * 0.7 + 0.3, // 0.3 to 1.0
      stability: Math.random() * 0.5 + 0.2, // 0.2 to 0.7 (new properties start less stable)
      novelty: Math.random() * 0.8 + 0.2 // 0.2 to 1.0
    };
  }

  /**
   * Apply architectural mutations to the system
   */
  private applyArchitecturalMutations(generation: ArchitectureGenesis): void {
    generation.mutations.forEach(mutation => {
      this.applyMutation(mutation);
    });
  }

  /**
   * Apply a specific mutation to the system
   */
  private applyMutation(mutation: Mutation): void {
    switch (mutation.change) {
      case 'add-cognitive-node':
        this.addEvolutionaryCognitiveNode(mutation);
        break;
      case 'modify-node-connections':
        this.modifyNodeConnections(mutation);
        break;
      case 'adjust-attention-weights':
        this.adjustAttentionWeights(mutation);
        break;
      case 'modify-agent-goals':
        this.modifyAgentGoals(mutation);
        break;
      case 'enhance-adaptation-strategies':
        this.enhanceAdaptationStrategies(mutation);
        break;
      // Add more mutation implementations as needed
      default:
        console.log(`Mutation ${mutation.change} not yet implemented`);
    }
  }

  /**
   * Add a new cognitive node through evolution
   */
  private addEvolutionaryCognitiveNode(mutation: Mutation): void {
    const evolutionaryNode: CognitiveNode = {
      id: `evolution_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'concept',
      name: `EvolutionaryNode_${mutation.type}`,
      truthValue: { 
        strength: 0.5 + Math.random() * 0.3, 
        confidence: 0.6 + Math.random() * 0.2 
      },
      attentionValue: { 
        shortTermImportance: Math.random() * 0.5,
        longTermImportance: Math.random() * 0.7,
        veryLongTermImportance: Math.random() * 0.6
      },
      connections: [],
      metadata: { 
        evolutionary: true,
        generation: this.currentGeneration,
        mutationType: mutation.type,
        impact: mutation.impact
      },
      created: new Date(),
      lastUpdated: new Date()
    };
    
    this.cognitiveStore.addNode(evolutionaryNode);
  }

  /**
   * Modify connections between nodes
   */
  private modifyNodeConnections(mutation: Mutation): void {
    const nodes = this.cognitiveStore.getAllNodes();
    if (nodes.length < 2) return;
    
    const node1 = nodes[Math.floor(Math.random() * nodes.length)];
    const node2 = nodes[Math.floor(Math.random() * nodes.length)];
    
    if (node1.id !== node2.id) {
      const connectionStrength = 0.3 + Math.random() * 0.4; // 0.3 to 0.7
      this.cognitiveStore.createConnection(node1.id, node2.id, connectionStrength);
    }
  }

  /**
   * Adjust attention weights across the system
   */
  private adjustAttentionWeights(mutation: Mutation): void {
    const nodes = this.cognitiveStore.getAllNodes();
    const adjustmentFactor = (Math.random() - 0.5) * 0.2; // -0.1 to 0.1
    
    nodes.forEach(node => {
      const newAttention = {
        shortTermImportance: Math.max(0, Math.min(1, 
          node.attentionValue.shortTermImportance + adjustmentFactor
        )),
        longTermImportance: Math.max(0, Math.min(1,
          node.attentionValue.longTermImportance + adjustmentFactor * 0.5
        )),
        veryLongTermImportance: Math.max(0, Math.min(1,
          node.attentionValue.veryLongTermImportance + adjustmentFactor * 0.3
        ))
      };
      
      this.cognitiveStore.updateNode(node.id, { attentionValue: newAttention });
    });
  }

  /**
   * Modify agent goals through evolution
   */
  private modifyAgentGoals(mutation: Mutation): void {
    const agents = this.agentManager.getAllAgents();
    
    agents.forEach(agent => {
      const modifiedGoals = agent.goals.map(goal => ({
        ...goal,
        priority: Math.max(0.1, Math.min(1.0, goal.priority + (Math.random() - 0.5) * 0.2))
      }));
      
      // Potentially add new evolutionary goal
      if (Math.random() < 0.3) {
        const newGoal = {
          id: `evolutionary_goal_${Date.now()}`,
          description: `Evolutionary objective: ${mutation.change}`,
          priority: 0.3 + Math.random() * 0.4,
          status: 'active' as const,
          progress: 0,
          deadline: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        };
        modifiedGoals.push(newGoal);
      }
      
      this.agentManager.updateAgent(agent.id, { goals: modifiedGoals });
    });
  }

  /**
   * Enhance adaptation strategies
   */
  private enhanceAdaptationStrategies(mutation: Mutation): void {
    const adaptiveAgent = this.agentManager.getAgent('adaptive-learner');
    if (adaptiveAgent) {
      const enhancedCapabilities = adaptiveAgent.capabilities.map(capability => ({
        ...capability,
        strength: Math.min(1.0, capability.strength + mutation.impact * 0.1)
      }));
      
      this.agentManager.updateAgent(adaptiveAgent.id, { capabilities: enhancedCapabilities });
    }
  }

  /**
   * Detect emergent properties in the current system
   */
  private detectEmergentProperties(): void {
    const synergyDynamics = this.cognitiveStore.calculateSynergyDynamics();
    
    if (synergyDynamics.emergence > this.emergentThreshold) {
      const currentGenId = `gen_${this.currentGeneration}`;
      const currentGen = this.generations.get(currentGenId);
      
      if (currentGen) {
        const newEmergentProperty: EmergentProperty = {
          name: `Emergence_${Date.now()}`,
          type: 'behavioral',
          strength: synergyDynamics.emergence,
          stability: synergyDynamics.coherence,
          novelty: 1.0 - synergyDynamics.complexity * 0.5
        };
        
        currentGen.emergentProperties.push(newEmergentProperty);
        this.generationsSubject.next(new Map(this.generations));
      }
    }
  }

  /**
   * Get the current generation
   */
  getCurrentGeneration(): ArchitectureGenesis | undefined {
    return this.generations.get(`gen_${this.currentGeneration}`);
  }

  /**
   * Get all generations
   */
  getAllGenerations(): ArchitectureGenesis[] {
    return Array.from(this.generations.values());
  }

  /**
   * Get observable stream of generations
   */
  getGenerationsStream(): Observable<ArchitectureGenesis[]> {
    return this.generationsSubject.asObservable().pipe(
      map(generationMap => Array.from(generationMap.values()))
    );
  }

  /**
   * Get evolution metrics
   */
  getEvolutionMetrics(): Observable<{
    currentGeneration: number;
    avgFitness: number;
    bestFitness: number;
    totalMutations: number;
    emergentPropertiesCount: number;
    evolutionSpeed: number;
  }> {
    return this.getGenerationsStream().pipe(
      map(generations => {
        const fitnesses = generations.map(gen => gen.fitness);
        const avgFitness = fitnesses.reduce((sum, fitness) => sum + fitness, 0) / fitnesses.length;
        const bestFitness = Math.max(...fitnesses);
        const totalMutations = generations.reduce((sum, gen) => sum + gen.mutations.length, 0);
        const emergentPropertiesCount = generations.reduce(
          (sum, gen) => sum + gen.emergentProperties.length, 0
        );
        const evolutionSpeed = generations.length > 1 ? 
          (bestFitness - fitnesses[0]) / generations.length : 0;
        
        return {
          currentGeneration: this.currentGeneration,
          avgFitness,
          bestFitness,
          totalMutations,
          emergentPropertiesCount,
          evolutionSpeed
        };
      })
    );
  }

  /**
   * Manual trigger for evolution (for testing or forced adaptation)
   */
  triggerEvolution(): void {
    this.evolveArchitecture();
  }

  /**
   * Adjust evolution parameters
   */
  configureEvolution(config: {
    mutationRate?: number;
    selectionPressure?: number;
    emergentThreshold?: number;
  }): void {
    if (config.mutationRate !== undefined) {
      this.mutationRate = Math.max(0, Math.min(1, config.mutationRate));
    }
    if (config.selectionPressure !== undefined) {
      this.selectionPressure = Math.max(0, Math.min(1, config.selectionPressure));
    }
    if (config.emergentThreshold !== undefined) {
      this.emergentThreshold = Math.max(0, Math.min(1, config.emergentThreshold));
    }
  }
}