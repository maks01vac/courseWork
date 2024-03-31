const separatePointsByConnections = (points) => {
    const connectionsCount = new Map();
    const singleConnectionPoints = [];
    const multipleConnectionPoints = [];
  
    points.forEach((point) => {
      ["startId", "endId"].forEach((key) => {
        const id = point[key];
        if (connectionsCount.has(id)) {
          connectionsCount.set(id, connectionsCount.get(id) + 1);
        } else {
          connectionsCount.set(id, 1);
        }
      });
    });
  
    connectionsCount.forEach((count, id) => {
      const point = points.find(
        (point) => point.startId === id || point.endId === id
      );
      const name = point.startId === id ? point.startName : point.endName;
  
      if (count === 1) {
        singleConnectionPoints.push({ id, name});
      } else {
        multipleConnectionPoints.push({ id, name });
      }
    });
  
    return { singleConnectionPoints, multipleConnectionPoints };
  }

module.exports =  separatePointsByConnections