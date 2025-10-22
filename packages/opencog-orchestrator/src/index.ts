import { OpenCogOrchestrator, type OpenCogConfig } from './core/OpenCogOrchestrator';

export { OpenCogOrchestrator, type OpenCogConfig } from './core/OpenCogOrchestrator';
export { CognitiveNodeStore } from './core/CognitiveNodeStore';
export { AutonomousAgentManager } from './core/AutonomousAgentManager';
export { ArchitectureGenesisEngine } from './core/ArchitectureGenesis';

export * from './types/index';
export * from './utils/index';

// Factory function for easy initialization
export function createOpenCogOrchestrator(config?: Partial<OpenCogConfig>) {
  return new OpenCogOrchestrator(config);
}

// Version info
export const VERSION = '0.1.0';
export const OPENCOG_NAMESPACE = '@msinternal/botframework-webchat-opencog-orchestrator';