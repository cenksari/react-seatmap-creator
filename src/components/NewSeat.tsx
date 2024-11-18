import React from 'react';

// hooks
import useClickOutside from '../hooks/useClickOutside';

// types
import type { ISeat } from '../types/types';

// interfaces
interface IProps {
  seat: ISeat;
  addEmptySeat?: (row: string, seatId: string, direction: 'left' | 'right') => void;
  addAvailableSeat?: (row: string, seatId: string, direction: 'left' | 'right') => void;
}

const NewSeat = ({ seat, addEmptySeat, addAvailableSeat }: IProps): React.JSX.Element => {
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
    <div ref={ref} className='relative'>
      <button
        type='button'
        onClick={() => setMenuOpened((prev) => !prev)}
        className={`seat mini-button ${menuOpened ? 'active' : ''}`}
        data-tooltip-id='description'
        data-tooltip-content='Yeni koltuk ekle'
      >
        <span className='material-symbols-outlined'>add</span>
      </button>

      {menuOpened && (
        <div className='flex flex-gap flex-column dropdown'>
          <button type='button' onClick={() => handleSeatAction('right', addAvailableSeat)}>
            <span className='material-symbols-outlined'>event_seat</span>
            Koltuk ekle
          </button>
          <button type='button' onClick={() => handleSeatAction('right', addEmptySeat)}>
            <span className='material-symbols-outlined'>check_box_outline_blank</span>
            Boşluk ekle
          </button>
        </div>
      )}
    </div>
  );
};

export default NewSeat;
