import { HOME_SPAWN } from '../CONFIG';
import { typeGuardStorageStructure } from '../typeGuard';

export const goDeposit = (creep: Creep) => {
  creep.say('Depositing');

  const closestStorage = getClosestStorageStructure(creep);
  if (!closestStorage) {
    creep.say('No Storages, fall back to helping');
    // transfer to builder creep
    // upgrade controller
    return;
  }

  const transferResult = creep.transfer(closestStorage, RESOURCE_ENERGY);
  if (transferResult === ERR_NOT_IN_RANGE) {
    creep.moveTo(closestStorage);
  }

  if (creep.store.getUsedCapacity() === 0) {
    creep.memory.sideTask = null;
  }
};

const getClosestStorageStructure = (creep: Creep) => {
  const myStructs = HOME_SPAWN.room.find(FIND_MY_STRUCTURES, {
    filter: (struct) =>
      typeGuardStorageStructure(struct) && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
  });

  const typeCheckedResult = myStructs.filter((s) => typeGuardStorageStructure(s) && s);

  const closestStorage = creep.pos.findClosestByPath(typeCheckedResult);

  return closestStorage;
};
