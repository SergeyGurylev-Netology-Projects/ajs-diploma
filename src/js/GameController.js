import themes from './themes';
import characterClasses from './characterClasses';
import { generateTeam } from './generators';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';
import PositionedCharacter from './PositionedCharacter';
import GamePlay from './GamePlay';
import GameState from './GameState';
import Team from './Team';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.addListeners();
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService

    this.maxLevel = 4;
    this.currentLevel = 1;
    this.characterCount = 2;
    // this.characterCount = Math.min(this.characterCount, this.gamePlay.boardSize * 2);
    this.teamPlayer = undefined;
    this.teamAI = undefined;
    this.positions = [];

    this.gamePlay.drawUi(Object.keys(themes)[this.currentLevel - 1]);
    this.makeCharacters();
    this.gamePlay.redrawPositions(this.positions);
    this.selectedCell = undefined;
    this.atimate = false;
    this.gameOver = false;
  }

  addListeners() {
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
  }

  makeCharacters() {
    if (this.teamPlayer !== undefined) {
      const newTeam = generateTeam(
        [Bowman, Swordsman, Magician],
        this.currentLevel,
        this.characterCount - this.teamPlayer.participants.length,
      );

      this.teamPlayer.participants.forEach(el => newTeam.add(el));
      this.teamPlayer = newTeam;
    } else {
      this.teamPlayer = generateTeam(
        [Bowman, Swordsman, Magician],
        this.currentLevel,
        this.characterCount,
      );
    }

    this.teamAI = generateTeam([Vampire, Undead, Daemon], this.currentLevel, this.characterCount);
    this.positions = [];

    let index;
    let vindex;
    let hindex;

    [this.teamPlayer, this.teamAI].forEach((team, teamIndex) => {
      for (let i = 0; i < team.participants.length;) {
        vindex = Math.trunc(Math.random() * this.gamePlay.boardSize);
        hindex = Math.trunc(Math.random() * 2);
        index = vindex
          * this.gamePlay.boardSize
          + (teamIndex === 0 ? hindex : this.gamePlay.boardSize - hindex - 1);

        if (!this.getCharacterByPosition(index)) {
          this.positions.push(new PositionedCharacter(team.participants[i], index));
          i += 1;
        }
      }
    });
  }

  getCharacterByPosition(index) {
    return this.positions.find(el => el.position === index);
  }

  deleteCharacterByPosition(index) {
    const positionCharacter = this.getCharacterByPosition(index);
    if (positionCharacter) {
      this.teamPlayer.delete(positionCharacter.character);
      this.teamAI.delete(positionCharacter.character);

      const posIndex = this.positions.findIndex(el => el.position === index);
      if (posIndex !== -1) {
        this.positions.splice(posIndex, 1);
      }
    }
  }

  isDistanceAvailable(indexTo, typeRange) {
    const { boardSize } = this.gamePlay;
    const { character } = this.getCharacterByPosition(this.selectedCell);
    const availableRange = character[typeRange];

    const vrange = Math.abs(Math.trunc(this.selectedCell / boardSize)
      - Math.trunc(indexTo / boardSize));
    const hrange = Math.abs((this.selectedCell % boardSize) - (indexTo % boardSize));

    return (Math.max(vrange, hrange) <= availableRange);
  }

  dealMove(index) {
    const positionCharacter = this.getCharacterByPosition(this.selectedCell);
    positionCharacter.position = index;
    this.gamePlay.redrawPositions(this.positions);
    this.gamePlay.deselectCell(this.selectedCell);
    this.gamePlay.deselectCell(index);
    this.selectedCell = undefined;

    if (this.teamPlayer.includes(positionCharacter.character)) {
      this.turnAI();
    }
  }

  dealDamage(index) {
    const attacker = this.getCharacterByPosition(this.selectedCell).character;
    const target = this.getCharacterByPosition(index).character;
    const damage = Math.max(attacker.attack - target.defence, (attacker.attack * 0.1).toFixed(2));

    this.atimate = true;

    this.gamePlay.showDamage(index, damage).then(() => {
      target.damage(damage);
      if (!target.health) {
        this.deleteCharacterByPosition(index);
      }
      this.gamePlay.redrawPositions(this.positions);
      this.gamePlay.deselectCell(this.selectedCell);
      this.gamePlay.deselectCell(index);
      this.selectedCell = undefined;
      this.atimate = false;

      if (this.teamPlayer.includes(attacker)) {
        this.turnAI();
      }

      if (!this.teamPlayer.participants.length) {
        // Game over
        this.gameOver = true;
      } else if (!this.teamAI.participants.length) {
        this.levelUp();
      }
    });
  }

  levelUp() {
    if (this.currentLevel === this.maxLevel) {
      // Game over
      this.gameOver = true;
    } else {
      this.currentLevel += 1;
      this.characterCount += 1;
      this.teamPlayer.participants.forEach(el => el.levelUp());

      this.gamePlay.drawUi(Object.keys(themes)[this.currentLevel - 1]);
      this.makeCharacters();
      this.gamePlay.redrawPositions(this.positions);
      this.selectedCell = undefined;
    }
  }

  turnAI() {
    if (!this.teamAI.participants.length) {
      return;
    }

    const attacker = this.teamAI.participants.reduce((a, b) => (a.attack > b.attack ? a : b));
    const target = this.teamPlayer.participants.reduce((a, b) => (a.attack > b.attack ? a : b));
    const attackerPos = this.positions.find(el => el.character === attacker);
    const targetPos = this.positions.find(el => el.character === target);

    this.selectedCell = attackerPos.position;

    if (this.isDistanceAvailable(targetPos.position, 'rangeAttack')) {
      this.dealDamage(targetPos.position);
    } else {
      const indexMove = this.calcFieldToMove(attackerPos, targetPos);
      if (indexMove !== undefined) {
        this.dealMove(indexMove);
      }
    }
  }

  calcFieldToMove(attackerPos, targetPos) {
    let result;

    const { boardSize } = this.gamePlay;
    const vindexAttacker = Math.trunc(attackerPos.position / boardSize);
    const hindexAttacker = attackerPos.position % boardSize;
    const vindexTarget = Math.trunc(targetPos.position / boardSize);
    const hindexTarget = targetPos.position % boardSize;

    const voffset = Math.min(
      Math.abs(vindexTarget - vindexAttacker),
      attackerPos.character.rangeMove,
    );
    const hoffset = Math.min(
      Math.abs(hindexTarget - hindexAttacker),
      attackerPos.character.rangeMove,
    );

    const vdirection = Math.sign(vindexTarget - vindexAttacker);
    const hdirection = Math.sign(hindexTarget - hindexAttacker);

    for (let v = voffset; v >= 0; v--) {
      for (let h = hoffset; h >= 0; h--) {
        result = (vindexAttacker + v * vdirection) * boardSize + (hindexAttacker + h * hdirection);
        if (this.getCharacterByPosition(result) === undefined) {
          return result;
        }
      }
    }

    return undefined;
  }

  onCellClick(index) {
    // TODO: react to click
    if (this.gameOver || this.atimate) return;

    const characterPosition = this.getCharacterByPosition(index);
    if (characterPosition) {
      if (this.teamAI.includes(characterPosition.character)) {
        if (this.selectedCell !== undefined) {
          // Attack
          if (this.isDistanceAvailable(index, 'rangeAttack')) {
            this.dealDamage(index);
          } else {
            GamePlay.showMessage('too much distance');
          }
        } else {
          GamePlay.showMessage('this is AI character');
        }
      } else if (this.selectedCell === index) {
        // Deselect character
        this.gamePlay.deselectCell(this.selectedCell);
        this.selectedCell = undefined;
      } else {
        // Select character
        if (this.selectedCell !== undefined) {
          this.gamePlay.deselectCell(this.selectedCell);
        }
        this.selectedCell = index;
        this.gamePlay.selectCell(index);
      }
    } else if (this.selectedCell !== undefined) {
      // Move character
      if (this.isDistanceAvailable(index, 'rangeMove')) {
        this.dealMove(index);
      } else {
        GamePlay.showMessage('too much distance');
      }
    } else {
      GamePlay.showMessage('this is empty field');
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (this.gameOver || this.atimate) return;

    const characterPosition = this.getCharacterByPosition(index);
    if (characterPosition) {
      // console.log(characterPosition);
      // console.log(characterPosition.character);
      this.gamePlay.showCellTooltip(characterPosition.character.getTooltip(), index);
    }

    if (this.selectedCell !== undefined) {
      if (characterPosition) {
        if (this.teamAI.includes(characterPosition.character)) {
          if (this.isDistanceAvailable(index, 'rangeAttack')) {
            this.gamePlay.selectCell(index, 'red');
            this.gamePlay.setCursor('crosshair');
          } else {
            this.gamePlay.setCursor('not-allowed');
          }
        } else {
          this.gamePlay.setCursor('pointer');
        }
      } else if (this.isDistanceAvailable(index, 'rangeMove')) {
        this.gamePlay.selectCell(index, 'green');
        this.gamePlay.setCursor('pointer');
      } else {
        this.gamePlay.setCursor('not-allowed');
      }
    } else {
      this.gamePlay.setCursor('pointer');
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.gameOver || this.atimate) return;

    if (this.getCharacterByPosition(index)) {
      this.gamePlay.hideCellTooltip(index);
    }
    if (this.selectedCell !== index) {
      this.gamePlay.deselectCell(index);
    }
  }

  onNewGameClick() {
    this.init();
  }

  onSaveGameClick() {
    this.stateService.save(GameState.from(this));
  }

  onLoadGameClick() {
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
