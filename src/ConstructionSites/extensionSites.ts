import { HOME_SPAWN } from '../CONFIG';

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
