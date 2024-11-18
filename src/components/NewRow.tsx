import React from 'react';

// hooks
import useClickOutside from '../hooks/useClickOutside';

// interfaces
interface IProps {
  addEmptyRow?: () => void;
  addSeatedRow?: (name: string) => void;
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
   *
   * @param {() => void} [callback] The callback function to call when the button is clicked.
   */
  const handleButtonClick = (callback?: () => void) => {
    if (callback) callback();

    setMenuOpened((prev) => !prev);
  };

  /**
   * Handles the click event on the "Add Seated Row" button.
   */
  const handleSeatedRowAdd = () => {
    const { name } = formValues;

    if (!name || name.trim() === '') return;

    handleButtonClick(() => addSeatedRow?.(name));

    setFormValues({ ...formValues, name: '' });
  };

  return (
    <div ref={ref} className='flex flex-gap-smallrow relative new-row'>
      <button
        type='button'
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
            Koltuklu sıra ekle
          </button>
          {formOpened && (
            <div className='flex flex-gap dropdown-form'>
              <input
                type='text'
                id='rowName'
                maxLength={3}
                name='rowName'
                value={formValues.name}
                placeholder='Sıra adı girin'
                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
              />
              <button type='button' onClick={() => handleSeatedRowAdd()}>
                Ekle
              </button>
            </div>
          )}
          <button type='button' onClick={() => handleButtonClick(addEmptyRow)}>
            <span className='material-symbols-outlined'>expand</span>
            Boş sıra / koridor ekle
          </button>
        </div>
      )}
    </div>
  );
};

export default NewRow;
