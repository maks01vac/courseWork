const getStartAndEndIdNodes = (edgeId) => {
    const parts = edgeId.split("-");
    const startId = parseInt(parts[0], 10);
    const endId = parseInt(parts[1], 10);
  
    return [startId, endId];
  }

export default getStartAndEndIdNodes