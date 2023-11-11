/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  // TODO: ваш код будет тут
  const vindex = Math.trunc(index / boardSize);
  const hindex = index % boardSize;
  const pos = [];

  if (vindex === 0) {
    pos.push('top');
  } else if (vindex === boardSize - 1) {
    pos.push('bottom');
  }

  if (hindex === 0) {
    pos.push('left');
  } else if (hindex === boardSize - 1) {
    pos.push('right');
  }

  switch (pos.length) {
    case 0: return 'center';
    case 1: return pos[0];
    default: return `${pos[0]}-${pos[1]}`;
  }

  // return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
