import {calcTileType} from "../utils";

test.each([
  ['1', 0, 8, 'top-left'],
  ['2', 7, 8, 'top-right'],
  ['3', 56, 8, 'bottom-left'],
  ['4', 63, 8, 'bottom-right'],
  ['5', 1, 8, 'top'],
  ['6', 6, 8, 'top'],
  ['7', 8, 8, 'left'],
  ['8', 48, 8, 'left'],
  ['9', 15, 8, 'right'],
  ['10', 55, 8, 'right'],
  ['11', 57, 8, 'bottom'],
  ['12', 62, 8, 'bottom'],
  ['13', 9, 8, 'center'],
  ['14', 14, 8, 'center'],
  ['15', 49, 8, 'center'],
  ['16', 54, 8, 'center'],
])(
  ('test %s'
  ),
  (test_name, index, boardSize, expected) => {
    const result = calcTileType(index, boardSize);

    expect(result).toBe(expected);
  },
);
