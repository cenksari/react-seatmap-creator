import React from 'react';

// hooks
import useClickOutside from '../hooks/useClickOutside';

// types
import type { ISeat } from '../types/types';

// interfaces
interface IProps {
  seat: ISeat;
  deleteSeat?: (row: string, seatId: string) => void;
  addEmptySeat?: (row: string, seatId: string, direction: 'left' | 'right') => void;
}

const Seat = React.memo(({ seat, addEmptySeat, deleteSeat }: IProps): React.JSX.Element => {
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
    addEmptySeat?.(seat.row, seat.id, direction);

    setMenuOpened((prev) => !prev);
  };

  /**
   * Handles the delete event on the seat by calling deleteSeat function if it exists.
   */
  const handleOnDelete = () => {
    deleteSeat?.(seat.row, seat.id);

    setMenuOpened((prev) => !prev);
  };

  const renderDropdown = (): React.JSX.Element => (
    <div className='flex flex-gap flex-column dropdown right'>
      {seat.status === 'available' && (
        <button type='button' onClick={() => handleOnClick('left')}>
          <span className='material-symbols-outlined'>arrow_back</span>
          Add space to the left
        </button>
      )}
      <button type='button' onClick={() => handleOnClick('right')}>
        <span className='material-symbols-outlined'>arrow_forward</span>
        Add space to the right
      </button>
      <button type='button' onClick={() => handleOnDelete()}>
        <span className='material-symbols-outlined'>delete</span>
        Delete selected {seat.status === 'empty' ? 'space' : 'seat'}
      </button>
    </div>
  );

  return (
    <div ref={ref} className='relative'>
      <div
        tabIndex={0}
        role='button'
        onKeyDown={() => {}}
        data-row-id={seat.row}
        data-seat-id={seat.id}
        onClick={() => setMenuOpened((prev) => !prev)}
        className={`seat ${seat.status} ${menuOpened ? 'active' : ''}`}
        title={seat.status === 'available' ? `${seat.row} ${seat.label}` : ''}
      >
        {seat.status === 'available' && seat.label}
      </div>
      {menuOpened && renderDropdown()}
    </div>
  );
});

Seat.displayName = 'Seat';

export default Seat;
