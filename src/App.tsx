/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import toast, { Toaster } from 'react-hot-toast';

import { v4 as uuidv4 } from 'uuid';
import { Tooltip } from 'react-tooltip';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

// styles
import './styles/creator.css';

// data
import data from './data/data.json';

// components
import Row from './components/Row';
import Seat from './components/Seat';
import Stage from './components/Stage';
import NewRow from './components/NewRow';
import NewSeat from './components/NewSeat';
import Preview from './components/Preview';

// types
import type { ISeat } from './types/types';

const App = (): React.JSX.Element => {
  const [preview, setPreview] = React.useState<boolean>(false);
  const [seatData, setSeatData] = React.useState<Map<string, ISeat[]>>(new Map());

  const groupByRow = (dataToGroup: ISeat[]) =>
    dataToGroup.reduce((acc, seat) => {
      const currentRow = acc.get(seat.row) || [];

      return new Map(acc).set(seat.row, [...currentRow, seat]);
    }, new Map<string, ISeat[]>());

  React.useEffect(() => {
    setSeatData(groupByRow(data));
  }, []);

  /**
   * Adds a new seat to the seat data.
   * Inserts a new empty or available seat to the left or right of a given seat.
   *
   * @param {string} row The row identifier for the seat.
   * @param {string} seatId The id of the seat to insert the new seat next to.
   * @param {'left' | 'right'} direction The direction of the insertion.
   * @param {'empty' | 'available'} seatType The type of the new seat.
   */
  const addSeat = (
    row: string,
    seatId: string,
    direction: 'left' | 'right',
    seatType: 'empty' | 'available'
  ) => {
    setSeatData((prevSeatData) => {
      const newSeatData = new Map(prevSeatData);
      const seatsInRow = newSeatData.get(row) || [];
      const seatIndex = seatsInRow.findIndex((seat) => seat.id === seatId);

      if (seatIndex === -1) return prevSeatData;

      const newSeat: ISeat = {
        id: uuidv4(),
        row,
        label:
          seatType === 'available'
            ? (
                Math.max(
                  ...seatsInRow
                    .filter((seat) => seat.status === 'available')
                    .map((seat) => parseInt(seat.label, 10)),
                  0
                ) + 1
              ).toString()
            : '0',
        status: seatType,
      };

      seatsInRow.splice(seatIndex + (direction === 'right' ? 1 : 0), 0, newSeat);

      newSeatData.set(row, [...seatsInRow]);

      return newSeatData;
    });
  };

  /**
   * Adds a new empty seat to the specified row and seat ID in the given direction.
   *
   * @param {string} row - The row identifier where the seat will be added.
   * @param {string} seatId - The seat identifier adjacent to where the new seat will be added.
   * @param {'left' | 'right'} direction - The direction relative to the specified seat ID to add the new seat.
   */
  const addEmptySeat = (row: string, seatId: string, direction: 'left' | 'right') => {
    addSeat(row, seatId, direction, 'empty');

    toast.success('Space added successfully');
  };

  /**
   * Adds a new available seat to the specified row and seat ID in the given direction.
   *
   * @param {string} row - The row identifier where the seat will be added.
   * @param {string} seatId - The seat identifier adjacent to where the new seat will be added.
   * @param {'left' | 'right'} direction - The direction relative to the specified seat ID to add the new seat.
   */
  const addAvailableSeat = (row: string, seatId: string, direction: 'left' | 'right') => {
    addSeat(row, seatId, direction, 'available');

    toast.success('Seat added successfully');
  };

  /**
   * Deletes a seat from the seat data.
   * Finds the row of the specified seatId and removes the seat from the row.
   *
   * @param {string} row - The row identifier where the seat will be deleted.
   * @param {string} seatId - The seat identifier to delete.
   */
  const deleteSeat = (row: string, seatId: string) => {
    setSeatData((prevSeatData) => {
      const newSeatData = new Map(prevSeatData);

      const seatsInRow = newSeatData.get(row);

      if (!seatsInRow) return prevSeatData;

      const updatedSeatsInRow = seatsInRow.filter((seat) => seat.id !== seatId);

      if (updatedSeatsInRow.length === 0) {
        newSeatData.delete(row);
      } else {
        newSeatData.set(row, updatedSeatsInRow);
      }

      return newSeatData;
    });

    toast.success('Item deleted successfully');
  };

  /**
   * Adds a new empty row to the seat data.
   * Generates a unique row identifier and inserts an empty row into the seat data state.
   */
  const addEmptyRow = () => {
    setSeatData((prevSeatData) => {
      const newSeatData = new Map(prevSeatData);

      const id = uuidv4();

      const rowId = id.replace(/-/g, '').slice(0, 12);

      const emptyRow: ISeat = { id, row: `empty-${rowId}`, label: '0', status: 'empty' };

      newSeatData.set(emptyRow.row, [emptyRow]);

      return newSeatData;
    });

    toast.success('New row added successfully');
  };

  /**
   * Adds a new seated row to the seat data.
   * Generates a unique row identifier and inserts an empty row into the seat data state.
   *
   * @param {string} name - The row identifier where the seats will be added.
   */
  const addSeatedRow = (name: string): boolean => {
    const normalizedInput = name.toLowerCase();

    const existingRow = Array.from(seatData.keys()).some(
      (row) => row.toLowerCase() === normalizedInput
    );

    if (existingRow) {
      toast.error(`Row with name ${name} already exists`, {
        icon: '😮',
      });

      return false;
    }
    setSeatData((prevSeatData) => {
      const newSeatData = new Map(prevSeatData);

      const emptyRow: ISeat = { id: uuidv4(), row: name, label: '1', status: 'available' };

      newSeatData.set(emptyRow.row, [emptyRow]);

      return newSeatData;
    });

    toast.success(`Row ${name} added successfully`);

    return true;
  };

  /**
   * Updates the row label in the seat data.
   * This function is called whenever the user edits the name of an existing row.
   *
   * @param {string} name - The new name for the row.
   * @param {string} oldName - The old name for the row.
   */
  const editRowName = (name: string, oldName: string) => {
    const normalizedInput = name.toLowerCase();

    // Check if any existing row matches (case insensitive)
    const existingRow = Array.from(seatData.keys()).some(
      (row) => row.toLowerCase() === normalizedInput
    );

    if (existingRow) {
      toast.error(`Row with name ${name} already exists`, {
        icon: '😮',
      });
    } else {
      setSeatData((prevSeatData) => {
        const updatedSeatData = new Map<string, ISeat[]>();

        Array.from(prevSeatData.entries()).forEach(([row, seats]) => {
          if (row === oldName) {
            updatedSeatData.set(
              name,
              seats.map((seat) => ({ ...seat, row: name }))
            );
          } else {
            updatedSeatData.set(row, seats);
          }
        });

        toast.success(`Row ${name} edited successfully`);

        return updatedSeatData;
      });
    }
  };

  /**
   * Deletes a row from the seat data.
   * Finds the row of the specified row and removes it from the seat data state.
   *
   * @param {string} row - The row identifier to delete.
   */
  const deleteRow = (row: string) => {
    setSeatData((prevSeatData) => {
      const newSeatData = new Map(prevSeatData);

      if (newSeatData.has(row)) {
        newSeatData.delete(row);
      }

      return newSeatData;
    });

    toast.success('Row deleted successfully');
  };

  /**
   * Handles the drag end event by updating the seat data with the new row order.
   *
   * @param {DropResult} result - The result of the drag end event.
   */
  const handleOnDragEnd = ({ source, destination }: DropResult) => {
    if (!destination || source.index === destination.index) return;

    const rows = Array.from(seatData.keys());

    const [movedRow] = rows.splice(source.index, 1);

    rows.splice(destination.index, 0, movedRow);

    const updatedSeatData = new Map(rows.map((row) => [row, seatData.get(row) || []]));

    setSeatData(updatedSeatData);
  };

  /**
   * Calculates the total number of available seats across all rows.
   */
  const getTotalAvailableSeats = () => {
    let totalAvailableSeats = 0;

    seatData.forEach((seatsInRow) => {
      totalAvailableSeats += seatsInRow.filter((seat) => seat.status === 'available').length;
    });

    return totalAvailableSeats;
  };

  /**
   * Saves the seat data.
   */
  // eslint-disable-next-line no-console
  const saveData = () => console.log(Array.from(seatData.values()).flat());

  /**
   * Resets the seat data to the initial state.
   */
  const resetData = () => setSeatData(groupByRow(data));

  /**
   * Toggles the preview mode on or off.
   */
  const openPreview = () => setPreview(!preview);

  if (preview) {
    return <Preview seatData={seatData} closePreview={openPreview} />;
  }

  return (
    <div className='container'>
      <Stage />

      <div className='seatmap'>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId='rows' direction='vertical'>
            {(droppableProvided) => (
              <div ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                {Array.from(seatData?.entries())?.map(([row, seatsInRow], index) => (
                  <Draggable key={row} index={index} draggableId={row}>
                    {(draggableProvided) => (
                      <div ref={draggableProvided.innerRef} {...draggableProvided.draggableProps}>
                        <Row
                          row={row}
                          deleteRow={deleteRow}
                          editRowName={editRowName}
                          empty={row.startsWith('empty-')}
                          dragHandleProps={draggableProvided.dragHandleProps}
                        >
                          {seatsInRow.map((seat) => (
                            <Seat
                              seat={seat}
                              key={seat.id}
                              deleteSeat={deleteSeat}
                              addEmptySeat={addEmptySeat}
                            />
                          ))}
                          <NewSeat
                            addEmptySeat={addEmptySeat}
                            addAvailableSeat={addAvailableSeat}
                            seat={seatsInRow[seatsInRow.length - 1]}
                          />
                        </Row>
                      </div>
                    )}
                  </Draggable>
                ))}
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <NewRow addEmptyRow={addEmptyRow} addSeatedRow={addSeatedRow} />

      <div className='flex flex-space-between flex-v-center buttons'>
        <div className='totals'>
          Total seats: <strong>{getTotalAvailableSeats()}</strong>
        </div>
        <div className='flex flex-gap-medium'>
          <button type='button' className='button gray' onClick={() => openPreview()}>
            Preview
          </button>
          <button type='button' className='button gray' onClick={() => resetData()}>
            Reset
          </button>
          <button type='button' className='button black' onClick={() => saveData()}>
            Save chart
          </button>
        </div>
      </div>

      <Tooltip id='description' />

      <Toaster
        position='bottom-center'
        toastOptions={{
          style: {
            color: '#ffffff',
            borderRadius: '10px',
            background: '#333333',
          },
        }}
      />
    </div>
  );
};

export default App;
