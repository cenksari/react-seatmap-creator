import React from 'react';

// components
import Row from './Row';
import Seat from './Seat';
import Stage from './Stage';

// types
import type { ISeat } from '../types/types';

// interfaces
interface IProps {
  text?: string;
  seatData: Map<string, ISeat[]>;
  togglePreview: () => void;
}

const Preview = ({ text, seatData, togglePreview }: IProps): React.JSX.Element => {
  return (
    <div className='container'>
      <Stage text={text} />

      <div className='seatmap scroll'>
        {Array.from(seatData?.entries())?.map(([row, seatsInRow]) => (
          <Row preview row={row} key={row} dragHandleProps={null} empty={row.startsWith('empty-')}>
            {seatsInRow.map((seat) => (
              <Seat preview seat={seat} key={seat.id} />
            ))}
          </Row>
        ))}
      </div>

      <div className='flex flex-end buttons'>
        <button type='button' className='button black' onClick={() => togglePreview()}>
          Close preview
        </button>
      </div>
    </div>
  );
};

export default Preview;
