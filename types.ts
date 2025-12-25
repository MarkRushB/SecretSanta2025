
export interface Participant {
  id: string;
  name: string;
}

export interface DrawingResult {
  giver: string;
  receiver: string;
}

export enum GameStage {
  SETUP = 'SETUP',
  READY_TO_DRAW = 'READY_TO_DRAW',
  DRAWING_ANIMATION = 'DRAWING_ANIMATION',
  REVEAL = 'REVEAL',
  FINISHED = 'FINISHED'
}
