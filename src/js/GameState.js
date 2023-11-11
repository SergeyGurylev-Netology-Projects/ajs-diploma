export default class GameState {
  static from(object) {
    // TODO: create object
    const characters = [];

    [...object.teamPlayer.participants, ...object.teamAI.participants].forEach(character => {
      const { ...rest } = character;
      const index = object.positions.findIndex(pos => pos.character === character);
      characters.push({
        character: rest,
        position: object.positions[index].position,
        teamName: object.teamPlayer.includes(character) ? 'teamPlayer' : 'teamAI',
      });
    });

    return {
      maxLevel: object.maxLevel,
      currentLevel: object.currentLevel,
      characterCount: object.characterCount,
      characters: characters,
    };
  }
}
