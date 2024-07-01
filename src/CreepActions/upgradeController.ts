import { CREEP_TASKS, HOME_SPAWN } from '../CONFIG';

export const goUpgradeController = (creep: Creep) => {
  creep.say('Upgrading Controller');

  if (!HOME_SPAWN.room.controller) {
    creep.say('No Controller?!  Uh oh im lost..');
    return;
  }

  const upgradeResult = creep.upgradeController(HOME_SPAWN.room.controller);
  if (upgradeResult === ERR_NOT_IN_RANGE) {
    creep.moveTo(HOME_SPAWN.room.controller);
  }

  if (creep.store.getUsedCapacity() === 0) {
    creep.memory.mainTask = CREEP_TASKS.GATHER;
  }
};
