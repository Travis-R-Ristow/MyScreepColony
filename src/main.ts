export const MY_SPAWN = 'Spawn1';

export const HOME_SPAWN = Game.spawns[MY_SPAWN];

export const CREEP_TYPES = {
  WC3M: [WORK, CARRY, CARRY, CARRY, MOVE],
  W2CM: [WORK, WORK, CARRY, MOVE]
};

export const CREEP_TASKS = Object.freeze({
  BUILD: 'BUILD',
  DEPOSIT: 'DEPOSIT',
  GATHER: 'GATHER',
  UPGRADE_CONTROLLER: 'UPGRADE_CONTROLLER',
  NEED_TASK: 'Dont use'
});

export const createExtensionSites = () => {
  let row = -5;
  let modifier = 1;
  let directions = getDirectionOptions(row);

  let extensionLocation: (typeof directions)[0] | undefined;
  while (!extensionLocation) {
    extensionLocation = directions.find((direction) => {
      try {
        const area = HOME_SPAWN.room.lookAtArea(
          direction.top,
          direction.left,
          direction.bottom,
          direction.right,
          true
        );

        return areaIsClear(area);
      } catch (e) {
        console.log(e);
        return false;
      }
    });

    if (directions[0].bottom > 45) {
      row = -5;
      modifier = -1;
    }

    row += 1 * modifier;
    directions = getDirectionOptions(row);
  }

  if (!extensionLocation) {
    console.log('No clear areas. 🚫');
    return;
  }

  const extensionsPerRow = 4;
  let extensionRows = 3;

  for (var e = 0; e < extensionsPerRow; e++) {
    const result = HOME_SPAWN.room.createConstructionSite(
      extensionLocation.left + e,
      extensionLocation.top + extensionRows,
      STRUCTURE_EXTENSION
    );

    console.log(result);

    if (e === 3 && extensionRows > 0) {
      e = -1;
      extensionRows -= 2;
    }
  }
};

const acceptableTileTypes = ['creep', 'powerCreep', 'terrain', 'tombstone', 'energy'];
const areaIsClear = (area: LookAtResultWithPos<LookConstant>[]) => {
  var isClear = true;
  area.forEach((tile: LookAtResultWithPos<LookConstant>) => {
    if (!acceptableTileTypes.includes(tile.type)) {
      isClear = false;
    }
    if (tile.terrain === 'wall') {
      isClear = false;
    }
  });

  return isClear;
};

const getDirectionOptions = (row: number) => [
  {
    top: HOME_SPAWN.pos.y + row,
    left: HOME_SPAWN.pos.x,
    bottom: HOME_SPAWN.pos.y + (row + 4),
    right: HOME_SPAWN.pos.x + 5
  },
  {
    top: HOME_SPAWN.pos.y + row,
    left: HOME_SPAWN.pos.x - 5,
    bottom: HOME_SPAWN.pos.y + (row + 4),
    right: HOME_SPAWN.pos.x
  }
];

Memory.firstRoadBuilt = false;

console.log('firstRoadBuilt', Memory.firstRoadBuilt);

export const buildRoadSites = () => {
  console.log('Roads 🛣️');

  if (!Memory.firstRoadBuilt) {
    setFirstRoute();
  }
};

const setFirstRoute = () => {
  const activeSource = HOME_SPAWN.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
    ignoreCreeps: true
  });
  if (!activeSource) {
    // Time to build new Road ?? upgrade controller
    return;
  }

  const routeResult = HOME_SPAWN.pos.findPathTo(activeSource.pos, { ignoreCreeps: true });
  for (var i = 0; i < routeResult.length - 1; i++) {
    const value = routeResult[i];

    const siteResult = HOME_SPAWN.room.createConstructionSite(value.x, value.y, STRUCTURE_ROAD);
    console.log(siteResult);
  }

  // Set First Road Built
  Memory.firstRoadBuilt = true;
};

const paintPath = (activeSource: Source) => {
  const pathFindResult = HOME_SPAWN.pos.findPathTo(activeSource.pos, { ignoreCreeps: true });
  for (let i = 1; i < pathFindResult.length - 1; i++) {
    const prevValue = pathFindResult[i - 1];
    const value = pathFindResult[i];

    Game.rooms['sim'].visual.line(prevValue.x, prevValue.y, value.x, value.y);

    console.log('pathFindResult', value.x, value.y);
  }
};
export const goBuild = (creep: Creep) => {
  console.log('Hey, We building here!');

  const sitesToBuild = Object.entries(Game.constructionSites); // find((s) => s.progressTotal);
};

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
// TYPE GUARDS

export const typeGuardStorageStructure = (
  structure: AnyStructure | AnyOwnedStructure
): structure is AnyStoreStructure => 'store' in structure;
