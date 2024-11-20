import React from 'react';

// hooks
import useClickOutside from '../hooks/useClickOutside';

// types
import type { ISeat } from '../types/types';

// interfaces
interface IProps {
  seat: ISeat;
  preview?: boolean;
  deleteSeat?: (row: string, seatId: string) => void;
  editSeatName?: (row: string, seatId: string, name: string) => void;
  addEmptySeat?: (row: string, seatId: string, direction: 'left' | 'right') => void;
}

interface IFormProps {
  id: string;
  name: string;
}

const Seat = React.memo(
  ({ seat, preview, addEmptySeat, editSeatName, deleteSeat }: IProps): React.JSX.Element => {
    const ref = React.useRef<HTMLDivElement>(null);

    const [formOpened, setFormOpened] = React.useState<boolean>(false);
    const [menuOpened, setMenuOpened] = React.useState<boolean>(false);

    const [formValues, setFormValues] = React.useState<IFormProps>({
      id: seat.id,
      name: seat.label,
    });

    /**
     * Resets the state of the Seat component back to its initial state.
     */
    const resetAll = () => {
      setMenuOpened(false);
      setFormOpened(false);
    };

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

    /**
     * Handles the submit event on the edit seat label form.
     *
     * @param {React.FormEvent<HTMLFormElement>} e - The event object from the form submission.
     */
    const handleEditSeatLabel = (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();

      const { name } = formValues;

      if (!name || name.trim() === '') return;

      editSeatName?.(seat.row, seat.id, formValues.name);

      resetAll();
    };

    /**
     * Handles a key press event to close open dropdown.
     *
     * @param {React.KeyboardEvent<HTMLInputElement>} e - The event object from the key press.
     */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Escape') {
        resetAll();
      }
    };

    /**
     * Handles the right-click event on the seat to toggle the menuOpened state.
     *
     * @param {React.MouseEvent} event - The event object from the right-click action.
     */
    const handleRightClick = (event: React.MouseEvent) => {
      event.preventDefault();

      setMenuOpened((prev) => !prev);
    };

    const renderDropdown = (): React.JSX.Element => (
      <div className='flex flex-gap flex-column dropdown right'>
        {seat.status === 'available' && (
          <>
            <button type='button' onClick={() => setFormOpened((prev) => !prev)}>
              <span className='material-symbols-outlined'>draw</span>
              Edit seat label
            </button>
            {formOpened && (
              <>
                <form
                  onSubmit={handleEditSeatLabel}
                  className='flex flex-gap-medium flex-column flex-v-center dropdown-form'
                >
                  <input
                    type='text'
                    id='seatName'
                    maxLength={3}
                    name='seatName'
                    autoComplete='off'
                    value={formValues.name}
                    onKeyDown={handleKeyDown}
                    placeholder='Enter seat label'
                    onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                  />
                  <button type='submit'>Update</button>
                </form>

                <button type='button' onClick={() => resetAll()}>
                  <span className='material-symbols-outlined'>close</span>
                  Exit editing
                </button>
              </>
            )}
            <button type='button' onClick={() => handleOnClick('left')}>
              <span className='material-symbols-outlined'>arrow_back</span>
              Add space to the left
            </button>
          </>
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
        {preview ? (
          <div
            className={`seat preview ${seat.status}`}
            title={seat.status === 'available' ? `${seat.row} ${seat.label}` : ''}
          >
            {seat.status === 'available' && seat.label}
          </div>
        ) : (
          <div
            tabIndex={0}
            role='button'
            onKeyDown={() => {}}
            onContextMenu={handleRightClick}
            onClick={() => setMenuOpened((prev) => !prev)}
            className={`seat ${seat.status} ${menuOpened ? 'active' : ''}`}
            title={seat.status === 'available' ? `${seat.row} ${seat.label}` : ''}
          >
            {seat.status === 'available' && seat.label}
          </div>
        )}
        {menuOpened && renderDropdown()}
      </div>
    );
  }
);

Seat.displayName = 'Seat';

export default Seat;
