import { CREEP_TASKS } from './CONFIG';

// SCREEP GLOBALS

declare global {
  interface CreepMemory {
    mainTask: keyof typeof CREEP_TASKS;
    sideTask?: keyof typeof CREEP_TASKS | null;
  }

  interface Memory {
    firstRoadBuilt: boolean;
  }
}
