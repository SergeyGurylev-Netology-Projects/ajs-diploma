import Character from '../Character';

export default class Vampire extends Character {
  constructor(level) {
    super(1, 'vampire');
    this.attack = 25;
    this.defence = 25;
    this.rangeMove = 2;
    this.rangeAttack = 2;
    this._initLevel(level);
  }
}
