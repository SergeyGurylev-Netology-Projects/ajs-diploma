import GamePlay from './GamePlay';
import Team from './Team';
import characterClasses from './characterClasses';
import PositionedCharacter from './PositionedCharacter';
import themes from './themes';

export default class GameState {
  static from(object) {
    // TODO: create object
    const characters = [];

    [object.teamPlayer, object.teamAI].forEach((team, teamIndex) => {
      for (const character of team) {
        const { ...rest } = character;
        const index = object.positions.findIndex(pos => pos.character === character);
        characters.push({
          character: rest,
          position: object.positions[index].position,
          teamName: teamIndex === 0 ? 'teamPlayer' : 'teamAI',
        });
      }
    });

    return {
      maxLevel: object.maxLevel,
      currentLevel: object.currentLevel,
      characterCount: object.characterCount,
      characters: characters,
    };
  }

  static onNewGameClick() {
    this.init();
  }

  static onSaveGameClick() {
    this.stateService.save(GameState.from(this));
  }

  static onLoadGameClick() {
    let restoredObject;
    try {
      restoredObject = this.stateService.load();
    } catch (e) {
      GamePlay.showError(e.message);
      return;
    }

    this.maxLevel = restoredObject.maxLevel;
    this.currentLevel = restoredObject.currentLevel;
    this.characterCount = restoredObject.characterCount;
    this.teamPlayer = new Team();
    this.teamAI = new Team();
    this.positions = [];
    this.selectedCell = undefined;
    this.atimate = false;
    this.gameOver = false;

    restoredObject.characters.forEach(el => {
      const character = new characterClasses[el.character.type](1);
      for (const key in el.character) {
        if (Object.hasOwn(el.character, key)) {
          character[key] = el.character[key];
        }
      }
      this[el.teamName].add(character);
      this.positions.push(new PositionedCharacter(character, el.position));
    });

    this.gamePlay.drawUi(Object.keys(themes)[this.currentLevel - 1]);
    this.gamePlay.redrawPositions(this.positions);
  }
}
