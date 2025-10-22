#!/usr/bin/env node

/**
 * OpenCog Orchestrator Demo
 * 
 * This script demonstrates the autonomous cognitive capabilities
 * of the OpenCog orchestrator system.
 */

const { createOpenCogOrchestrator } = require('../dist/index.js');

console.log('🧠 OpenCog Orchestrator Demonstration');
console.log('=====================================\n');

// Create orchestrator with demo configuration
const orchestrator = createOpenCogOrchestrator({
  enableAutogenesis: true,
  enableCognitiveSynergy: true,
  enableAdaptiveLearning: true,
  evolutionInterval: 30000, // Faster evolution for demo (30 seconds)
  synergyThreshold: 0.6,    // Lower threshold for demo visibility
  adaptationRate: 0.2       // Higher adaptation rate for demo
});

console.log('✅ Orchestrator initialized with configuration:');
console.log('   - Autogenesis: Enabled');
console.log('   - Cognitive Synergy: Enabled');  
console.log('   - Adaptive Learning: Enabled');
console.log('   - Evolution Interval: 30 seconds');
console.log('   - Synergy Threshold: 0.6');
console.log('   - Adaptation Rate: 0.2\n');

// Set up user context
const demoUserContext = {
  userId: 'demo-user-001',
  preferences: { theme: 'cognitive', complexity: 'adaptive' },
  cognitiveProfile: {
    learningStyle: 'experiential',
    preferredComplexity: 0.7,
    adaptationRate: 0.8,
    interests: ['AI', 'cognitive science', 'autonomous systems', 'emergence']
  },
  interactionHistory: []
};

orchestrator.updateUserContext(demoUserContext);
console.log('👤 User context established for:', demoUserContext.userId);

// Monitor cognitive synergy
let synergyCount = 0;
orchestrator.getCognitiveSynergyStream().subscribe(synergy => {
  synergyCount++;
  if (synergyCount % 5 === 0) { // Log every 5th update to avoid spam
    console.log('\n🔮 Cognitive Synergy Update:');
    console.log(`   Coherence: ${(synergy.dynamics.coherence * 100).toFixed(1)}%`);
    console.log(`   Complexity: ${(synergy.dynamics.complexity * 100).toFixed(1)}%`);
    console.log(`   Adaptability: ${(synergy.dynamics.adaptability * 100).toFixed(1)}%`);
    console.log(`   Emergence: ${(synergy.dynamics.emergence * 100).toFixed(1)}%`);
    console.log(`   Active Nodes: ${synergy.nodes.length}`);
    console.log(`   Active Patterns: ${synergy.patterns.length}`);
    
    if (synergy.patterns.length > 0) {
      const emergentPatterns = synergy.patterns.filter(p => p.type === 'emergence');
      if (emergentPatterns.length > 0) {
        console.log(`   🌟 Emergent Patterns: ${emergentPatterns.length}`);
      }
    }
  }
});

// Monitor system metrics
let metricsCount = 0;
orchestrator.getSystemMetrics().subscribe(metrics => {
  metricsCount++;
  if (metricsCount % 10 === 0) { // Log every 10th update
    console.log('\n📊 System Performance Metrics:');
    console.log(`   Cognitive Health: ${(metrics.cognitiveHealth * 100).toFixed(1)}%`);
    console.log(`   Agent Performance: ${(metrics.agentPerformance * 100).toFixed(1)}%`);
    console.log(`   Evolution Progress: ${(metrics.evolutionProgress * 100).toFixed(1)}%`);
    console.log(`   Emergence Level: ${(metrics.emergenceLevel * 100).toFixed(1)}%`);
  }
});

// Simulate conversation activities
const conversationActivities = [
  {
    id: 'conv-001',
    type: 'message',
    text: 'Hello! I\'m interested in learning about artificial intelligence and cognitive architectures.',
    timestamp: new Date()
  },
  {
    id: 'conv-002', 
    type: 'message',
    text: 'Can you explain how autonomous systems can learn and adapt their own behavior?',
    timestamp: new Date()
  },
  {
    id: 'conv-003',
    type: 'message',
    text: 'What is cognitive synergy and how does it emerge in multi-agent systems?',
    timestamp: new Date()
  },
  {
    id: 'conv-004',
    type: 'message', 
    text: 'I\'m curious about systems that can evolve their own architectures autonomously.',
    timestamp: new Date()
  },
  {
    id: 'conv-005',
    type: 'message',
    text: 'How do emergent properties arise from the interaction of simpler cognitive components?',
    timestamp: new Date()
  },
  {
    id: 'conv-006',
    type: 'message',
    text: 'Tell me about the relationship between consciousness and cognitive architecture design.',
    timestamp: new Date()
  }
];

console.log('\n🗣️  Simulating conversation activities...\n');

// Process activities with delays
conversationActivities.forEach((activity, index) => {
  setTimeout(() => {
    console.log(`\n💬 Processing: "${activity.text.substring(0, 50)}..."`);
    
    orchestrator.processActivity(activity).subscribe(enhancedActivity => {
      const cognitive = enhancedActivity.cognitiveProcessing;
      
      console.log(`   📋 Analysis Results:`);
      console.log(`      Concepts: [${cognitive.analysis.concepts.slice(0, 3).join(', ')}${cognitive.analysis.concepts.length > 3 ? '...' : ''}]`);
      console.log(`      Sentiment: ${(cognitive.analysis.sentiment * 100).toFixed(1)}% positive`);
      console.log(`      Complexity: ${(cognitive.analysis.complexity * 100).toFixed(1)}%`);
      console.log(`      Novelty: ${(cognitive.analysis.novelty * 100).toFixed(1)}%`);
      console.log(`      Confidence: ${(cognitive.reasoning.confidence * 100).toFixed(1)}%`);
      console.log(`      Learning Rate: ${(cognitive.learning.learningRate * 100).toFixed(1)}%`);
      console.log(`      Adaptation Success: ${(cognitive.adaptation.adaptationSuccess * 100).toFixed(1)}%`);
      
      if (cognitive.adaptation.emergentCapabilities.length > 0) {
        console.log(`      🚀 Emergent Capabilities: [${cognitive.adaptation.emergentCapabilities.join(', ')}]`);
      }
      
      if (cognitive.reasoning.inferences.length > 0) {
        console.log(`      💡 Inferences: [${cognitive.reasoning.inferences.slice(0, 2).join(', ')}]`);
      }
    });
  }, index * 3000); // 3 second intervals between activities
});

// WebChat integration monitoring  
setTimeout(() => {
  console.log('\n🔗 Monitoring WebChat Integration...\n');
  
  orchestrator.getWebChatIntegration().subscribe(integration => {
    console.log('📱 WebChat Integration Status:');
    console.log(`   User: ${integration.userContext.userId}`);
    console.log(`   Cognitive Enhancement:`);
    console.log(`      Semantic Understanding: ${(integration.cognitiveEnhancement.semanticUnderstanding * 100).toFixed(1)}%`);
    console.log(`      Context Awareness: ${(integration.cognitiveEnhancement.contextAwareness * 100).toFixed(1)}%`);
    console.log(`      Adaptive Response: ${(integration.cognitiveEnhancement.adaptiveResponse * 100).toFixed(1)}%`);
    console.log(`      Emergent Behavior: ${(integration.cognitiveEnhancement.emergentBehavior * 100).toFixed(1)}%`);
    
    if (integration.conversationState.emergentPatterns.length > 0) {
      console.log(`   🌟 Active Patterns: ${integration.conversationState.emergentPatterns.length}`);
    }
    
    if (integration.conversationState.adaptationHistory.length > 0) {
      const recent = integration.conversationState.adaptationHistory[0];
      console.log(`   🔄 Recent Adaptation: ${recent.type} (impact: ${(recent.impact * 100).toFixed(1)}%)`);
    }
  });
}, 20000);

// Summary and cleanup
setTimeout(() => {
  console.log('\n🎯 Demonstration Summary');
  console.log('========================');
  console.log('The OpenCog orchestrator has demonstrated:');
  console.log('✅ Autonomous cognitive processing of conversational activities');
  console.log('✅ Real-time cognitive synergy dynamics monitoring');
  console.log('✅ Adaptive learning from interaction patterns');
  console.log('✅ Emergent property detection and cultivation');
  console.log('✅ Performance metrics tracking and optimization');
  console.log('✅ WebChat integration capabilities');
  
  orchestrator.getSystemMetrics().subscribe(finalMetrics => {
    console.log('\n📈 Final System State:');
    console.log(`   Overall Cognitive Health: ${(finalMetrics.cognitiveHealth * 100).toFixed(1)}%`);
    console.log(`   Agent Performance: ${(finalMetrics.agentPerformance * 100).toFixed(1)}%`);
    console.log(`   Evolution Progress: ${(finalMetrics.evolutionProgress * 100).toFixed(1)}%`);
    console.log(`   Emergence Level: ${(finalMetrics.emergenceLevel * 100).toFixed(1)}%`);
    
    console.log('\n🚀 The system is now ready for autonomous operation!');
    console.log('\nShutting down demo...');
    
    setTimeout(() => {
      orchestrator.shutdown();
      process.exit(0);
    }, 2000);
  });
}, 25000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Gracefully shutting down OpenCog orchestrator...');
  orchestrator.shutdown();
  process.exit(0);
});

console.log('🚀 Demo started! Watch the cognitive system come to life...\n');