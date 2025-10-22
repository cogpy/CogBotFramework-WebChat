import type { 
  BotActivity,
  UserContext,
  ConversationState,
  CognitiveProcessing,
  CognitiveNode
} from '../types';

/**
 * Utility functions for WebChat integration
 */

/**
 * Convert WebChat activity to OpenCog compatible format
 */
export function convertWebChatActivity(activity: any): BotActivity {
  return {
    id: activity.id || generateActivityId(),
    type: activity.type || 'message',
    text: activity.text,
    attachments: activity.attachments,
    timestamp: activity.timestamp ? new Date(activity.timestamp) : new Date(),
    cognitiveProcessing: undefined // Will be populated by orchestrator
  };
}

/**
 * Generate a unique activity ID
 */
function generateActivityId(): string {
  return `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extract user context from WebChat props
 */
export function extractUserContext(webChatProps: any): UserContext {
  const userId = webChatProps.userID || webChatProps.userId || 'anonymous';
  
  return {
    userId,
    preferences: webChatProps.styleOptions || {},
    cognitiveProfile: {
      learningStyle: 'adaptive',
      preferredComplexity: 0.5,
      adaptationRate: 0.5,
      interests: extractInterestsFromHistory(webChatProps.activities || [])
    },
    interactionHistory: convertActivitiesToHistory(webChatProps.activities || [])
  };
}

/**
 * Extract interests from activity history
 */
function extractInterestsFromHistory(activities: any[]): string[] {
  const interests: string[] = [];
  const keywordCounts = new Map<string, number>();
  
  activities.forEach(activity => {
    if (activity.text) {
      const words = activity.text.toLowerCase().match(/\b\w{4,}\b/g) || [];
      words.forEach(word => {
        const count = keywordCounts.get(word) || 0;
        keywordCounts.set(word, count + 1);
      });
    }
  });
  
  // Get top 5 most frequent keywords as interests
  const sortedKeywords = Array.from(keywordCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
  
  return sortedKeywords;
}

/**
 * Convert activities to interaction history
 */
function convertActivitiesToHistory(activities: any[]): Array<{
  timestamp: Date;
  type: 'message' | 'action' | 'preference';
  content: unknown;
  cognitiveImpact: number;
}> {
  return activities.map(activity => ({
    timestamp: activity.timestamp ? new Date(activity.timestamp) : new Date(),
    type: activity.type === 'message' ? 'message' : 'action',
    content: {
      text: activity.text,
      type: activity.type,
      from: activity.from
    },
    cognitiveImpact: calculateActivityImpact(activity)
  }));
}

/**
 * Calculate cognitive impact of an activity
 */
function calculateActivityImpact(activity: any): number {
  let impact = 0.3; // Base impact
  
  if (activity.text) {
    // Longer messages have higher impact
    impact += Math.min(0.3, activity.text.length / 200);
  }
  
  if (activity.attachments && activity.attachments.length > 0) {
    // Attachments increase impact
    impact += 0.2;
  }
  
  if (activity.suggestedActions && activity.suggestedActions.length > 0) {
    // Suggested actions increase impact
    impact += 0.1;
  }
  
  return Math.min(1.0, impact);
}

/**
 * Create enhanced WebChat activity with cognitive processing
 */
export function enhanceActivityWithCognition(
  activity: BotActivity,
  cognitiveProcessing: CognitiveProcessing
): any {
  return {
    ...activity,
    cognitiveEnhancement: {
      semanticAnalysis: cognitiveProcessing.analysis,
      reasoningResult: cognitiveProcessing.reasoning,
      adaptiveInsights: cognitiveProcessing.adaptation,
      confidence: cognitiveProcessing.reasoning.confidence,
      novelty: cognitiveProcessing.analysis.novelty
    },
    metadata: {
      ...activity.metadata,
      cognitivelyProcessed: true,
      processingTimestamp: new Date().toISOString(),
      emergentBehavior: cognitiveProcessing.adaptation.emergentCapabilities.length > 0
    }
  };
}

/**
 * Generate cognitive insights for WebChat UI
 */
export function generateCognitiveInsights(
  conversationState: ConversationState,
  cognitiveNodes: CognitiveNode[]
): {
  contextSummary: string;
  emergentPatterns: string[];
  adaptationSuggestions: string[];
  confidenceLevel: number;
} {
  const contextSummary = generateContextSummary(conversationState, cognitiveNodes);
  const emergentPatterns = conversationState.emergentPatterns.map(p => p.type);
  const adaptationSuggestions = generateAdaptationSuggestions(conversationState);
  const confidenceLevel = calculateOverallConfidence(cognitiveNodes);
  
  return {
    contextSummary,
    emergentPatterns,
    adaptationSuggestions,
    confidenceLevel
  };
}

/**
 * Generate context summary from conversation state
 */
function generateContextSummary(
  conversationState: ConversationState,
  cognitiveNodes: CognitiveNode[]
): string {
  const topicNodes = cognitiveNodes
    .filter(n => n.name.includes('Context') || n.name.includes('Intent'))
    .sort((a, b) => b.attentionValue.shortTermImportance - a.attentionValue.shortTermImportance)
    .slice(0, 3);
  
  if (topicNodes.length === 0) {
    return 'Conversation context is being established';
  }
  
  const topics = topicNodes.map(n => n.name.replace(/Context|Intent/, '').trim());
  return `Current focus: ${topics.join(', ')}`;
}

/**
 * Generate adaptation suggestions
 */
function generateAdaptationSuggestions(conversationState: ConversationState): string[] {
  const suggestions: string[] = [];
  
  if (conversationState.emergentPatterns.length > 0) {
    suggestions.push('New interaction patterns detected - adapting response style');
  }
  
  if (conversationState.adaptationHistory.length > 10) {
    const recentAdaptations = conversationState.adaptationHistory.slice(0, 5);
    const avgImpact = recentAdaptations.reduce((sum, event) => sum + event.impact, 0) / recentAdaptations.length;
    
    if (avgImpact > 0.7) {
      suggestions.push('High adaptation success - maintaining current approach');
    } else {
      suggestions.push('Low adaptation success - exploring alternative strategies');
    }
  }
  
  if (conversationState.currentTopic) {
    suggestions.push(`Maintaining focus on ${conversationState.currentTopic}`);
  }
  
  return suggestions;
}

/**
 * Calculate overall system confidence
 */
function calculateOverallConfidence(cognitiveNodes: CognitiveNode[]): number {
  if (cognitiveNodes.length === 0) return 0.5;
  
  const confidences = cognitiveNodes.map(n => n.truthValue.confidence);
  const avgConfidence = confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length;
  
  return avgConfidence;
}

/**
 * Create WebChat middleware for OpenCog integration
 */
export function createOpenCogMiddleware(orchestrator: any) {
  return () => (next: any) => (action: any) => {
    // Intercept WebChat actions and process through OpenCog
    if (action.type === 'WEB_CHAT/SEND_MESSAGE' || action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
      const activity = convertWebChatActivity(action.payload);
      
      // Process through OpenCog orchestrator
      orchestrator.processActivity(activity).subscribe((enhancedActivity: BotActivity) => {
        // Update the action with enhanced data
        const enhancedAction = {
          ...action,
          payload: enhanceActivityWithCognition(
            enhancedActivity,
            enhancedActivity.cognitiveProcessing!
          )
        };
        
        return next(enhancedAction);
      });
    }
    
    return next(action);
  };
}

/**
 * Create style options enhanced with cognitive insights
 */
export function createCognitiveStyleOptions(baseStyleOptions: any, cognitiveInsights: any): any {
  return {
    ...baseStyleOptions,
    // Adaptive colors based on confidence
    primaryColor: interpolateColor('#0078d4', '#28a745', cognitiveInsights.confidenceLevel),
    // Adaptive sizing based on complexity
    botAvatarBackgroundColor: cognitiveInsights.emergentPatterns.length > 0 ? '#ff6b35' : '#0078d4',
    // Add cognitive indicators
    showCognitiveIndicators: true,
    cognitiveInsightPanel: {
      show: true,
      position: 'right',
      width: '250px'
    }
  };
}

/**
 * Interpolate between two colors based on a factor
 */
function interpolateColor(color1: string, color2: string, factor: number): string {
  // Simple interpolation - in a real implementation, you'd use proper color space conversion
  const f = Math.max(0, Math.min(1, factor));
  
  if (f < 0.5) return color1;
  return color2;
}

/**
 * Create cognitive activity renderer
 */
export function createCognitiveActivityRenderer(baseRenderer: any) {
  return (props: any) => {
    const { activity, ...otherProps } = props;
    
    // Add cognitive enhancement indicators
    const cognitiveEnhancement = activity.cognitiveEnhancement;
    
    return baseRenderer({
      ...otherProps,
      activity: {
        ...activity,
        // Add cognitive metadata to be displayed
        showCognitiveInsights: true,
        cognitiveMetadata: cognitiveEnhancement ? {
          confidence: cognitiveEnhancement.reasoningResult?.confidence,
          novelty: cognitiveEnhancement.semanticAnalysis?.novelty,
          emergent: cognitiveEnhancement.adaptiveInsights?.emergentCapabilities?.length > 0
        } : null
      }
    });
  };
}

/**
 * Format cognitive metrics for display
 */
export function formatCognitiveMetrics(metrics: {
  cognitiveHealth: number;
  agentPerformance: number;
  evolutionProgress: number;
  emergenceLevel: number;
}): {
  displayMetrics: Array<{ label: string; value: string; color: string }>;
  overallHealth: string;
} {
  const displayMetrics = [
    {
      label: 'Cognitive Health',
      value: `${Math.round(metrics.cognitiveHealth * 100)}%`,
      color: metrics.cognitiveHealth > 0.7 ? '#28a745' : metrics.cognitiveHealth > 0.4 ? '#ffc107' : '#dc3545'
    },
    {
      label: 'Agent Performance',
      value: `${Math.round(metrics.agentPerformance * 100)}%`,
      color: metrics.agentPerformance > 0.7 ? '#28a745' : metrics.agentPerformance > 0.4 ? '#ffc107' : '#dc3545'
    },
    {
      label: 'Evolution Progress',
      value: `${Math.round(metrics.evolutionProgress * 100)}%`,
      color: metrics.evolutionProgress > 0.7 ? '#28a745' : metrics.evolutionProgress > 0.4 ? '#ffc107' : '#dc3545'
    },
    {
      label: 'Emergence Level',
      value: `${Math.round(metrics.emergenceLevel * 100)}%`,
      color: metrics.emergenceLevel > 0.5 ? '#17a2b8' : '#6c757d'
    }
  ];
  
  const avgHealth = (metrics.cognitiveHealth + metrics.agentPerformance + metrics.evolutionProgress) / 3;
  const overallHealth = avgHealth > 0.7 ? 'Excellent' : avgHealth > 0.5 ? 'Good' : avgHealth > 0.3 ? 'Fair' : 'Needs Attention';
  
  return { displayMetrics, overallHealth };
}

/**
 * Create WebChat store enhancer for OpenCog integration
 */
export function createOpenCogStoreEnhancer(orchestrator: any) {
  return (createStore: any) => (reducer: any, initialState: any, enhancer: any) => {
    const store = createStore(reducer, initialState, enhancer);
    
    // Subscribe to store changes and update OpenCog
    store.subscribe(() => {
      const state = store.getState();
      
      // Update user context when user ID changes
      if (state.userID) {
        const userContext = extractUserContext({
          userID: state.userID,
          activities: state.activities,
          styleOptions: state.styleOptions
        });
        orchestrator.updateUserContext(userContext);
      }
    });
    
    return store;
  };
}