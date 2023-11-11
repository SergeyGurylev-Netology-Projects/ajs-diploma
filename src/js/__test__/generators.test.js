import {characterGenerator, generateTeam} from '../generators';
import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';
import Vampire from '../characters/Vampire';
import Undead from '../characters/Undead';
import Daemon from '../characters/Daemon';

test.each([
  ['1', [Bowman, Swordsman, Magician]],
  ['2', [Vampire, Undead, Daemon]],
  ['3', [Bowman, Swordsman, Magician, Vampire, Undead, Daemon]],
  ['4', [Bowman]],
  ['5', [Swordsman]],
  ['6', [Magician]],
  ['7', [Vampire]],
  ['8', [Undead]],
  ['9', [Daemon]],
])(
  ('generate character "%s"'
  ),
  (_, allowedTypes) => {
    const result = [];
    let character;
    for (let i=0; i < 1000; i++) {
      character = characterGenerator(allowedTypes, 1).next().value;
      if (character !== undefined) {
        result.push(character);
      }
    }
    expect(result.length).toBe(1000);
  },
);

test.each([
  ['1', [Bowman, Swordsman, Magician], 1, 3],
  ['2', [Vampire, Undead, Daemon], 2, 4],
  ['3', [Bowman, Swordsman, Magician, Vampire, Undead, Daemon], 3, 5],
  ['4', [Bowman], 1, 1],
  ['5', [Swordsman], 2, 2],
  ['6', [Magician], 3, 3],
  ['7', [Vampire], 2, 4],
  ['8', [Undead], 1, 5],
  ['9', [Daemon], 3, 6],
])(
  ('generate team "%s"'
  ),
  (_, allowedTypes, maxLevel, characterCount) => {
    const team = generateTeam(allowedTypes, maxLevel, characterCount);
    const result = team.participants.length;
    expect(result).toBe(characterCount);
  },
);

test.each([
  ['1', [Bowman, Swordsman, Magician], 1, 3],
  ['2', [Vampire, Undead, Daemon], 2, 4],
  ['3', [Bowman, Swordsman, Magician, Vampire, Undead, Daemon], 3, 5],
  ['4', [Bowman], 1, 1],
  ['5', [Swordsman], 2, 2],
  ['6', [Magician], 3, 3],
  ['7', [Vampire], 2, 4],
  ['8', [Undead], 1, 5],
  ['9', [Daemon], 3, 6],
])(
  ('generate team "%s"'
  ),
  (_, allowedTypes, maxLevel, characterCount) => {
    const team = generateTeam(allowedTypes, maxLevel, characterCount);
    const index = team.participants.findIndex(el => el.level <= 0 || el.level > maxLevel);
    expect(index).toBe(-1);
  },
);
