import { useRef, useState } from 'react';

// hooks
import useClickOutside from '../hooks/useClickOutside';

// interfaces
interface IProps {
  addEmptyRow?: () => void;
  addSeatedRow?: (name: string) => boolean;
}

interface IFormProps {
  name: string;
}

const NewRow = ({ addEmptyRow, addSeatedRow }: IProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null);

  const [formOpened, setFormOpened] = useState<boolean>(false);
  const [menuOpened, setMenuOpened] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<IFormProps>({
    name: '',
  });

  /**
   * Resets the state of the NewRow component back to its initial state.
   * This includes setting the menu and form to be closed, and resetting the form
   * values to their initial state.
   */
  const resetAll = () => {
    setMenuOpened(false);
    setFormOpened(false);
    setFormValues({ ...formValues, name: '' });
  };

  useClickOutside(ref, (): void => resetAll());

  /**
   * Handles the click event on the button by calling the callback function if it exists
   * and toggling the menuOpened state.
   */
  const handleEmptyRowAdd = () => {
    addEmptyRow?.();

    resetAll();
  };

  /**
   * Handles the click event on the "Add Seated Row" button.
   *
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  const handleSeatedRowAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name } = formValues;

    if (!name || name.trim() === '') return;

    const add = addSeatedRow?.(name);

    if (add) {
      resetAll();
    }
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

  return (
    <div ref={ref} className='flex relative new-row'>
      <button
        type='button'
        data-tooltip-id='description'
        data-tooltip-content='New row'
        onClick={() => setMenuOpened((prev) => !prev)}
        className={`row-label mini-button ${menuOpened ? 'active' : ''}`}
      >
        <span className='material-symbols-outlined'>add</span>
      </button>

      {menuOpened && (
        <div className='flex flex-gap flex-column dropdown'>
          <button
            type='button'
            onClick={() => setFormOpened((prev) => !prev)}
            className={formOpened ? 'active' : 'passive'}
          >
            <span className='material-symbols-outlined'>more_horiz</span>
            Add new seated row
          </button>
          {formOpened && (
            <>
              <form
                onSubmit={handleSeatedRowAdd}
                className='flex flex-gap-medium flex-column flex-v-center dropdown-form'
              >
                <input
                  type='text'
                  id='rowName'
                  maxLength={3}
                  name='rowName'
                  autoComplete='off'
                  value={formValues.name}
                  onKeyDown={handleKeyDown}
                  placeholder='Enter row label'
                  onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                />
                <button type='submit'>Add</button>
              </form>

              <button type='button' onClick={() => resetAll()}>
                <span className='material-symbols-outlined'>close</span>
                Exit adding
              </button>
            </>
          )}
          <button type='button' onClick={() => handleEmptyRowAdd()}>
            <span className='material-symbols-outlined'>expand</span>
            Add new empty row / hallway
          </button>
        </div>
      )}
    </div>
  );
};

export default NewRow;
