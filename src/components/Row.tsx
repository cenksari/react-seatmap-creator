/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

// hooks
import useClickOutside from '../hooks/useClickOutside';

// interfaces
interface IProps {
  row: string;
  empty: boolean;
  children?: React.ReactNode;
  deleteRow?: (row: string) => void;
  editRowName?: (row: string, oldName: string) => void;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
}

interface IFormProps {
  name: string;
  oldName: string;
}

const Row = React.memo(
  ({
    row,
    empty,
    children,
    deleteRow,
    editRowName,
    dragHandleProps,
  }: IProps): React.JSX.Element => {
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
     *
     * @param {React.FormEvent<HTMLFormElement>} e
     */
    const handleEditRowName = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const { name, oldName } = formValues;

      if (!name || name.trim() === '') return;

      editRowName?.(name, oldName);
    };

    /**
     * Handles the click event on the "Delete row" button.
     * Calls the callback function to delete the row if it exists and
     * toggles the menuOpened state.
     */
    const handleDeleteRow = () => {
      deleteRow?.(row);

      setMenuOpened(false);
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
      <div data-row-id={row} className='flex flex-gap-small row'>
        {!empty ? (
          <>
            <div className='row-label'>{row}</div>
            <div ref={ref} className='relative'>
              <div className='flex flex-gap-small'>
                <button
                  type='button'
                  className='seat mini-button'
                  data-tooltip-id='description'
                  data-tooltip-content='Edit row'
                  onClick={() => setMenuOpened((prev) => !prev)}
                >
                  <span className='material-symbols-outlined'>draw</span>
                </button>
                <div
                  tabIndex={0}
                  role='button'
                  {...dragHandleProps}
                  aria-label={`Drag row ${row}`}
                  data-tooltip-id='description'
                  data-tooltip-content='Order row'
                  className='seat mini-button drag-handle'
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <span className='material-symbols-outlined'>menu</span>
                </div>
              </div>

              {menuOpened && (
                <div className='flex flex-gap flex-column dropdown'>
                  <button type='button' className='active no-pointer-events'>
                    <span className='material-symbols-outlined'>draw</span>
                    Edit row label
                  </button>
                  <form
                    onSubmit={handleEditRowName}
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
                    <button type='submit'>Update</button>
                  </form>
                  <button type='button' onClick={() => handleDeleteRow()}>
                    <span className='material-symbols-outlined'>delete</span>
                    Delete row
                  </button>
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
          <>
            <div className='row-label'>
              <span className='material-symbols-outlined'>arrow_forward</span>
            </div>
            <button
              type='button'
              className='seat mini-button'
              data-tooltip-id='description'
              data-tooltip-content='Delete row'
              onClick={() => handleDeleteRow()}
            >
              <span className='material-symbols-outlined'>delete</span>
            </button>
            <div
              tabIndex={0}
              role='button'
              {...dragHandleProps}
              aria-label={`Drag row ${row}`}
              data-tooltip-id='description'
              data-tooltip-content='Order row'
              className='seat mini-button drag-handle'
              onMouseDown={(e) => e.preventDefault()}
            >
              <span className='material-symbols-outlined'>menu</span>
            </div>
          </>
        )}
      </div>
    );
  }
);

Row.displayName = 'Row';

export default Row;
