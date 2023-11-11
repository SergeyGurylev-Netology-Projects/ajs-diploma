import Character from '../character';
import characterClasses from '../characterClasses';

test.each([
  ['Bowman', {type: 'bowman', health: 50, level: 1, attack: 25, defence: 25}],
  ['Swordsman', {type: 'swordsman', health: 50, level: 1, attack: 40, defence: 10}],
  ['Magician', {type: 'magician', health: 50, level: 1, attack: 10, defence: 40}],
  ['Undead', {type: 'undead', health: 50, level: 1, attack: 40, defence: 10}],
  ['Daemon', {type: 'daemon', health: 50, level: 1, attack: 10, defence: 40}],
  ['Vampire', {type: 'vampire', health: 50, level: 1, attack: 25, defence: 25}],
])(
  ('create character "%s"'
  ),
  (heroType, expected) => {
    const result = new characterClasses[expected.type](1);
    expect(result).toMatchObject(expected);
  },
);

test('test incorrect character type', () => {
  try {
    new Character(1);
    expect(true).toBe(false);
  } catch (e) {
    expect(e.message).toBe('it is forbidden to create instances of Character');
  }
});

test.each([
  ['Bowman', {type: 'bowman', health: 50, level: 1, attack: 25, defence: 25}, `\u{1F396}1 \u{2694}25 \u{1F6E1}25 \u{2764}50`],
  ['Swordsman', {type: 'swordsman', health: 50, level: 1, attack: 40, defence: 10}, `\u{1F396}1 \u{2694}40 \u{1F6E1}10 \u{2764}50`],
  ['Magician', {type: 'magician', health: 50, level: 1, attack: 10, defence: 40}, `\u{1F396}1 \u{2694}10 \u{1F6E1}40 \u{2764}50`],
  ['Undead', {type: 'undead', health: 50, level: 1, attack: 40, defence: 10}, `\u{1F396}1 \u{2694}40 \u{1F6E1}10 \u{2764}50`],
  ['Daemon', {type: 'daemon', health: 50, level: 1, attack: 10, defence: 40}, `\u{1F396}1 \u{2694}10 \u{1F6E1}40 \u{2764}50`],
  ['Vampire', {type: 'vampire', health: 50, level: 1, attack: 25, defence: 25}, `\u{1F396}1 \u{2694}25 \u{1F6E1}25 \u{2764}50`],
])(
  ('get tooltip "%s"'
  ),
  (heroType, data, expected) => {
    const result = new characterClasses[data.type](1).getTooltip();
    expect(result).toBe(expected);
  },
);
