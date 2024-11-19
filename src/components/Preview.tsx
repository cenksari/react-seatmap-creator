import React from 'react';

// components
import Row from './Row';
import Seat from './Seat';
import Stage from './Stage';

// types
import type { ISeat } from '../types/types';

// interfaces
interface IProps {
  seatData: Map<string, ISeat[]>;
  closePreview: () => void;
}

const Preview = ({ seatData, closePreview }: IProps): React.JSX.Element => {
  return (
    <div className='container'>
      <Stage />

      <div className='seatmap'>
        {Array.from(seatData?.entries())?.map(([row, seatsInRow]) => (
          <Row preview row={row} key={row} dragHandleProps={null} empty={row.startsWith('empty-')}>
            {seatsInRow.map((seat) => (
              <Seat preview seat={seat} key={seat.id} />
            ))}
          </Row>
        ))}
      </div>

      <div className='flex flex-end buttons'>
        <button type='button' className='button black' onClick={() => closePreview()}>
          Close preview
        </button>
      </div>
    </div>
  );
};

export default Preview;