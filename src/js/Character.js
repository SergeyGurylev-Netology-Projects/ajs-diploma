/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    // TODO: выбросите исключение, если кто-то использует "new Character()"
    if (new.target.name === 'Character') {
      throw new Error('it is forbidden to create instances of Character');
    }
  }

  _initLevel(level) {
    while (this.level < level) {
      this.levelUp();
    }
  }

  getTooltip() {
    return `\u{1F396}${this.level} \u{2694}${this.attack} \u{1F6E1}${this.defence} \u{2764}${this.health}`;
  }

  damage(points) {
    this.health -= points;
    this.health = Math.max(this.health, 0);
  }

  levelUp() {
    if (this.health <= 0) {
      throw new Error('It is impossible to raise the level of a deceased character');
    }

    this.attack = (Math.max(this.attack, this.attack * (this.health + 80) / 100).toFixed(2));
    this.defence = (Math.max(this.defence, this.defence * (this.health + 80) / 100).toFixed(2));
    this.health = Math.min(this.health + 80, 100);
    this.level += 1;
  }
}
