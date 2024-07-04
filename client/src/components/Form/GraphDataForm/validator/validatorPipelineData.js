
const validator = {}



validator.validatePipelineComponents = (pipeline) => {
  let errors = [];
  // Получаем данные из объекта для удобства
  const { components } = pipeline;
  const { junctions, ext_grids, sources, sinks, pumps } = components;
  // Массив всех связей для удобной проверки
  const allLinks = components.links;

  // Помощник для получения связей для конкретного компонента
  function getLinksForComponent(id) {
    id = Number(id)
    return allLinks.filter(link => Number(link.startId) === id || Number(link.endId) === id);
  }

  // Валидация junctions
  junctions.forEach(junction => {
    const connections = getLinksForComponent(junction.id);

    if (connections.length === 0) {
      errors.push(`${junction.name} не соединен ни с одним компонентом сети`);
    }
    if (connections.length === 1) {
      errors.push(`${junction.name} должнен иметь больше одной связи`);
    }
  });

  

  if (ext_grids.length == 0) {
    errors.push('Добавьте хотя бы одну внешнюю сеть')
  }

  // Валидация external grids
  ext_grids.forEach(grid => {
    // Получение всех связей для данной внешней сети
    const connections = getLinksForComponent(grid.id);

    // Проверка, что сеть подключена хотя бы к одному junction
    const hasJunction = connections.some(link =>
      junctions.some(junction => junction.id.toString() === link.startId.toString() || junction.id.toString() === link.endId.toString())
    );

    // Проверка, что сеть не подключена к другим компонентам, кроме junctions
    const connectedOnlyToJunctions = connections.every(link =>
      junctions.some(junction => junction.id.toString() === link.startId.toString() || junction.id.toString() === link.endId.toString())
    );
    // Если не подключена к хотя бы одному junction или подключена к чему-то другому
    if (!hasJunction) {
      errors.push(`${grid.name} не подключена ни к одному соединению`);
    }

    if (!connectedOnlyToJunctions) {
      errors.push(`${grid.name} не может быть подключена ни к чему, кроме соединений`);
    }
  });


  function validSourseOrSink(array, type){

    array.forEach(node => {
      const connections = getLinksForComponent(node.id);
  
      const hasJunction = connections.some(link =>
        junctions.some(junction => junction.id.toString() === link.startId.toString() || junction.id.toString() === link.endId.toString())
      );

      
      if (!hasJunction) {
        errors.push(`${node.name} не подключен ни к одному соединению`);
      }
  
      if (connections.length !== 1) {
        errors.push(`${node.name} может быть подключен только к одному соединению`);
      }
  

      // Проверка, что сеть не подключена к другим компонентам, кроме junctions
      const connectedOnlyToJunctions = connections.every(link =>
        junctions.some(junction => junction.id.toString() === link.startId.toString() || junction.id.toString() === link.endId.toString())
      );
  
      if (!connectedOnlyToJunctions) {
        errors.push(`${node.name} не может быть подключен ни к чему, кроме соединений`);
      }
    });

  }

  validSourseOrSink(sources,'Источник')
  validSourseOrSink(sinks, 'Сток')

  pumps.forEach(pump => {
    // Получаем все связи для данного насоса
    const connections = getLinksForComponent(pump.id)

    // Выбираем уникальные узлы, подключенные к насосу
    const connectedJunctions = connections.map(link => {
        // Возвращаем ID узла, который не является ID насоса
        return link.startId.toString() === pump.id.toString() ? link.endId.toString() : link.startId.toString();
    }).filter(id => {
        // Оставляем только те ID, которые действительно являются узлами
        return junctions.some(junction => junction.id.toString() === id);
    });

    // Удаление дубликатов для получения списка уникальных узлов
    const uniqueJunctions = [...new Set(connectedJunctions)];

    // Проверка условий валидации
    if (uniqueJunctions.length !== 2) {
        errors.push(`${pump.name} должен быть подключен только к двум соединениям, но соединен ${uniqueJunctions.length}.`);
    }
    
    // Проверка, что насос подключен только к узлам
    if (connections.length !== uniqueJunctions.length) {
        errors.push(`${pump.name} должен быть подключен только к соединениям`);
    }
    const startIdPump = connections.some(link => pump.id.toString() === link.startId.toString())
    const endIdPump = connections.some(link => pump.id.toString() === link.startId.toString())

    if(!startIdPump || !endIdPump) {
      errors.push(`${pump.name} должен иметь вход и выход`)
    }
    

});

  return errors;
}

validator.validateFormValue = (data) => {
  const errors = [];

  data.components.pipes.forEach(pipe => {
    if (!pipe.length != '' || !pipe.diameter.length) {
      errors.push(`Заполните данные для: Труба (${pipe.startName} - ${pipe.endName})`);
      return
    }

    if (Number(pipe.length) <= 0 || Number(pipe.diametr) <= 0) {
      errors.push(`Значения должны быть положительными, исправьте: Труба (${pipe.startName} - ${pipe.endName})`);
    }
  });

  data.components.sinks.forEach(sink => {
    if (Number(sink.mdot_kg_per_s) < 0 || Number(sink.scaling < 0)) {
      errors.push(`Неверные входные данные для: ${sink.name}`);
    }
  });

  data.components.sources.forEach(source => {
    if (source.mdot_kg_per_s < 0 || source.scaling < 0) {
      errors.push(`Неверные входные данные для: ${source.name}`);
    }
  });

  if (!data.generalData.roughness.length) {
    errors.push(`Заполните шероховатость труб:`);
  } else if(data.generalData.roughness < 0) {
    errors.push(`Шероховатость труб не может быть отрицательной`);
  }

  data.components.ext_grids.forEach(grid => {
    if (!grid.pressure.length) {
      errors.push(`Заполните данные для: ${grid.name}`);
      return
    }
    if (grid.pressure <= 0) {
      errors.push(`Значения должны быть положительными, исправьте: ${grid.name}`);
    }
  });

  return errors;
}

export default validator