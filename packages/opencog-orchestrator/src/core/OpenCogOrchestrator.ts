import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { combineLatest } from 'rxjs';
import { map, tap, switchMap, debounceTime } from 'rxjs/operators';
import type { 
  CognitiveSynergy,
  WebChatIntegration,
  BotActivity,
  UserContext,
  ConversationState,
  CognitiveProcessing,
  CognitiveEnhancement
} from '../types';
import { CognitiveNodeStore } from './CognitiveNodeStore';
import { AutonomousAgentManager } from './AutonomousAgentManager';
import { ArchitectureGenesisEngine } from './ArchitectureGenesis';

export interface OpenCogConfig {
  enableAutogenesis?: boolean;
  enableCognitiveSynergy?: boolean;
  enableAdaptiveLearning?: boolean;
  evolutionInterval?: number;
  synergyThreshold?: number;
  adaptationRate?: number;
}

export class OpenCogOrchestrator {
  private cognitiveStore!: CognitiveNodeStore;
  private agentManager!: AutonomousAgentManager;
  private genesisEngine!: ArchitectureGenesisEngine;
  
  private activityStream = new Subject<BotActivity>();
  private userContextSubject = new BehaviorSubject<UserContext | null>(null);
  private conversationStateSubject = new BehaviorSubject<ConversationState>({
    contextNodes: [],
    emergentPatterns: [],
    adaptationHistory: []
  });
  
  private synergySubject = new BehaviorSubject<CognitiveSynergy>({
    nodes: [],
    patterns: [],
    dynamics: { coherence: 0.5, complexity: 0.3, adaptability: 0.4, emergence: 0.2 }
  });

  private config: Required<OpenCogConfig> = {
    enableAutogenesis: true,
    enableCognitiveSynergy: true,
    enableAdaptiveLearning: true,
    evolutionInterval: 120000, // 2 minutes
    synergyThreshold: 0.7,
    adaptationRate: 0.1
  };

  constructor(config?: Partial<OpenCogConfig>) {
    this.config = { ...this.config, ...config };
    
    this.initializeComponents();
    this.setupIntegrationStreams();
    this.startOrchestration();
  }

  /**
   * Initialize core components
   */
  private initializeComponents(): void {
    this.cognitiveStore = new CognitiveNodeStore();
    this.agentManager = new AutonomousAgentManager(this.cognitiveStore);
    
    if (this.config.enableAutogenesis) {
      this.genesisEngine = new ArchitectureGenesisEngine(
        this.cognitiveStore,
        this.agentManager
      );
    }
  }

  /**
   * Setup integration streams between components
   */
  private setupIntegrationStreams(): void {
    // Monitor cognitive synergy
    if (this.config.enableCognitiveSynergy) {
      this.setupCognitiveSynergyStream();
    }

    // Monitor agent activities and update conversation state
    this.agentManager.getAgentsStream()
      .pipe(debounceTime(1000))
      .subscribe(agents => {
        this.updateConversationStateFromAgents(agents);
      });

    // Process activities through agents
    this.activityStream
      .pipe(debounceTime(500))
      .subscribe(activity => {
        this.processActivityThroughSystem(activity);
      });
  }

  /**
   * Setup cognitive synergy monitoring
   */
  private setupCognitiveSynergyStream(): void {
    combineLatest([
      this.cognitiveStore.getNodesStream(),
      this.cognitiveStore.getPatternsStream()
    ]).pipe(
      map(([nodes, patterns]: [any[], any[]]) => {
        const dynamics = this.cognitiveStore.calculateSynergyDynamics();
        return { nodes, patterns, dynamics };
      }),
      tap((synergy: CognitiveSynergy) => this.synergySubject.next(synergy))
    ).subscribe();
  }

  /**
   * Start the main orchestration loop
   */
  private startOrchestration(): void {
    // Main orchestration cycle
    setInterval(() => {
      this.orchestrationCycle();
    }, 10000); // Every 10 seconds

    // Cognitive enhancement cycle
    setInterval(() => {
      this.enhanceCognitiveCapabilities();
    }, 30000); // Every 30 seconds
  }

  /**
   * Main orchestration cycle
   */
  private orchestrationCycle(): void {
    const synergy = this.synergySubject.value;
    
    // Check for emergent behaviors
    if (synergy.dynamics.emergence > this.config.synergyThreshold) {
      this.handleEmergentBehavior(synergy);
    }
    
    // Adaptive learning cycle
    if (this.config.enableAdaptiveLearning) {
      this.performAdaptiveLearning(synergy);
    }
    
    // Update conversation state
    this.updateConversationState();
  }

  /**
   * Handle emergent behavior detection
   */
  private handleEmergentBehavior(synergy: CognitiveSynergy): void {
    const emergentPatterns = synergy.patterns.filter(p => p.type === 'emergence');
    
    emergentPatterns.forEach(pattern => {
      // Create new cognitive capabilities based on emergent patterns
      const newCapability = {
        name: `emergent_${pattern.id}`,
        type: 'reasoning' as const,
        strength: pattern.strength,
        lastUsed: new Date()
      };
      
      // Add capability to adaptive agents
      const adaptiveAgent = this.agentManager.getAgent('adaptive-learner');
      if (adaptiveAgent) {
        const updatedCapabilities = [...adaptiveAgent.capabilities, newCapability];
        this.agentManager.updateAgent(adaptiveAgent.id, { capabilities: updatedCapabilities });
      }
    });
  }

  /**
   * Perform adaptive learning based on current synergy
   */
  private performAdaptiveLearning(synergy: CognitiveSynergy): void {
    const learningOpportunities = this.identifyLearningOpportunities(synergy);
    
    learningOpportunities.forEach(opportunity => {
      this.applyLearning(opportunity);
    });
  }

  /**
   * Identify learning opportunities from current synergy
   */
  private identifyLearningOpportunities(synergy: CognitiveSynergy): string[] {
    const opportunities: string[] = [];
    
    // Low coherence suggests need for better integration
    if (synergy.dynamics.coherence < 0.6) {
      opportunities.push('improve-coherence');
    }
    
    // High complexity without corresponding adaptability
    if (synergy.dynamics.complexity > 0.8 && synergy.dynamics.adaptability < 0.5) {
      opportunities.push('simplify-structure');
    }
    
    // Low emergence suggests need for more creative connections
    if (synergy.dynamics.emergence < 0.3) {
      opportunities.push('enhance-creativity');
    }
    
    return opportunities;
  }

  /**
   * Apply specific learning improvements
   */
  private applyLearning(opportunity: string): void {
    switch (opportunity) {
      case 'improve-coherence':
        this.improveSystemCoherence();
        break;
      case 'simplify-structure':
        this.simplifySystemStructure();
        break;
      case 'enhance-creativity':
        this.enhanceCreativity();
        break;
    }
  }

  /**
   * Improve system coherence
   */
  private improveSystemCoherence(): void {
    const nodes = this.cognitiveStore.getAllNodes();
    const lowConfidenceNodes = nodes.filter(n => n.truthValue.confidence < 0.5);
    
    lowConfidenceNodes.forEach(node => {
      const improvedTruthValue = {
        ...node.truthValue,
        confidence: Math.min(1.0, node.truthValue.confidence + this.config.adaptationRate)
      };
      this.cognitiveStore.updateNode(node.id, { truthValue: improvedTruthValue });
    });
  }

  /**
   * Simplify system structure
   */
  private simplifySystemStructure(): void {
    const nodes = this.cognitiveStore.getAllNodes();
    const overconnectedNodes = nodes.filter(n => n.connections.length > 5);
    
    // Reduce connections for overconnected nodes
    overconnectedNodes.forEach(node => {
      const reducedConnections = node.connections.slice(0, 5);
      this.cognitiveStore.updateNode(node.id, { connections: reducedConnections });
    });
  }

  /**
   * Enhance system creativity
   */
  private enhanceCreativity(): void {
    const nodes = this.cognitiveStore.getAllNodes();
    
    // Create random new connections to foster emergence
    for (let i = 0; i < 3; i++) {
      if (nodes.length >= 2) {
        const node1 = nodes[Math.floor(Math.random() * nodes.length)];
        const node2 = nodes[Math.floor(Math.random() * nodes.length)];
        
        if (node1.id !== node2.id && !node1.connections.includes(node2.id)) {
          this.cognitiveStore.createConnection(node1.id, node2.id, 0.3 + Math.random() * 0.4);
        }
      }
    }
  }

  /**
   * Process bot activity through the entire system
   */
  private processActivityThroughSystem(activity: BotActivity): void {
    // Process through agents
    this.agentManager.processActivity(activity);
    
    // Create cognitive processing
    const cognitiveProcessing = this.createCognitiveProcessing(activity);
    activity.cognitiveProcessing = cognitiveProcessing;
    
    // Update conversation state
    this.updateConversationStateFromActivity(activity);
  }

  /**
   * Create cognitive processing for an activity
   */
  private createCognitiveProcessing(activity: BotActivity): CognitiveProcessing {
    const activeNodes = this.cognitiveStore.queryNodes(undefined, 0.5);
    const synergy = this.synergySubject.value;
    
    return {
      analysis: {
        concepts: this.extractConcepts(activity),
        relations: this.extractRelations(activity, activeNodes),
        sentiment: this.analyzeSentiment(activity),
        complexity: this.calculateComplexity(activity),
        novelty: this.calculateNovelty(activity, activeNodes)
      },
      reasoning: {
        inferences: this.generateInferences(activity, activeNodes),
        confidence: synergy.dynamics.coherence,
        reasoningChain: this.buildReasoningChain(activity),
        uncertainty: 1 - synergy.dynamics.coherence
      },
      learning: {
        newKnowledge: this.extractNewKnowledge(activity),
        updatedNodes: activeNodes.slice(0, 3).map(n => n.id),
        learningRate: synergy.dynamics.adaptability,
        retention: synergy.dynamics.coherence
      },
      adaptation: {
        behaviorChanges: this.identifyBehaviorChanges(activity),
        parameterAdjustments: this.calculateParameterAdjustments(synergy),
        emergentCapabilities: this.identifyEmergentCapabilities(synergy),
        adaptationSuccess: synergy.dynamics.adaptability
      }
    };
  }

  /**
   * Extract concepts from activity
   */
  private extractConcepts(activity: BotActivity): string[] {
    const concepts: string[] = [];
    
    if (activity.text) {
      // Simple concept extraction based on keywords
      const keywords = activity.text.toLowerCase().match(/\b\w{4,}\b/g) || [];
      concepts.push(...keywords.slice(0, 5));
    }
    
    concepts.push(activity.type);
    return concepts;
  }

  /**
   * Extract relations from activity
   */
  private extractRelations(activity: BotActivity, nodes: any[]): string[] {
    return nodes.slice(0, 3).map(node => `relates_to_${node.name}`);
  }

  /**
   * Analyze sentiment of activity
   */
  private analyzeSentiment(activity: BotActivity): number {
    // Simple sentiment analysis
    if (!activity.text) return 0.5;
    
    const positiveWords = ['good', 'great', 'excellent', 'happy', 'yes'];
    const negativeWords = ['bad', 'terrible', 'sad', 'no', 'wrong'];
    
    let sentiment = 0.5;
    const words = activity.text.toLowerCase().split(' ');
    
    words.forEach(word => {
      if (positiveWords.includes(word)) sentiment += 0.1;
      if (negativeWords.includes(word)) sentiment -= 0.1;
    });
    
    return Math.max(0, Math.min(1, sentiment));
  }

  /**
   * Calculate complexity of activity
   */
  private calculateComplexity(activity: BotActivity): number {
    if (!activity.text) return 0.3;
    
    const wordCount = activity.text.split(' ').length;
    const uniqueWords = new Set(activity.text.toLowerCase().split(' ')).size;
    
    return Math.min(1, (wordCount / 50 + uniqueWords / wordCount) / 2);
  }

  /**
   * Calculate novelty of activity
   */
  private calculateNovelty(activity: BotActivity, nodes: any[]): number {
    const activityConcepts = this.extractConcepts(activity);
    const knownConcepts = nodes.map(n => n.name.toLowerCase());
    
    const novelConcepts = activityConcepts.filter(concept => 
      !knownConcepts.some(known => known.includes(concept))
    );
    
    return activityConcepts.length > 0 ? novelConcepts.length / activityConcepts.length : 0;
  }

  /**
   * Generate inferences from activity
   */
  private generateInferences(activity: BotActivity, nodes: any[]): string[] {
    const inferences: string[] = [];
    
    if (activity.type === 'message') {
      inferences.push('user_communication_intent');
    }
    
    if (nodes.some(n => n.name.includes('Intent'))) {
      inferences.push('context_continuity');
    }
    
    return inferences;
  }

  /**
   * Build reasoning chain
   */
  private buildReasoningChain(activity: BotActivity): string[] {
    return [
      `activity_received: ${activity.type}`,
      'context_analysis',
      'intent_recognition',
      'response_generation'
    ];
  }

  /**
   * Extract new knowledge from activity
   */
  private extractNewKnowledge(activity: BotActivity): any[] {
    // This would create new cognitive nodes based on the activity
    return [];
  }

  /**
   * Identify behavior changes needed
   */
  private identifyBehaviorChanges(activity: BotActivity): string[] {
    const changes: string[] = [];
    
    if (activity.cognitiveProcessing?.analysis.novelty && activity.cognitiveProcessing.analysis.novelty > 0.7) {
      changes.push('adapt_to_novel_input');
    }
    
    return changes;
  }

  /**
   * Calculate parameter adjustments
   */
  private calculateParameterAdjustments(synergy: CognitiveSynergy): Record<string, number> {
    return {
      attention_sensitivity: synergy.dynamics.emergence * 0.1,
      learning_rate: synergy.dynamics.adaptability * 0.05,
      connection_strength: synergy.dynamics.coherence * 0.08
    };
  }

  /**
   * Identify emergent capabilities
   */
  private identifyEmergentCapabilities(synergy: CognitiveSynergy): string[] {
    const capabilities: string[] = [];
    
    if (synergy.dynamics.emergence > 0.8) {
      capabilities.push('advanced_pattern_recognition');
    }
    
    if (synergy.dynamics.adaptability > 0.7) {
      capabilities.push('rapid_learning');
    }
    
    return capabilities;
  }

  /**
   * Update conversation state from agents
   */
  private updateConversationStateFromAgents(agents: any[]): void {
    const currentState = this.conversationStateSubject.value;
    
    const contextNodes = agents.reduce((nodes, agent) => {
      return [...nodes, ...agent.knowledge];
    }, []);
    
    this.conversationStateSubject.next({
      ...currentState,
      contextNodes: contextNodes.slice(0, 10) // Limit to prevent bloat
    });
  }

  /**
   * Update conversation state from activity
   */
  private updateConversationStateFromActivity(activity: BotActivity): void {
    const currentState = this.conversationStateSubject.value;
    
    const adaptationEvent = {
      timestamp: new Date(),
      type: 'context_shift' as const,
      description: `Activity: ${activity.type}`,
      impact: activity.cognitiveProcessing?.adaptation.adaptationSuccess || 0.5
    };
    
    this.conversationStateSubject.next({
      ...currentState,
      adaptationHistory: [adaptationEvent, ...currentState.adaptationHistory].slice(0, 20)
    });
  }

  /**
   * Update conversation state periodically
   */
  private updateConversationState(): void {
    const synergy = this.synergySubject.value;
    const currentState = this.conversationStateSubject.value;
    
    this.conversationStateSubject.next({
      ...currentState,
      emergentPatterns: synergy.patterns
    });
  }

  /**
   * Enhance cognitive capabilities
   */
  private enhanceCognitiveCapabilities(): void {
    const synergy = this.synergySubject.value;
    const enhancement: CognitiveEnhancement = {
      semanticUnderstanding: synergy.dynamics.coherence,
      contextAwareness: synergy.dynamics.complexity * 0.7,
      adaptiveResponse: synergy.dynamics.adaptability,
      emergentBehavior: synergy.dynamics.emergence
    };
    
    // Apply enhancements through agents
    const agents = this.agentManager.getAllAgents();
    agents.forEach(agent => {
      const enhancedCapabilities = agent.capabilities.map(capability => ({
        ...capability,
        strength: Math.min(1.0, capability.strength + enhancement.adaptiveResponse * 0.02)
      }));
      
      this.agentManager.updateAgent(agent.id, { capabilities: enhancedCapabilities });
    });
  }

  // Public API methods

  /**
   * Process a bot activity through OpenCog
   */
  processActivity(activity: BotActivity): Observable<BotActivity> {
    this.activityStream.next(activity);
    return new Observable(observer => {
      // Simulate processing time
      setTimeout(() => {
        observer.next(activity);
        observer.complete();
      }, 100);
    });
  }

  /**
   * Update user context
   */
  updateUserContext(context: UserContext): void {
    this.userContextSubject.next(context);
    
    // Create user profile node
    const userProfileNode = {
      id: `user_${context.userId}`,
      type: 'concept' as const,
      name: 'UserProfile',
      truthValue: { strength: 0.8, confidence: 0.9 },
      attentionValue: { shortTermImportance: 1.0, longTermImportance: 0.8, veryLongTermImportance: 0.6 },
      connections: [],
      metadata: { userId: context.userId, preferences: context.preferences },
      created: new Date(),
      lastUpdated: new Date()
    };
    
    this.cognitiveStore.addNode(userProfileNode);
  }

  /**
   * Get WebChat integration data
   */
  getWebChatIntegration(): Observable<WebChatIntegration> {
    return combineLatest([
      this.activityStream.asObservable(),
      this.userContextSubject.asObservable(),
      this.conversationStateSubject.asObservable()
    ]).pipe(
      map(([activity, userContext, conversationState]: [any, any, any]) => {
        const synergy = this.synergySubject.value;
        
        return {
          activities: [activity], // In real implementation, this would be a list
          userContext: userContext || {
            userId: 'anonymous',
            preferences: {},
            cognitiveProfile: {
              learningStyle: 'adaptive',
              preferredComplexity: 0.5,
              adaptationRate: 0.5,
              interests: []
            },
            interactionHistory: []
          },
          conversationState,
          cognitiveEnhancement: {
            semanticUnderstanding: synergy.dynamics.coherence,
            contextAwareness: synergy.dynamics.complexity * 0.7,
            adaptiveResponse: synergy.dynamics.adaptability,
            emergentBehavior: synergy.dynamics.emergence
          }
        };
      })
    );
  }

  /**
   * Get cognitive synergy stream
   */
  getCognitiveSynergyStream(): Observable<CognitiveSynergy> {
    return this.synergySubject.asObservable();
  }

  /**
   * Get system metrics
   */
  getSystemMetrics(): Observable<{
    cognitiveHealth: number;
    agentPerformance: number;
    evolutionProgress: number;
    emergenceLevel: number;
  }> {
    return combineLatest([
      this.synergySubject.asObservable(),
      this.agentManager.getSystemPerformance(),
      this.genesisEngine ? this.genesisEngine.getEvolutionMetrics() : new BehaviorSubject({
        currentGeneration: 0,
        avgFitness: 0.5,
        bestFitness: 0.5,
        totalMutations: 0,
        emergentPropertiesCount: 0,
        evolutionSpeed: 0
      }).asObservable()
    ]).pipe(
      map(([synergy, agentPerf, evolution]: [any, any, any]) => ({
        cognitiveHealth: (synergy.dynamics.coherence + synergy.dynamics.adaptability) / 2,
        agentPerformance: agentPerf.systemHealth,
        evolutionProgress: evolution.avgFitness,
        emergenceLevel: synergy.dynamics.emergence
      }))
    );
  }

  /**
   * Configure the orchestrator
   */
  configure(config: Partial<OpenCogConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (this.genesisEngine) {
      this.genesisEngine.configureEvolution({
        mutationRate: config.adaptationRate,
        emergentThreshold: config.synergyThreshold
      });
    }
  }

  /**
   * Shutdown the orchestrator
   */
  shutdown(): void {
    // Cleanup resources
    this.activityStream.complete();
    this.userContextSubject.complete();
    this.conversationStateSubject.complete();
    this.synergySubject.complete();
  }
}