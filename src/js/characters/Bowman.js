import Character from '../Character';

export default class Bowman extends Character {
  constructor(level) {
    super(1, 'bowman');
    this.attack = 25;
    this.defence = 25;
    this.rangeMove = 2;
    this.rangeAttack = 2;
    this._initLevel(level);
  }
}
