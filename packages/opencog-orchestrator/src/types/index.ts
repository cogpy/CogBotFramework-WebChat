export interface CognitiveNode {
  id: string;
  type: 'concept' | 'predicate' | 'schema' | 'atom';
  name: string;
  truthValue: TruthValue;
  attentionValue: AttentionValue;
  connections: string[];
  metadata: Record<string, unknown>;
  created: Date;
  lastUpdated: Date;
}

export interface TruthValue {
  strength: number; // 0-1, confidence in the truth
  confidence: number; // 0-1, confidence in the strength assessment
}

export interface AttentionValue {
  shortTermImportance: number; // -1 to 1
  longTermImportance: number; // -1 to 1
  veryLongTermImportance: number; // -1 to 1
}

export interface CognitiveSynergy {
  nodes: CognitiveNode[];
  patterns: CognitivePattern[];
  dynamics: SynergyDynamics;
}

export interface CognitivePattern {
  id: string;
  type: 'emergence' | 'evolution' | 'adaptation' | 'coordination';
  strength: number;
  frequency: number;
  lastObserved: Date;
  nodeIds: string[];
}

export interface SynergyDynamics {
  coherence: number; // Overall system coherence
  complexity: number; // System complexity measure
  adaptability: number; // Rate of adaptation
  emergence: number; // Level of emergent behavior
}

export interface AutonomousAgent {
  id: string;
  type: 'cognitive' | 'reactive' | 'hybrid';
  capabilities: AgentCapability[];
  goals: AgentGoal[];
  knowledge: CognitiveNode[];
  status: AgentStatus;
}

export interface AgentCapability {
  name: string;
  type: 'perception' | 'reasoning' | 'action' | 'learning';
  strength: number;
  lastUsed: Date;
}

export interface AgentGoal {
  id: string;
  description: string;
  priority: number;
  status: 'active' | 'completed' | 'paused' | 'failed';
  progress: number;
  deadline?: Date;
}

export interface AgentStatus {
  state: 'active' | 'idle' | 'processing' | 'learning' | 'error';
  currentTask?: string;
  performance: PerformanceMetrics;
  lastActivity: Date;
}

export interface PerformanceMetrics {
  tasksCompleted: number;
  errorRate: number;
  learningRate: number;
  adaptationSpeed: number;
}

export interface ArchitectureGenesis {
  generation: number;
  fitness: number;
  mutations: Mutation[];
  parentArchitectures: string[];
  emergentProperties: EmergentProperty[];
}

export interface Mutation {
  type: 'structural' | 'parametric' | 'behavioral';
  location: string;
  change: string;
  impact: number;
  timestamp: Date;
}

export interface EmergentProperty {
  name: string;
  type: 'behavioral' | 'structural' | 'functional';
  strength: number;
  stability: number;
  novelty: number;
}

export interface WebChatIntegration {
  activities: BotActivity[];
  userContext: UserContext;
  conversationState: ConversationState;
  cognitiveEnhancement: CognitiveEnhancement;
}

export interface BotActivity {
  id: string;
  type: string;
  text?: string;
  attachments?: unknown[];
  cognitiveProcessing?: CognitiveProcessing;
  timestamp: Date;
}

export interface UserContext {
  userId: string;
  preferences: Record<string, unknown>;
  cognitiveProfile: CognitiveProfile;
  interactionHistory: InteractionRecord[];
}

export interface CognitiveProfile {
  learningStyle: string;
  preferredComplexity: number;
  adaptationRate: number;
  interests: string[];
}

export interface InteractionRecord {
  timestamp: Date;
  type: 'message' | 'action' | 'preference';
  content: unknown;
  cognitiveImpact: number;
}

export interface ConversationState {
  currentTopic?: string;
  contextNodes: CognitiveNode[];
  emergentPatterns: CognitivePattern[];
  adaptationHistory: AdaptationEvent[];
}

export interface AdaptationEvent {
  timestamp: Date;
  type: 'pattern_recognition' | 'context_shift' | 'preference_update';
  description: string;
  impact: number;
}

export interface CognitiveEnhancement {
  semanticUnderstanding: number;
  contextAwareness: number;
  adaptiveResponse: number;
  emergentBehavior: number;
}

export interface CognitiveProcessing {
  analysis: SemanticAnalysis;
  reasoning: ReasoningResult;
  learning: LearningOutcome;
  adaptation: AdaptationResult;
}

export interface SemanticAnalysis {
  concepts: string[];
  relations: string[];
  sentiment: number;
  complexity: number;
  novelty: number;
}

export interface ReasoningResult {
  inferences: string[];
  confidence: number;
  reasoningChain: string[];
  uncertainty: number;
}

export interface LearningOutcome {
  newKnowledge: CognitiveNode[];
  updatedNodes: string[];
  learningRate: number;
  retention: number;
}

export interface AdaptationResult {
  behaviorChanges: string[];
  parameterAdjustments: Record<string, number>;
  emergentCapabilities: string[];
  adaptationSuccess: number;
}