import { useRef, useState } from 'react';

// hooks
import useClickOutside from '../hooks/useClickOutside';

// types
import type { ISeat, ISeatType, IDirection } from '../types/types';

// interfaces
interface IProps {
  seat: ISeat;
  rowIndex: number;
  addSeat?: (row: string, seatId: string, type: ISeatType, direction: IDirection) => void;
}

const NewSeat: React.FC<IProps> = ({ seat, rowIndex, addSeat }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [menuOpened, setMenuOpened] = useState<boolean>(false);

  useClickOutside(ref, (): void => setMenuOpened(false));

  /**
   * Handles the click event on the button by calling the callback function if it exists
   * and toggling the menuOpened state.
   *
   * @param {() => void} [callback] - The callback function to call when the button is clicked.
   * @param {IDirection} direction - The direction to pass to the callback function.
   */
  const handleSeatAction = (
    direction: IDirection,
    type: ISeatType,
    callback?: (row: string, seatId: string, type: ISeatType, direction: IDirection) => void
  ): void => {
    if (callback) callback(seat.row, seat.id, type, direction);

    setMenuOpened(false);
  };

  /**
   * Handles the right-click event on the seat to toggle the menuOpened state.
   *
   * @param {React.MouseEvent} event - The event object from the right-click action.
   */
  const handleRightClick = (event: React.MouseEvent): void => {
    event.preventDefault();

    setMenuOpened((prev) => !prev);
  };

  return (
    <div ref={ref} className='relative seat-buttons'>
      <button
        type='button'
        onContextMenu={handleRightClick}
        onClick={() => setMenuOpened((prev) => !prev)}
        className={`mini-button ${menuOpened ? 'active' : ''}`}
      >
        <span className='material-symbols-outlined'>add</span>
      </button>

      {menuOpened && (
        <div
          className={
            rowIndex > 5
              ? 'flex flex-gap flex-column dropdown top-left'
              : 'flex flex-gap flex-column dropdown bottom-left'
          }
        >
          <button type='button' onClick={() => handleSeatAction('right', 'seat', addSeat)}>
            <span className='material-symbols-outlined'>event_seat</span>
            Add new seat
          </button>
          <button type='button' onClick={() => handleSeatAction('right', 'space', addSeat)}>
            <span className='material-symbols-outlined'>check_box_outline_blank</span>
            Add new space
          </button>
        </div>
      )}
    </div>
  );
};

export default NewSeat;
