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
  #participants;

  constructor() {
    this.#participants = new Set();
    this[Symbol.iterator] = this.iterator;
  }

  iterator() {
    let current = 0;
    const participants = [...this.#participants];

    return {
      next() {
        if (current < participants.length) {
          return {
            done: false,
            value: participants[current++],
          };
        }

        return {
          done: true,
        };
      },
    };
  }

  length() {
    return this.#participants.size;
  }

  add(character) {
    this.#participants.add(character);
  }

  delete(character) {
    this.#participants.delete(character);
  }

  includes(character) {
    return this.#participants.has(character);
  }

  getStrongest() {
    return [...this.#participants].reduce((a, b) => (a.attack > b.attack ? a : b));
  }
}
