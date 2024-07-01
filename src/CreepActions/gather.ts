import { CREEP_TASKS } from '../CONFIG';

export const goGather = (creep: Creep) => {
  creep.say('Gathering');

  const activeSource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
  if (!activeSource) {
    creep.say('No sources to mine.⛏️ ');
    return;
  }

  const creepGatherResult = creep.harvest(activeSource);
  if (creepGatherResult === ERR_NOT_IN_RANGE) {
    creep.moveTo(activeSource);
  }

  if (creep.store.getFreeCapacity() === 0) {
    creep.memory.sideTask =
      creep.memory.mainTask === CREEP_TASKS.GATHER ? CREEP_TASKS.DEPOSIT : null;
  }
};
