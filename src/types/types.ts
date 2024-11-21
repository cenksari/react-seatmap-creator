export interface ISeatMap {
  id: string;
  name: string;
  venueId: number;
  venueName: string;
  blockId: number;
  blockName: string;
  stageText: string;
  seatMapData?: ISeat[];
}

export interface ISeat {
  id: string;
  row: string;
  type: string;
  label: string;
}

export type ISeatType = 'seat' | 'space';

export type IDirection = 'left' | 'right';
