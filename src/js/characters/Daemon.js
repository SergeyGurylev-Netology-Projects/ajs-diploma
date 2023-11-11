import Character from '../Character';

export default class Daemon extends Character {
  constructor(level) {
    super(1, 'daemon');
    this.attack = 10;
    this.defence = 40;
    this.rangeMove = 1;
    this.rangeAttack = 4;
    this._initLevel(level);
  }
}
