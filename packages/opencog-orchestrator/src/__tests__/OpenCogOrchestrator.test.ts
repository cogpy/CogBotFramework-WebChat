import { OpenCogOrchestrator } from '../core/OpenCogOrchestrator';
import type { BotActivity, UserContext } from '../types';

describe('OpenCogOrchestrator', () => {
  let orchestrator: OpenCogOrchestrator;

  beforeEach(() => {
    orchestrator = new OpenCogOrchestrator({
      enableAutogenesis: false, // Disable for testing to avoid time-based effects
      enableCognitiveSynergy: true,
      enableAdaptiveLearning: true
    });
  });

  afterEach(() => {
    orchestrator.shutdown();
  });

  describe('initialization', () => {
    it('should initialize with default configuration', () => {
      const testOrchestrator = new OpenCogOrchestrator();
      expect(testOrchestrator).toBeDefined();
      testOrchestrator.shutdown();
    });

    it('should accept custom configuration', () => {
      const customOrchestrator = new OpenCogOrchestrator({
        enableAutogenesis: false,
        synergyThreshold: 0.8
      });
      expect(customOrchestrator).toBeDefined();
      customOrchestrator.shutdown();
    });
  });

  describe('activity processing', () => {
    it('should process bot activities', (done) => {
      const activity: BotActivity = {
        id: 'test-activity-1',
        type: 'message',
        text: 'Hello, how are you?',
        timestamp: new Date()
      };

      orchestrator.processActivity(activity).subscribe(processedActivity => {
        expect(processedActivity).toBeDefined();
        expect(processedActivity.id).toBe(activity.id);
        expect(processedActivity.cognitiveProcessing).toBeDefined();
        done();
      });
    });

    it('should enhance activities with cognitive processing', (done) => {
      const activity: BotActivity = {
        id: 'test-activity-2',
        type: 'message',
        text: 'What is artificial intelligence?',
        timestamp: new Date()
      };

      orchestrator.processActivity(activity).subscribe(processedActivity => {
        expect(processedActivity.cognitiveProcessing).toBeDefined();
        expect(processedActivity.cognitiveProcessing!.analysis).toBeDefined();
        expect(processedActivity.cognitiveProcessing!.reasoning).toBeDefined();
        expect(processedActivity.cognitiveProcessing!.learning).toBeDefined();
        expect(processedActivity.cognitiveProcessing!.adaptation).toBeDefined();
        done();
      });
    });
  });

  describe('user context management', () => {
    it('should update user context', () => {
      const userContext: UserContext = {
        userId: 'test-user-123',
        preferences: { theme: 'dark' },
        cognitiveProfile: {
          learningStyle: 'visual',
          preferredComplexity: 0.7,
          adaptationRate: 0.6,
          interests: ['AI', 'technology', 'science']
        },
        interactionHistory: []
      };

      expect(() => {
        orchestrator.updateUserContext(userContext);
      }).not.toThrow();
    });
  });

  describe('cognitive synergy', () => {
    it('should provide cognitive synergy stream', (done) => {
      orchestrator.getCognitiveSynergyStream().subscribe(synergy => {
        expect(synergy).toBeDefined();
        expect(synergy.nodes).toBeDefined();
        expect(synergy.patterns).toBeDefined();
        expect(synergy.dynamics).toBeDefined();
        expect(typeof synergy.dynamics.coherence).toBe('number');
        expect(typeof synergy.dynamics.complexity).toBe('number');
        expect(typeof synergy.dynamics.adaptability).toBe('number');
        expect(typeof synergy.dynamics.emergence).toBe('number');
        done();
      });
    });
  });

  describe('system metrics', () => {
    it('should provide system metrics', (done) => {
      orchestrator.getSystemMetrics().subscribe(metrics => {
        expect(metrics).toBeDefined();
        expect(typeof metrics.cognitiveHealth).toBe('number');
        expect(typeof metrics.agentPerformance).toBe('number');
        expect(typeof metrics.evolutionProgress).toBe('number');
        expect(typeof metrics.emergenceLevel).toBe('number');
        
        // Metrics should be within valid ranges
        expect(metrics.cognitiveHealth).toBeGreaterThanOrEqual(0);
        expect(metrics.cognitiveHealth).toBeLessThanOrEqual(1);
        expect(metrics.agentPerformance).toBeGreaterThanOrEqual(0);
        expect(metrics.agentPerformance).toBeLessThanOrEqual(1);
        
        done();
      });
    });
  });

  describe('WebChat integration', () => {
    it('should provide WebChat integration data', (done) => {
      // First set a user context
      const userContext: UserContext = {
        userId: 'integration-test-user',
        preferences: {},
        cognitiveProfile: {
          learningStyle: 'adaptive',
          preferredComplexity: 0.5,
          adaptationRate: 0.5,
          interests: []
        },
        interactionHistory: []
      };
      
      orchestrator.updateUserContext(userContext);

      // Process an activity to trigger the integration stream
      const activity: BotActivity = {
        id: 'integration-test-activity',
        type: 'message',
        text: 'Integration test message',
        timestamp: new Date()
      };

      orchestrator.processActivity(activity).subscribe(() => {
        orchestrator.getWebChatIntegration().subscribe(integration => {
          expect(integration).toBeDefined();
          expect(integration.activities).toBeDefined();
          expect(integration.userContext).toBeDefined();
          expect(integration.conversationState).toBeDefined();
          expect(integration.cognitiveEnhancement).toBeDefined();
          
          expect(integration.userContext.userId).toBe('integration-test-user');
          done();
        });
      });
    });
  });

  describe('configuration', () => {
    it('should allow runtime configuration updates', () => {
      expect(() => {
        orchestrator.configure({
          synergyThreshold: 0.8,
          adaptationRate: 0.2
        });
      }).not.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle invalid activity gracefully', (done) => {
      const invalidActivity = {
        id: 'invalid-activity'
        // Missing required fields
      } as BotActivity;

      orchestrator.processActivity(invalidActivity).subscribe(
        processedActivity => {
          expect(processedActivity).toBeDefined();
          done();
        },
        error => {
          // Should not throw errors for invalid activities
          fail('Should handle invalid activities gracefully');
        }
      );
    });
  });
});