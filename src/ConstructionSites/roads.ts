import { HOME_SPAWN } from '../CONFIG';

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
