import characterClasses from '../characterClasses';
import GamePlay from '../GamePlay';
import GameController from '../GameController';
import PositionedCharacter from '../PositionedCharacter';

const gamePlay = new GamePlay();
const gameCtrl = new GameController(gamePlay, undefined);

test.each([
  ['Swordsman', {type: 'swordsman', position: 0}, 9, true],
  ['Swordsman', {type: 'swordsman', position: 0}, 18, true],
  ['Swordsman', {type: 'swordsman', position: 0}, 27, true],
  ['Swordsman', {type: 'swordsman', position: 0}, 36, true],
  ['Swordsman', {type: 'swordsman', position: 0}, 45, false],
  ['Bowman', {type: 'bowman', position: 0}, 9, true],
  ['Bowman', {type: 'bowman', position: 0}, 18, true],
  ['Bowman', {type: 'bowman', position: 0}, 27, false],
  ['Magician', {type: 'magician', position: 0}, 9, true],
  ['Magician', {type: 'magician', position: 0}, 18, false],
  ['Undead', {type: 'undead', position: 0}, 9, true],
  ['Undead', {type: 'undead', position: 0}, 18, true],
  ['Undead', {type: 'undead', position: 0}, 27, true],
  ['Undead', {type: 'undead', position: 0}, 36, true],
  ['Undead', {type: 'undead', position: 0}, 45, false],
  ['Vampire', {type: 'vampire', position: 0}, 9, true],
  ['Vampire', {type: 'vampire', position: 0}, 18, true],
  ['Vampire', {type: 'vampire', position: 0}, 27, false],
  ['Daemon', {type: 'daemon', position: 0}, 9, true],
  ['Daemon', {type: 'daemon', position: 0}, 18, false],
])(
  ('move character "%s"'
  ),
  (_, data, index, expected) => {
    const character = new characterClasses[data.type](1);
    gameCtrl.positions = [new PositionedCharacter(character, data.position)];
    gameCtrl.selectedCell = data.position;

    const result = gameCtrl.isDistanceAvailable(index, 'rangeMove');
    expect(result).toBe(expected);
  },
);

test.each([
  ['Swordsman', {type: 'swordsman', position: 0}, 9, true],
  ['Swordsman', {type: 'swordsman', position: 0}, 18, false],
  ['Bowman', {type: 'bowman', position: 0}, 9, true],
  ['Bowman', {type: 'bowman', position: 0}, 18, true],
  ['Bowman', {type: 'bowman', position: 0}, 27, false],
  ['Magician', {type: 'magician', position: 0}, 9, true],
  ['Magician', {type: 'magician', position: 0}, 18, true],
  ['Magician', {type: 'magician', position: 0}, 27, true],
  ['Magician', {type: 'magician', position: 0}, 36, true],
  ['Magician', {type: 'magician', position: 0}, 45, false],
  ['Undead', {type: 'undead', position: 0}, 9, true],
  ['Undead', {type: 'undead', position: 0}, 18, false],
  ['Vampire', {type: 'vampire', position: 0}, 9, true],
  ['Vampire', {type: 'vampire', position: 0}, 18, true],
  ['Vampire', {type: 'vampire', position: 0}, 27, false],
  ['Daemon', {type: 'daemon', position: 0}, 9, true],
  ['Daemon', {type: 'daemon', position: 0}, 18, true],
  ['Daemon', {type: 'daemon', position: 0}, 27, true],
  ['Daemon', {type: 'daemon', position: 0}, 36, true],
  ['Daemon', {type: 'daemon', position: 0}, 45, false],
])(
  ('attack character "%s"'
  ),
  (_, data, index, expected) => {
    const character = new characterClasses[data.type](1);
    gameCtrl.positions = [new PositionedCharacter(character, data.position)];
    gameCtrl.selectedCell = data.position;

    const result = gameCtrl.isDistanceAvailable(index, 'rangeAttack');
    expect(result).toBe(expected);
  },
);
