import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';

const characterClasses = {
  swordsman: Swordsman,
  bowman: Bowman,
  magician: Magician,
  daemon: Daemon,
  undead: Undead,
  vampire: Vampire,
};

export default characterClasses;
