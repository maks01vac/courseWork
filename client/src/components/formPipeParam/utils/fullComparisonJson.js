const fullComparisonJson = (obj1, obj2, exceptions = []) =>{

 // Проверяем, что оба аргумента являются объектами
 if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false;
  }

  // Получаем ключи объектов
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Проверяем, что количество ключей совпадает
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Перебираем ключи объекта 1
  for (let i = 0; i < keys1.length; i++) {
    const key = keys1[i];

    // Проверяем, что ключ также есть в объекте 2
    if (!obj2.hasOwnProperty(key)) {
      return false;
    }

    // Проверяем, что ключ не находится в списке исключений
    if (exceptions.includes(key)) {
      continue;
    }

    // Рекурсивно сравниваем значения ключей
    if (typeof obj1[key] === 'object') {
      if (!fullComparisonJson(obj1[key], obj2[key], exceptions)) {
        return false;
      }
    } else if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;

}

export default fullComparisonJson