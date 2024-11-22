import { memo, useRef, useState } from 'react';

import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

// hooks
import useClickOutside from '../hooks/useClickOutside';

// interfaces
interface IProps {
  row: string;
  empty: boolean;
  rowIndex: number;
  preview?: boolean;
  children?: React.ReactNode;
  deleteRow?: (row: string) => void;
  editRowName?: (row: string, oldName: string) => void;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

interface IFormProps {
  name: string;
  oldName: string;
}

const Row = memo(
  ({
    row,
    empty,
    preview,
    rowIndex,
    children,
    deleteRow,
    editRowName,
    dragHandleProps,
  }: IProps): JSX.Element => {
    const ref = useRef<HTMLDivElement>(null);

    const [menuOpened, setMenuOpened] = useState<boolean>(false);
    const [formValues, setFormValues] = useState<IFormProps>({
      name: row || '',
      oldName: row || '',
    });

    /**
     * Resets the state of the Row component back to its initial state.
     * This includes setting the menu to be closed.
     */
    const resetAll = (): void => {
      setMenuOpened(false);
    };

    useClickOutside(ref, (): void => resetAll());

    /**
     * Handles the click event on the "Edit row" button.
     *
     * @param {React.FormEvent<HTMLFormElement>} e - The event object from the form submission.
     */
    const handleEditRowName = (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();

      const { name, oldName } = formValues;

      if (!name || name.trim() === '') return;

      editRowName?.(name, oldName);

      resetAll();
    };

    /**
     * Handles the click event on the "Delete row" button.
     * Calls the callback function to delete the row if it exists and
     * toggles the menuOpened state.
     */
    const handleDeleteRow = (): void => {
      deleteRow?.(row);

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
    const handleRightClick = (event: React.MouseEvent): void => {
      event.preventDefault();

      setMenuOpened((prev) => !prev);
    };

    return (
      <div className='flex flex-gap-small row'>
        {!empty ? (
          <>
            <div className='row-label'>{row}</div>
            {!preview && (
              <div ref={ref} className='relative'>
                <div className='flex flex-gap-small row-buttons'>
                  <button
                    type='button'
                    data-tooltip-id='description'
                    data-tooltip-content='Edit row'
                    onContextMenu={handleRightClick}
                    onClick={() => setMenuOpened((prev) => !prev)}
                    className={menuOpened ? 'mini-button active' : 'mini-button'}
                  >
                    <span className='material-symbols-outlined'>draw</span>
                  </button>
                  <div
                    tabIndex={0}
                    role='button'
                    {...dragHandleProps}
                    aria-label={`Drag row ${row}`}
                    data-tooltip-id='description'
                    data-tooltip-content='Move row'
                    className='mini-button drag-handle'
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <span className='material-symbols-outlined'>menu</span>
                  </div>
                </div>

                {menuOpened && (
                  <div
                    className={
                      rowIndex > 4
                        ? 'flex flex-gap flex-column dropdown top-right'
                        : 'flex flex-gap flex-column dropdown bottom-right'
                    }
                  >
                    <button type='button' className='active no-pointer-events'>
                      <span className='material-symbols-outlined'>draw</span>
                      Edit row label
                    </button>
                    <form
                      onSubmit={handleEditRowName}
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
                      <button type='submit'>Update</button>
                    </form>
                    <button type='button' onClick={() => handleDeleteRow()}>
                      <span className='material-symbols-outlined'>delete</span>
                      Delete row
                    </button>
                  </div>
                )}
              </div>
            )}
            {children}
          </>
        ) : (
          <>
            <div className='row-label'>
              <span className='material-symbols-outlined'>arrow_forward</span>
            </div>
            {!preview && (
              <>
                <button
                  type='button'
                  className='mini-button'
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
                  className='mini-button drag-handle'
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <span className='material-symbols-outlined'>menu</span>
                </div>
              </>
            )}
          </>
        )}
      </div>
    );
  }
);

Row.displayName = 'Row';

export default Row;
