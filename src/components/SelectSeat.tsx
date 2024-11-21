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
  const isSeat = seat.type === 'seat';
  const title = isSeat ? `${seat.row} ${seat.label}` : '';
  const classNames = `${seat.type} ${selected && isSeat ? 'active' : ''}`;

  /**
   * Handles the key down event for the seat element. If the 'Enter' or space key is pressed,
   * it prevents the default action and triggers the onSelect callback.
   *
   * @param {React.KeyboardEvent<HTMLDivElement>} event - The keyboard event object.
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      onSelect();
    }
  };

  return (
    <div>
      {isSeat ? (
        <div
          tabIndex={0}
          role='button'
          title={title}
          onClick={onSelect}
          className={classNames}
          onKeyDown={handleKeyDown}
        >
          {seat.label}
        </div>
      ) : (
        <div className={`preview ${seat.type}`} title={title}>
          {seat.label}
        </div>
      )}
    </div>
  );
});

SelectSeat.displayName = 'SelectSeat';

export default SelectSeat;
