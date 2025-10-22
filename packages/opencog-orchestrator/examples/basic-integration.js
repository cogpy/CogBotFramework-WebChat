/**
 * Basic OpenCog Integration Example
 * 
 * This example demonstrates how to integrate OpenCog orchestrator 
 * with BotFramework WebChat for autonomous cognitive enhancement.
 */

import ReactWebChat, { createDirectLine, createStore } from 'botframework-webchat';
import { createOpenCogOrchestrator } from '../dist/index.js';
import { 
  createOpenCogMiddleware, 
  createOpenCogStoreEnhancer,
  createCognitiveStyleOptions,
  formatCognitiveMetrics
} from '../dist/index.js';

// Configuration for OpenCog orchestrator
const openCogConfig = {
  enableAutogenesis: true,        // Enable autonomous architecture evolution
  enableCognitiveSynergy: true,   // Enable cognitive synergy between agents
  enableAdaptiveLearning: true,   // Enable continuous adaptive learning
  evolutionInterval: 180000,      // Evolution cycle every 3 minutes
  synergyThreshold: 0.75,         // Threshold for cognitive synergy activation
  adaptationRate: 0.15            // Rate of adaptive changes
};

// Initialize OpenCog orchestrator
const orchestrator = createOpenCogOrchestrator(openCogConfig);

// Create enhanced WebChat store with OpenCog integration
const storeEnhancer = createOpenCogStoreEnhancer(orchestrator);
const store = createStore({}, storeEnhancer);

// Create WebChat middleware for cognitive processing
const cognitiveMiddleware = createOpenCogMiddleware(orchestrator);

// Set up cognitive metrics monitoring
let cognitiveMetrics = null;
orchestrator.getSystemMetrics().subscribe(metrics => {
  cognitiveMetrics = formatCognitiveMetrics(metrics);
  console.log('Cognitive System Status:', cognitiveMetrics.overallHealth);
  console.log('Metrics:', cognitiveMetrics.displayMetrics);
});

// Monitor cognitive synergy for adaptive UI changes
let currentStyleOptions = {
  primaryColor: '#0078d4',
  botAvatarBackgroundColor: '#0078d4',
  userAvatarBackgroundColor: '#00bcf2'
};

orchestrator.getCognitiveSynergyStream().subscribe(synergy => {
  // Adapt UI based on cognitive synergy dynamics
  const insights = {
    confidenceLevel: synergy.dynamics.coherence,
    emergentPatterns: synergy.patterns.filter(p => p.type === 'emergence'),
    adaptationSuggestions: [`Coherence: ${Math.round(synergy.dynamics.coherence * 100)}%`]
  };
  
  // Update style options based on cognitive state
  currentStyleOptions = createCognitiveStyleOptions(currentStyleOptions, insights);
});

// WebChat component with OpenCog integration
function CognitiveWebChat({ directLine, userID }) {
  // Set up user context in OpenCog
  React.useEffect(() => {
    if (userID) {
      const userContext = {
        userId: userID,
        preferences: currentStyleOptions,
        cognitiveProfile: {
          learningStyle: 'adaptive',
          preferredComplexity: 0.6,
          adaptationRate: 0.7,
          interests: ['AI', 'conversation', 'learning']
        },
        interactionHistory: []
      };
      
      orchestrator.updateUserContext(userContext);
    }
  }, [userID]);

  return React.createElement('div', {
    style: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'row'
    }
  }, [
    // Main WebChat interface
    React.createElement('div', {
      key: 'webchat',
      style: { 
        flex: 1,
        height: '100%' 
      }
    }, 
      React.createElement(ReactWebChat, {
        directLine,
        store,
        userID,
        styleOptions: currentStyleOptions,
        // Add cognitive activity renderer
        activityRenderer: createCognitiveActivityRenderer()
      })
    ),
    
    // Cognitive insights panel
    React.createElement('div', {
      key: 'insights',
      style: {
        width: '300px',
        background: '#f8f9fa',
        border: '1px solid #dee2e6',
        padding: '16px',
        overflowY: 'auto'
      }
    }, [
      React.createElement('h3', {
        key: 'title',
        style: { marginTop: 0, marginBottom: '16px' }
      }, 'Cognitive Insights'),
      
      // System metrics display
      cognitiveMetrics && React.createElement('div', {
        key: 'metrics',
        style: { marginBottom: '16px' }
      }, [
        React.createElement('h4', { key: 'metrics-title' }, 'System Health'),
        React.createElement('div', {
          key: 'health-status',
          style: { 
            padding: '8px',
            background: cognitiveMetrics.overallHealth === 'Excellent' ? '#d4edda' : '#fff3cd',
            borderRadius: '4px',
            marginBottom: '8px'
          }
        }, `Overall: ${cognitiveMetrics.overallHealth}`),
        
        ...cognitiveMetrics.displayMetrics.map((metric, index) => 
          React.createElement('div', {
            key: `metric-${index}`,
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              padding: '4px 0',
              borderBottom: '1px solid #eee'
            }
          }, [
            React.createElement('span', { key: 'label' }, metric.label),
            React.createElement('span', { 
              key: 'value',
              style: { color: metric.color, fontWeight: 'bold' }
            }, metric.value)
          ])
        )
      ])
    ])
  ]);
}

// Custom activity renderer with cognitive enhancements
function createCognitiveActivityRenderer() {
  return ({ activity, ...otherProps }) => {
    const cognitiveData = activity.cognitiveEnhancement;
    
    return React.createElement('div', {
      style: { position: 'relative' }
    }, [
      // Standard activity rendering
      React.createElement('div', {
        key: 'activity',
        className: 'cognitive-enhanced-activity',
        'data-cognitive-confidence': cognitiveData?.confidence,
        'data-cognitive-novelty': cognitiveData?.novelty
      }, activity.text || '[Non-text activity]'),
      
      // Cognitive indicators
      cognitiveData && React.createElement('div', {
        key: 'indicators',
        style: {
          fontSize: '0.8em',
          color: '#666',
          marginTop: '4px'
        }
      }, [
        cognitiveData.confidence !== undefined && React.createElement('span', {
          key: 'confidence',
          style: {
            marginRight: '8px',
            color: cognitiveData.confidence > 0.7 ? '#28a745' : '#ffc107'
          }
        }, `Confidence: ${Math.round(cognitiveData.confidence * 100)}%`),
        
        cognitiveData.novelty !== undefined && React.createElement('span', {
          key: 'novelty',
          style: {
            color: cognitiveData.novelty > 0.7 ? '#17a2b8' : '#6c757d'
          }
        }, `Novelty: ${Math.round(cognitiveData.novelty * 100)}%`),
        
        cognitiveData.emergent && React.createElement('span', {
          key: 'emergent',
          style: {
            marginLeft: '8px',
            color: '#dc3545',
            fontSize: '0.9em'
          }
        }, '🧠 Emergent')
      ])
    ]);
  };
}

// Usage example
function initializeCognitiveWebChat() {
  const directLine = createDirectLine({
    token: 'YOUR_DIRECTLINE_TOKEN' // Replace with actual token
  });
  
  const userID = 'cognitive-user-' + Date.now().toString(36);
  
  // Monitor conversation for adaptive responses
  orchestrator.getWebChatIntegration().subscribe(integration => {
    console.log('WebChat Integration Update:', {
      userContext: integration.userContext.userId,
      cognitiveEnhancement: integration.cognitiveEnhancement,
      conversationState: integration.conversationState.currentTopic
    });
    
    // Log emergent patterns
    if (integration.conversationState.emergentPatterns.length > 0) {
      console.log('🚀 Emergent Patterns Detected:', 
        integration.conversationState.emergentPatterns.map(p => p.type)
      );
    }
  });
  
  return {
    component: CognitiveWebChat,
    props: { directLine, userID },
    orchestrator
  };
}

// Export for use in React applications
export {
  initializeCognitiveWebChat,
  CognitiveWebChat,
  createOpenCogOrchestrator,
  openCogConfig
};

// Example of programmatic interaction
export function demonstrateCognitiveCapabilities(orchestrator) {
  console.log('🧠 Demonstrating OpenCog Cognitive Capabilities');
  
  // Simulate processing various activities
  const testActivities = [
    {
      id: 'demo-1',
      type: 'message',
      text: 'Hello, I need help with artificial intelligence concepts.',
      timestamp: new Date()
    },
    {
      id: 'demo-2',
      type: 'message', 
      text: 'Can you explain machine learning and deep learning differences?',
      timestamp: new Date()
    },
    {
      id: 'demo-3',
      type: 'message',
      text: 'I am interested in cognitive architectures and autonomous systems.',
      timestamp: new Date()
    }
  ];
  
  // Process activities through cognitive system
  testActivities.forEach((activity, index) => {
    setTimeout(() => {
      console.log(`Processing activity ${index + 1}: "${activity.text}"`);
      
      orchestrator.processActivity(activity).subscribe(enhancedActivity => {
        const cognitive = enhancedActivity.cognitiveProcessing;
        console.log(`✅ Cognitive Analysis:`, {
          concepts: cognitive.analysis.concepts,
          sentiment: cognitive.analysis.sentiment,
          novelty: cognitive.analysis.novelty,
          confidence: cognitive.reasoning.confidence,
          learningRate: cognitive.learning.learningRate,
          adaptationSuccess: cognitive.adaptation.adaptationSuccess
        });
      });
    }, index * 2000); // 2 second intervals
  });
  
  // Monitor system evolution
  setTimeout(() => {
    orchestrator.getSystemMetrics().subscribe(metrics => {
      console.log('🚀 Final System State:', {
        cognitiveHealth: `${Math.round(metrics.cognitiveHealth * 100)}%`,
        agentPerformance: `${Math.round(metrics.agentPerformance * 100)}%`,
        evolutionProgress: `${Math.round(metrics.evolutionProgress * 100)}%`,
        emergenceLevel: `${Math.round(metrics.emergenceLevel * 100)}%`
      });
    });
  }, 8000);
}

console.log('OpenCog WebChat Integration Example Loaded');
console.log('Use initializeCognitiveWebChat() to start the enhanced WebChat');
console.log('Use demonstrateCognitiveCapabilities(orchestrator) to see autonomous capabilities');