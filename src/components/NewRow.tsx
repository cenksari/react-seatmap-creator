import React from 'react';

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

const NewRow = ({ addEmptyRow, addSeatedRow }: IProps): React.JSX.Element => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [formOpened, setFormOpened] = React.useState<boolean>(false);
  const [menuOpened, setMenuOpened] = React.useState<boolean>(false);

  const [formValues, setFormValues] = React.useState<IFormProps>({
    name: '',
  });

  useClickOutside(ref, (): void => {
    setMenuOpened(false);
    setFormOpened(false);
  });

  /**
   * Handles the click event on the button by calling the callback function if it exists
   * and toggling the menuOpened state.
   */
  const handleEmptyRowAdd = () => {
    addEmptyRow?.();

    setMenuOpened(false);
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
      setFormValues({ ...formValues, name: '' });

      setMenuOpened(false);
    }
  };

  /**
   * Handles a key press event to close open dropdown.
   *
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The event object from the key press.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Escape') {
      setMenuOpened(false);
    }
  };

  return (
    <div ref={ref} className='flex flex-gap-smallrow relative new-row'>
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
            onClick={() => setFormOpened(!formOpened)}
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
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  type='text'
                  id='rowName'
                  maxLength={3}
                  name='rowName'
                  value={formValues.name}
                  onKeyDown={handleKeyDown}
                  placeholder='Enter row label'
                  onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                />
                <button type='submit'>Add</button>
              </form>

              <button type='button' onClick={() => setMenuOpened(false)}>
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
