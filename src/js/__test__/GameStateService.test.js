import GameStateService from '../GameStateService';
import Character from "../Character";

jest.mock('../GameStateService');

beforeEach(() => {
  jest.resetAllMocks()
});

const stateService = new GameStateService(undefined);

const mockLoadSuccessful = (() => {
  return {state: 'OK'};
})

const mockLoadError = (() => {
  throw new Error('Invalid state');
})

test('load game successful', () => {
  const result = stateService.load.mockReturnValue(mockLoadSuccessful())();
  expect(result.state).toBe('OK');
});

test('load game error', () => {
  try {
    const result = stateService.load.mockReturnValue(mockLoadError())();
    expect(true).toBe(false);
  } catch (e) {
    expect(e.message).toBe('Invalid state');
  }
});
