import React from 'react';

// hooks
import useClickOutside from '../hooks/useClickOutside';

// interfaces
interface IProps {
  row?: string;
  empty?: boolean;
  children?: React.ReactNode;
  editRowName?: (row: string, oldName: string) => void;
}

interface IFormProps {
  name: string;
  oldName: string;
}

const Row = React.memo(({ row, empty, children, editRowName }: IProps): React.JSX.Element => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [menuOpened, setMenuOpened] = React.useState<boolean>(false);

  const [formValues, setFormValues] = React.useState<IFormProps>({
    name: row || '',
    oldName: row || '',
  });

  useClickOutside(ref, (): void => {
    setMenuOpened(false);
  });

  /**
   * Handles the click event on the "Edit row" button.
   */
  const handleEditRowName = () => {
    const { name, oldName } = formValues;

    if (!name || name.trim() === '') return;

    editRowName?.(name, oldName);
  };

  return (
    <div data-row-id={row} className='flex flex-gap-small row'>
      {!empty ? (
        <>
          <div className='row-label'>{row}</div>
          <div ref={ref} className='relative'>
            <button
              type='button'
              className='seat mini-button'
              data-tooltip-id='description'
              data-tooltip-content='Edit row'
              onClick={() => setMenuOpened((prev) => !prev)}
            >
              <span className='material-symbols-outlined'>draw</span>
            </button>

            {menuOpened && (
              <div className='flex flex-gap flex-column dropdown'>
                <button type='button' className='active'>
                  <span className='material-symbols-outlined'>draw</span>
                  Edit row
                </button>
                <div className='flex flex-gap-small flex-column flex-v-center dropdown-form'>
                  <input
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                    type='text'
                    id='rowName'
                    maxLength={3}
                    name='rowName'
                    value={formValues.name}
                    placeholder='Enter row name'
                    onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                  />
                  <button type='button' onClick={() => handleEditRowName()}>
                    Update
                  </button>
                </div>
                <button type='button' onClick={() => setMenuOpened(false)}>
                  <span className='material-symbols-outlined'>close</span>
                  Exit editing
                </button>
              </div>
            )}
          </div>
          {children}
        </>
      ) : (
        <div className='row-label'>
          <span className='material-symbols-outlined'>arrow_forward</span>
        </div>
      )}
    </div>
  );
});

Row.displayName = 'Row';

export default Row;
