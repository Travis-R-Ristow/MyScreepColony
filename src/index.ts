import { CREEP_TASKS, CREEP_TYPES, HOME_SPAWN } from './CONFIG';
import { buildRoadSites } from './ConstructionSites/roads';
import { createExtensionSites } from './ConstructionSites/extensionSites';
import { goBuild } from './CreepActions/builder';
import { goDeposit } from './CreepActions/deposit';
import { goGather } from './CreepActions/gather';
import { goUpgradeController } from './CreepActions/upgradeController';

export const loop = () => {
  console.log('Dab Time!');

  if (HOME_SPAWN.room.controller?.level && HOME_SPAWN.room.controller.level > 1) {
    createExtensionSites();
  }
  console.log('Room Controller Level', HOME_SPAWN.room.controller?.level);

  // Initiate Life
  const workerCreep = 'WC3M';
  const numberOfLitterWorkers = Object.keys(Game.creeps).filter((name) =>
    name.match(`${workerCreep}.*`)
  ).length;
  const allLilWorkerDeployed = numberOfLitterWorkers > 1;

  if (!allLilWorkerDeployed) {
    HOME_SPAWN.spawnCreep(
      CREEP_TYPES[workerCreep],
      `${workerCreep}_${Object.keys(Game.creeps).length}`,
      {
        memory: {
          mainTask: CREEP_TASKS.GATHER
        }
      }
    );
  }

  const builderCreep = 'W2CM';
  const numberOfLitterBuilders = Object.keys(Game.creeps).filter((name) =>
    name.match(`${builderCreep}.*`)
  ).length;
  const allLilBuildersDeployed = numberOfLitterBuilders > 1;

  if (allLilWorkerDeployed && !allLilBuildersDeployed) {
    HOME_SPAWN.spawnCreep(
      CREEP_TYPES[builderCreep],
      `${builderCreep}_${Object.keys(Game.creeps).length}`,
      {
        memory: {
          mainTask: CREEP_TASKS.BUILD
        }
      }
    );
  }

  // TEST CODE
  const totalCreeps = Object.keys(Game.creeps).length;
  console.log('totalCreeps', totalCreeps);

  buildRoadSites();

  for (const [_name, creep] of Object.entries(Game.creeps)) {
    if (creep.memory.sideTask) {
      switch (creep.memory.sideTask) {
        case CREEP_TASKS.GATHER:
          goGather(creep);
          break;
        case CREEP_TASKS.BUILD:
          goGather(creep); // CHANGE ME TO BUILDER
          break;
        case CREEP_TASKS.DEPOSIT:
          goDeposit(creep);
          break;
        case CREEP_TASKS.UPGRADE_CONTROLLER:
          goUpgradeController(creep);
          break;
      }

      continue;
    }

    switch (creep.memory.mainTask) {
      case CREEP_TASKS.GATHER:
        goGather(creep);
        break;
      case CREEP_TASKS.BUILD:
        creep.say('Hey we building over here');
        break;
      case CREEP_TASKS.DEPOSIT:
        goDeposit(creep);
        break;
      case CREEP_TASKS.UPGRADE_CONTROLLER:
        goUpgradeController(creep);
        break;
    }
  }
};
