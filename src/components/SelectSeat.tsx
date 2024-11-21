import React from 'react';

// types
import type { ISeat } from '../types/types';

// interfaces
interface IProps {
  seat: ISeat;
  selected: boolean;
  onSelect: () => void;
}

const SelectSeat = React.memo(({ seat, selected, onSelect }: IProps): React.JSX.Element => {
  return (
    <div>
      {seat.type === 'seat' ? (
        <div
          tabIndex={0}
          role='button'
          onKeyDown={() => {}}
          className={`${seat.type} ${selected ? 'active' : ''}`}
          onClick={() => onSelect()}
          title={seat.type === 'seat' ? `${seat.row} ${seat.label}` : ''}
        >
          {seat.type === 'seat' && seat.label}
        </div>
      ) : (
        <div
          className={`preview ${seat.type}`}
          title={seat.type === 'seat' ? `${seat.row} ${seat.label}` : ''}
        >
          {seat.type === 'seat' && seat.label}
        </div>
      )}
    </div>
  );
});

SelectSeat.displayName = 'SelectSeat';

export default SelectSeat;
