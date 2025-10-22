import { BehaviorSubject, Observable, interval, combineLatest } from 'rxjs';
import { map, filter, switchMap, tap } from 'rxjs/operators';
import type { 
  AutonomousAgent, 
  AgentCapability, 
  AgentGoal, 
  AgentStatus,
  PerformanceMetrics,
  CognitiveNode,
  BotActivity
} from '../types';
import { CognitiveNodeStore } from './CognitiveNodeStore';

export class AutonomousAgentManager {
  private agents = new Map<string, AutonomousAgent>();
  private agentsSubject = new BehaviorSubject<Map<string, AutonomousAgent>>(new Map());
  private activeTasksSubject = new BehaviorSubject<Map<string, string>>(new Map());

  constructor(private cognitiveStore: CognitiveNodeStore) {
    this.initializeFoundationalAgents();
    this.startAgentLifecycle();
  }

  /**
   * Initialize foundational autonomous agents
   */
  private initializeFoundationalAgents(): void {
    const foundationalAgents: Partial<AutonomousAgent>[] = [
      {
        id: 'conversation-coordinator',
        type: 'hybrid',
        capabilities: [
          { name: 'context-tracking', type: 'perception', strength: 0.9, lastUsed: new Date() },
          { name: 'intent-recognition', type: 'reasoning', strength: 0.8, lastUsed: new Date() },
          { name: 'response-generation', type: 'action', strength: 0.7, lastUsed: new Date() },
          { name: 'adaptation', type: 'learning', strength: 0.6, lastUsed: new Date() }
        ],
        goals: [
          { id: 'maintain-context', description: 'Maintain conversation context', priority: 0.9, status: 'active', progress: 0.7 },
          { id: 'understand-user', description: 'Understand user intent and needs', priority: 0.8, status: 'active', progress: 0.6 }
        ],
        knowledge: [],
        status: {
          state: 'active',
          performance: { tasksCompleted: 0, errorRate: 0, learningRate: 0.5, adaptationSpeed: 0.6 },
          lastActivity: new Date()
        }
      },
      {
        id: 'pattern-discoverer',
        type: 'cognitive',
        capabilities: [
          { name: 'pattern-detection', type: 'perception', strength: 0.9, lastUsed: new Date() },
          { name: 'trend-analysis', type: 'reasoning', strength: 0.8, lastUsed: new Date() },
          { name: 'insight-generation', type: 'reasoning', strength: 0.7, lastUsed: new Date() },
          { name: 'knowledge-synthesis', type: 'learning', strength: 0.8, lastUsed: new Date() }
        ],
        goals: [
          { id: 'discover-patterns', description: 'Discover emergent patterns in conversations', priority: 0.7, status: 'active', progress: 0.5 },
          { id: 'optimize-interactions', description: 'Optimize interaction patterns', priority: 0.6, status: 'active', progress: 0.4 }
        ],
        knowledge: [],
        status: {
          state: 'active',
          performance: { tasksCompleted: 0, errorRate: 0, learningRate: 0.7, adaptationSpeed: 0.5 },
          lastActivity: new Date()
        }
      },
      {
        id: 'adaptive-learner',
        type: 'cognitive',
        capabilities: [
          { name: 'experience-analysis', type: 'perception', strength: 0.8, lastUsed: new Date() },
          { name: 'knowledge-integration', type: 'reasoning', strength: 0.9, lastUsed: new Date() },
          { name: 'behavior-modification', type: 'action', strength: 0.7, lastUsed: new Date() },
          { name: 'meta-learning', type: 'learning', strength: 0.9, lastUsed: new Date() }
        ],
        goals: [
          { id: 'continuous-learning', description: 'Continuously learn from interactions', priority: 0.8, status: 'active', progress: 0.6 },
          { id: 'improve-performance', description: 'Improve system performance metrics', priority: 0.7, status: 'active', progress: 0.5 }
        ],
        knowledge: [],
        status: {
          state: 'active',
          performance: { tasksCompleted: 0, errorRate: 0, learningRate: 0.9, adaptationSpeed: 0.8 },
          lastActivity: new Date()
        }
      }
    ];

    foundationalAgents.forEach(agentData => {
      const agent: AutonomousAgent = {
        id: agentData.id!,
        type: agentData.type!,
        capabilities: agentData.capabilities!,
        goals: agentData.goals!,
        knowledge: [],
        status: agentData.status!
      };
      this.addAgent(agent);
    });
  }

  /**
   * Add a new autonomous agent
   */
  addAgent(agent: AutonomousAgent): void {
    this.agents.set(agent.id, { ...agent });
    this.agentsSubject.next(new Map(this.agents));
  }

  /**
   * Update an existing agent
   */
  updateAgent(id: string, updates: Partial<AutonomousAgent>): void {
    const existingAgent = this.agents.get(id);
    if (existingAgent) {
      const updatedAgent = { 
        ...existingAgent, 
        ...updates,
        status: { 
          ...existingAgent.status, 
          ...updates.status,
          lastActivity: new Date() 
        }
      };
      this.agents.set(id, updatedAgent);
      this.agentsSubject.next(new Map(this.agents));
    }
  }

  /**
   * Get agent by ID
   */
  getAgent(id: string): AutonomousAgent | undefined {
    return this.agents.get(id);
  }

  /**
   * Get all agents
   */
  getAllAgents(): AutonomousAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Start the autonomous agent lifecycle
   */
  private startAgentLifecycle(): void {
    // Agent processing cycle every 5 seconds
    interval(5000).subscribe(() => {
      this.processAgentCycle();
    });

    // Performance monitoring cycle every 30 seconds
    interval(30000).subscribe(() => {
      this.updatePerformanceMetrics();
    });

    // Goal reassessment cycle every 60 seconds
    interval(60000).subscribe(() => {
      this.reassessAgentGoals();
    });
  }

  /**
   * Process one cycle of agent autonomous behavior
   */
  private processAgentCycle(): void {
    this.agents.forEach((agent, agentId) => {
      if (agent.status.state === 'active') {
        this.executeAgentCycle(agentId);
      }
    });
  }

  /**
   * Execute one cycle for a specific agent
   */
  private executeAgentCycle(agentId: string): void {
    const agent = this.agents.get(agentId);
    if (!agent) return;

    switch (agent.id) {
      case 'conversation-coordinator':
        this.processConversationCoordination(agent);
        break;
      case 'pattern-discoverer':
        this.processPatternDiscovery(agent);
        break;
      case 'adaptive-learner':
        this.processAdaptiveLearning(agent);
        break;
    }

    this.updateAgentStatus(agentId, 'processing');
  }

  /**
   * Process conversation coordination tasks
   */
  private processConversationCoordination(agent: AutonomousAgent): void {
    // Get high-attention nodes from cognitive store
    const activeNodes = this.cognitiveStore.queryNodes(undefined, 0.7);
    
    // Update agent knowledge with relevant nodes
    const contextNodes = activeNodes.filter(node => 
      node.type === 'concept' && 
      (node.name.includes('Context') || node.name.includes('Intent'))
    );
    
    agent.knowledge = contextNodes;
    
    // Update goal progress based on context tracking
    const contextGoal = agent.goals.find(g => g.id === 'maintain-context');
    if (contextGoal) {
      contextGoal.progress = Math.min(1.0, contextGoal.progress + (contextNodes.length * 0.1));
    }
    
    // Update capability usage
    const contextCapability = agent.capabilities.find(c => c.name === 'context-tracking');
    if (contextCapability) {
      contextCapability.lastUsed = new Date();
      contextCapability.strength = Math.min(1.0, contextCapability.strength + 0.01);
    }
  }

  /**
   * Process pattern discovery tasks
   */
  private processPatternDiscovery(agent: AutonomousAgent): void {
    // Analyze cognitive patterns
    const synergyDynamics = this.cognitiveStore.calculateSynergyDynamics();
    
    // Update agent knowledge based on emergent patterns
    if (synergyDynamics.emergence > 0.6) {
      const emergentNode: CognitiveNode = {
        id: `pattern_${Date.now()}`,
        type: 'concept',
        name: 'EmergentPattern',
        truthValue: { strength: synergyDynamics.emergence, confidence: 0.7 },
        attentionValue: { shortTermImportance: 0.8, longTermImportance: 0.6, veryLongTermImportance: 0.4 },
        connections: [],
        metadata: { discoveredBy: agent.id, strength: synergyDynamics.emergence },
        created: new Date(),
        lastUpdated: new Date()
      };
      
      this.cognitiveStore.addNode(emergentNode);
      agent.knowledge.push(emergentNode);
    }
    
    // Update pattern discovery goal
    const discoveryGoal = agent.goals.find(g => g.id === 'discover-patterns');
    if (discoveryGoal) {
      discoveryGoal.progress = Math.min(1.0, discoveryGoal.progress + (synergyDynamics.emergence * 0.2));
    }
  }

  /**
   * Process adaptive learning tasks
   */
  private processAdaptiveLearning(agent: AutonomousAgent): void {
    // Analyze system performance and adapt
    const allAgents = Array.from(this.agents.values());
    const avgPerformance = this.calculateAveragePerformance(allAgents);
    
    // If performance is below threshold, initiate learning
    if (avgPerformance < 0.7) {
      this.initiateSystemAdaptation(agent, avgPerformance);
    }
    
    // Update learning capabilities
    const learningCapability = agent.capabilities.find(c => c.type === 'learning');
    if (learningCapability) {
      learningCapability.strength = Math.min(1.0, learningCapability.strength + 0.02);
      learningCapability.lastUsed = new Date();
    }
    
    // Update continuous learning goal
    const learningGoal = agent.goals.find(g => g.id === 'continuous-learning');
    if (learningGoal) {
      learningGoal.progress = Math.min(1.0, learningGoal.progress + 0.05);
    }
  }

  /**
   * Calculate average performance across all agents
   */
  private calculateAveragePerformance(agents: AutonomousAgent[]): number {
    const performances = agents.map(agent => {
      const metrics = agent.status.performance;
      const successRate = 1 - metrics.errorRate;
      const efficiency = metrics.learningRate * metrics.adaptationSpeed;
      return (successRate + efficiency) / 2;
    });
    
    return performances.reduce((sum, perf) => sum + perf, 0) / performances.length;
  }

  /**
   * Initiate system adaptation based on performance
   */
  private initiateSystemAdaptation(learnerAgent: AutonomousAgent, currentPerformance: number): void {
    // Create adaptation strategies
    const adaptationStrategies = [
      'increase-attention-sensitivity',
      'enhance-pattern-recognition',
      'improve-context-integration',
      'optimize-response-generation'
    ];
    
    const selectedStrategy = adaptationStrategies[Math.floor(Math.random() * adaptationStrategies.length)];
    
    // Create adaptation node
    const adaptationNode: CognitiveNode = {
      id: `adaptation_${Date.now()}`,
      type: 'schema',
      name: `Adaptation_${selectedStrategy}`,
      truthValue: { strength: 1 - currentPerformance, confidence: 0.8 },
      attentionValue: { shortTermImportance: 0.9, longTermImportance: 0.7, veryLongTermImportance: 0.5 },
      connections: [],
      metadata: { 
        strategy: selectedStrategy, 
        targetPerformance: currentPerformance + 0.2,
        initiatedBy: learnerAgent.id
      },
      created: new Date(),
      lastUpdated: new Date()
    };
    
    this.cognitiveStore.addNode(adaptationNode);
    learnerAgent.knowledge.push(adaptationNode);
  }

  /**
   * Update performance metrics for all agents
   */
  private updatePerformanceMetrics(): void {
    this.agents.forEach((agent, agentId) => {
      const completedTasks = agent.goals.filter(g => g.status === 'completed').length;
      const totalTasks = agent.goals.length;
      const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 0;
      
      // Simulate performance updates based on activity
      const newMetrics: PerformanceMetrics = {
        tasksCompleted: agent.status.performance.tasksCompleted + completedTasks,
        errorRate: Math.max(0, agent.status.performance.errorRate - 0.01),
        learningRate: Math.min(1.0, agent.status.performance.learningRate + (completionRate * 0.05)),
        adaptationSpeed: Math.min(1.0, agent.status.performance.adaptationSpeed + 0.02)
      };
      
      this.updateAgent(agentId, {
        status: { ...agent.status, performance: newMetrics }
      });
    });
  }

  /**
   * Reassess and update agent goals based on current state
   */
  private reassessAgentGoals(): void {
    this.agents.forEach((agent, agentId) => {
      const updatedGoals = agent.goals.map(goal => {
        // Update goal progress and status
        if (goal.status === 'active' && goal.progress >= 1.0) {
          return { ...goal, status: 'completed' as const };
        }
        
        // Reset completed goals or create new ones
        if (goal.status === 'completed') {
          return {
            ...goal,
            progress: 0,
            status: 'active' as const,
            priority: Math.min(1.0, goal.priority + 0.1)
          };
        }
        
        return goal;
      });
      
      this.updateAgent(agentId, { goals: updatedGoals });
    });
  }

  /**
   * Process bot activity through autonomous agents
   */
  processActivity(activity: BotActivity): void {
    // Route activity to appropriate agents
    const coordinatorAgent = this.agents.get('conversation-coordinator');
    if (coordinatorAgent) {
      this.processActivityWithAgent(coordinatorAgent, activity);
    }
    
    const learnerAgent = this.agents.get('adaptive-learner');
    if (learnerAgent) {
      this.analyzeActivityForLearning(learnerAgent, activity);
    }
  }

  /**
   * Process activity with conversation coordinator
   */
  private processActivityWithAgent(agent: AutonomousAgent, activity: BotActivity): void {
    // Extract intent and context
    const intentNode: CognitiveNode = {
      id: `intent_${activity.id}`,
      type: 'concept',
      name: `Intent_${activity.type}`,
      truthValue: { strength: 0.8, confidence: 0.7 },
      attentionValue: { shortTermImportance: 1.0, longTermImportance: 0.5, veryLongTermImportance: 0.2 },
      connections: [],
      metadata: { 
        activityId: activity.id,
        activityType: activity.type,
        processedBy: agent.id
      },
      created: new Date(),
      lastUpdated: new Date()
    };
    
    this.cognitiveStore.addNode(intentNode);
    
    // Update agent capabilities
    const intentCapability = agent.capabilities.find(c => c.name === 'intent-recognition');
    if (intentCapability) {
      intentCapability.lastUsed = new Date();
      intentCapability.strength = Math.min(1.0, intentCapability.strength + 0.01);
    }
  }

  /**
   * Analyze activity for learning opportunities
   */
  private analyzeActivityForLearning(agent: AutonomousAgent, activity: BotActivity): void {
    // Create learning opportunity node
    const learningNode: CognitiveNode = {
      id: `learning_${activity.id}`,
      type: 'schema',
      name: 'LearningOpportunity',
      truthValue: { strength: 0.6, confidence: 0.8 },
      attentionValue: { shortTermImportance: 0.7, longTermImportance: 0.8, veryLongTermImportance: 0.6 },
      connections: [],
      metadata: { 
        sourceActivity: activity.id,
        learningType: 'experiential',
        analyzedBy: agent.id
      },
      created: new Date(),
      lastUpdated: new Date()
    };
    
    this.cognitiveStore.addNode(learningNode);
    agent.knowledge.push(learningNode);
  }

  /**
   * Update agent status
   */
  private updateAgentStatus(agentId: string, state: AgentStatus['state']): void {
    const agent = this.agents.get(agentId);
    if (agent) {
      this.updateAgent(agentId, {
        status: { ...agent.status, state, lastActivity: new Date() }
      });
    }
  }

  /**
   * Get observable stream of agents
   */
  getAgentsStream(): Observable<AutonomousAgent[]> {
    return this.agentsSubject.asObservable().pipe(
      map(agentMap => Array.from(agentMap.values()))
    );
  }

  /**
   * Get observable stream of active agents
   */
  getActiveAgentsStream(): Observable<AutonomousAgent[]> {
    return this.getAgentsStream().pipe(
      map(agents => agents.filter(agent => agent.status.state === 'active'))
    );
  }

  /**
   * Get system-wide performance metrics
   */
  getSystemPerformance(): Observable<{
    avgTaskCompletion: number;
    avgErrorRate: number;
    avgLearningRate: number;
    avgAdaptationSpeed: number;
    systemHealth: number;
  }> {
    return this.getAgentsStream().pipe(
      map(agents => {
        const metrics = agents.map(agent => agent.status.performance);
        const count = metrics.length || 1;
        
        const avgTaskCompletion = metrics.reduce((sum, m) => sum + m.tasksCompleted, 0) / count;
        const avgErrorRate = metrics.reduce((sum, m) => sum + m.errorRate, 0) / count;
        const avgLearningRate = metrics.reduce((sum, m) => sum + m.learningRate, 0) / count;
        const avgAdaptationSpeed = metrics.reduce((sum, m) => sum + m.adaptationSpeed, 0) / count;
        
        const systemHealth = (avgLearningRate + avgAdaptationSpeed + (1 - avgErrorRate)) / 3;
        
        return {
          avgTaskCompletion,
          avgErrorRate,
          avgLearningRate,
          avgAdaptationSpeed,
          systemHealth
        };
      })
    );
  }
}