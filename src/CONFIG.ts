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
