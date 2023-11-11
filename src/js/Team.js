/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
  // TODO: write your logic here
  constructor() {
    this.participants = [];
  }

  add(character) {
    this.participants.push(character);
  }

  delete(character) {
    const index = this.participants.findIndex(el => character === el);
    if (index >= 0) {
      this.participants.splice(index, 1);
    }
  }

  includes(character) {
    return this.participants.includes(character);
  }
}
