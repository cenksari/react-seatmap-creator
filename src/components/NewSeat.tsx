import React from 'react';

// hooks
import useClickOutside from '../hooks/useClickOutside';

// types
import type { ISeat } from '../types/types';

// interfaces
interface IProps {
  seat: ISeat;
  rowIndex: number;
  addSeat?: (row: string, seatId: string, direction: 'left' | 'right') => void;
  addSpace?: (row: string, seatId: string, direction: 'left' | 'right') => void;
}

const NewSeat = ({ seat, rowIndex, addSeat, addSpace }: IProps): React.JSX.Element => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [menuOpened, setMenuOpened] = React.useState<boolean>(false);

  useClickOutside(ref, (): void => setMenuOpened(false));

  /**
   * Handles the click event on the button by calling the callback function if it exists
   * and toggling the menuOpened state.
   *
   * @param {() => void} [callback] The callback function to call when the button is clicked.
   * @param {'left' | 'right'} direction The direction to pass to the callback function.
   */
  const handleSeatAction = (
    direction: 'left' | 'right',
    callback?: (row: string, seatId: string, direction: 'left' | 'right') => void
  ) => {
    if (callback) callback(seat.row, seat.id, direction);

    setMenuOpened(false);
  };

  return (
    <div ref={ref} className='relative seat-buttons'>
      <button
        type='button'
        data-tooltip-id='description'
        data-tooltip-content='Add new seat'
        onClick={() => setMenuOpened((prev) => !prev)}
        className={`mini-button ${menuOpened ? 'active' : ''}`}
      >
        <span className='material-symbols-outlined'>add</span>
      </button>

      {menuOpened && (
        <div
          className={
            rowIndex > 8
              ? 'flex flex-gap flex-column dropdown top-left'
              : 'flex flex-gap flex-column dropdown bottom-left'
          }
        >
          <button type='button' onClick={() => handleSeatAction('right', addSeat)}>
            <span className='material-symbols-outlined'>event_seat</span>
            Add new seat
          </button>
          <button type='button' onClick={() => handleSeatAction('right', addSpace)}>
            <span className='material-symbols-outlined'>check_box_outline_blank</span>
            Add new space
          </button>
        </div>
      )}
    </div>
  );
};

export default NewSeat;
