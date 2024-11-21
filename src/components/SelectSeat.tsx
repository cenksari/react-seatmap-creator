import React from 'react';

// types
import type { ISeat } from '../types/types';

// interfaces
interface IProps {
  seat: ISeat;
  onSelect?: () => void;
}

const SelectSeat = React.memo(({ seat, onSelect }: IProps): React.JSX.Element => {
  const handleOnSelect = () => {
    onSelect?.();
  };

  return (
    <div>
      {seat.type === 'seat' ? (
        <div
          tabIndex={0}
          role='button'
          onKeyDown={() => {}}
          className={`${seat.type}`}
          onClick={() => handleOnSelect()}
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
