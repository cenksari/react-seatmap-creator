import React from 'react';

// hooks
import useClickOutside from '../hooks/useClickOutside';

// types
import type { ISeat } from '../types/types';

// interfaces
interface IProps {
  seat: ISeat;
  addEmptySeat?: (row: string, seatId: string, direction: 'left' | 'right') => void;
}

const Seat = React.memo(({ seat, addEmptySeat }: IProps): React.JSX.Element => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [menuOpened, setMenuOpened] = React.useState<boolean>(false);

  useClickOutside(ref, (): void => setMenuOpened(false));

  /**
   * Handles the click event on the seat by calling addEmptySeat function if it exists
   * and toggling the menuOpened state.
   *
   * @param {string} direction The direction of the empty seat to be added.
   */
  const handleOnClick = (direction: 'left' | 'right') => {
    if (addEmptySeat && typeof addEmptySeat === 'function') {
      addEmptySeat(seat.row, seat.id, direction);
    }

    setMenuOpened((prev) => !prev);
  };

  const renderDropdown = (): React.JSX.Element => (
    <div className='flex flex-gap flex-column dropdown'>
      {seat.status === 'available' && (
        <button type='button' onClick={() => handleOnClick('left')}>
          <span className='material-symbols-outlined'>arrow_back</span>
          Soluna boşluk ekle
        </button>
      )}
      <button type='button' onClick={() => handleOnClick('right')}>
        <span className='material-symbols-outlined'>arrow_forward</span>
        Sağına boşluk ekle
      </button>
    </div>
  );

  return (
    <div ref={ref} className='relative'>
      <div
        tabIndex={0}
        role='button'
        data-seat-id={seat.id}
        data-row-id={seat.row}
        onKeyDown={() => {}}
        onClick={() => setMenuOpened((prev) => !prev)}
        className={`seat ${seat.status} ${menuOpened ? 'active' : ''}`}
      >
        {seat.status === 'available' && seat.label}
      </div>
      {menuOpened && renderDropdown()}
    </div>
  );
});

Seat.displayName = 'Seat';

export default Seat;
