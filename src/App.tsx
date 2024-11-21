/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import toast, { Toaster } from 'react-hot-toast';

import { v4 } from 'uuid';
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
import Header from './components/Header';
import NewRow from './components/NewRow';
import NewSeat from './components/NewSeat';
import Preview from './components/Preview';

// types
import type { ISeat, ISeatMap } from './types/types';

const App = (): React.JSX.Element => {
  const seatsRef = React.useRef<HTMLDivElement>(null);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [preview, setPreview] = React.useState<boolean>(false);
  const [seatMap, setSeatMap] = React.useState<ISeatMap | null>(null);
  const [seatData, setSeatData] = React.useState<Map<string, ISeat[]>>(new Map());

  /**
   * Given an array of seat objects, groups the seats by their row and returns
   * a new Map where each key is a row name and each value is an array of seats
   * in that row.
   *
   * @param {ISeat[]} seats The array of seat objects to group.
   */
  const groupByRow = React.useCallback((seats: ISeat[]) => {
    return seats.reduce((acc, seat) => {
      const currentRow = acc.get(seat.row) || [];

      acc.set(seat.row, [...currentRow, seat]);

      return acc;
    }, new Map<string, ISeat[]>());
  }, []);

  React.useEffect(() => {
    const { seatMapData, ...restData } = data;

    setSeatMap(restData);

    setSeatData(groupByRow(seatMapData));

    setLoading(false);
  }, [groupByRow]);

  /**
   * Adds a new seat to the seat data.
   * Inserts a new space or seat to the left or right of a given seat.
   *
   * @param {string} row The row identifier for the seat.
   * @param {string} seatId The id of the seat to insert the new seat next to.
   * @param {'left' | 'right'} direction The direction of the insertion.
   * @param {'space' | 'seat'} seatType The type of the new seat.
   */
  const addSeatAction = React.useCallback(
    (row: string, seatId: string, direction: 'left' | 'right', seatType: 'space' | 'seat') => {
      setSeatData((prevSeatData) => {
        const newSeatData = new Map(prevSeatData);
        const seatsInRow = newSeatData.get(row) || [];
        const seatIndex = seatsInRow.findIndex((seat) => seat.id === seatId);

        if (seatIndex === -1) return prevSeatData;

        const newSeat: ISeat = {
          id: v4(),
          row,
          label:
            seatType === 'seat'
              ? (
                  Math.max(
                    ...seatsInRow
                      .filter((seat) => seat.type === 'seat')
                      .map((seat) => parseInt(seat.label, 10)),
                    0
                  ) + 1
                ).toString()
              : '0',
          type: seatType,
        };

        seatsInRow.splice(seatIndex + (direction === 'right' ? 1 : 0), 0, newSeat);

        newSeatData.set(row, [...seatsInRow]);

        return newSeatData;
      });

      toast.success(`${seatType === 'seat' ? 'Seat' : 'Space'} added successfully`);
    },
    []
  );

  /**
   * Adds a new space to the specified row and seat ID in the given direction.
   *
   * @param {string} row - The row identifier where the seat will be added.
   * @param {string} seatId - The seat identifier adjacent to where the new seat will be added.
   * @param {'left' | 'right'} direction - The direction relative to the specified seat ID to add the new seat.
   */
  const addSpace = React.useCallback(
    (row: string, seatId: string, direction: 'left' | 'right') => {
      addSeatAction(row, seatId, direction, 'space');
    },
    [addSeatAction]
  );

  /**
   * Adds a new seat to the specified row and seat ID in the given direction.
   *
   * @param {string} row - The row identifier where the seat will be added.
   * @param {string} seatId - The seat identifier adjacent to where the new seat will be added.
   * @param {'left' | 'right'} direction - The direction relative to the specified seat ID to add the new seat.
   */
  const addSeat = React.useCallback(
    (row: string, seatId: string, direction: 'left' | 'right') => {
      addSeatAction(row, seatId, direction, 'seat');
    },
    [addSeatAction]
  );

  /**
   * Updates the label of the seat with the given seat ID in the specified row.
   * Checks if the new name already exists in the row and prevents the update if so.
   *
   * @param {string} row - The row identifier where the seat label will be updated.
   * @param {string} seatId - The seat identifier of the seat to update.
   * @param {string} name - The new label for the seat.
   */
  const editSeatName = React.useCallback((row: string, seatId: string, name: string) => {
    setSeatData((prev) => {
      const updated = new Map(prev);

      const seats = updated.get(row) || [];

      if (seats.some((seat) => seat.label === name && seat.id !== seatId)) {
        toast.error(`Seat name ${name} already exists in row ${row}`);

        return prev;
      }

      updated.set(
        row,
        seats.map((seat) => (seat.id === seatId ? { ...seat, label: name } : seat))
      );

      toast.success(`Seat name updated to ${name}`);

      return updated;
    });
  }, []);

  /**
   * Deletes a seat from the seat data.
   * Finds the row of the specified seatId and removes the seat from the row.
   *
   * @param {string} row - The row identifier where the seat will be deleted.
   * @param {string} seatId - The seat identifier to delete.
   */
  const deleteSeat = React.useCallback((row: string, seatId: string) => {
    setSeatData((prev) => {
      const updated = new Map(prev);

      const seats = updated.get(row)?.filter((seat) => seat.id !== seatId) || [];

      if (seats.length === 0) {
        updated.delete(row);
      } else {
        updated.set(row, seats);
      }

      return updated;
    });

    toast.success('Item deleted successfully');
  }, []);

  /**
   * Adds a new empty row to the seat data.
   * Generates a unique row identifier and inserts an empty row into the seat data state.
   */
  const addEmptyRow = React.useCallback(() => {
    setSeatData((prevSeatData) => {
      const newSeatData = new Map(prevSeatData);

      const rowId = v4().replace(/-/g, '').slice(0, 12);

      const emptyRow: ISeat = { id: v4(), row: `empty-${rowId}`, label: '0', type: 'space' };

      newSeatData.set(emptyRow.row, [emptyRow]);

      return newSeatData;
    });

    toast.success('New row added successfully');
  }, []);

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

      const emptyRow: ISeat = { id: v4(), row: name, label: '1', type: 'seat' };

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
  const deleteRow = React.useCallback((row: string) => {
    setSeatData((prevSeatData) => {
      const updatedSeatData = new Map(prevSeatData);

      if (!updatedSeatData.delete(row)) {
        toast.error(`Row ${row} does not exist`);

        return prevSeatData;
      }

      toast.success(`Row deleted successfully`);

      return updatedSeatData;
    });
  }, []);

  /**
   * Handles the drag end event by updating the seat data with the new row order.
   *
   * @param {DropResult} result - The result of the drag end event.
   */
  const handleOnDragEnd = ({ source, destination }: DropResult) => {
    if (!destination || source.index === destination.index) return;

    const updatedRows = Array.from(seatData.keys());

    const [movedRow] = updatedRows.splice(source.index, 1);

    updatedRows.splice(destination.index, 0, movedRow);

    setSeatData(new Map(updatedRows.map((row) => [row, seatData.get(row) ?? []])));
  };

  /**
   * Updates the name of the current seat map.
   *
   * @param {string} name - The new name for the seat map.
   */
  const editMapName = (name: string) => {
    setSeatMap({ ...seatMap!, name });

    toast.success(`Map name edited successfully`);
  };

  /**
   * Updates the stage label of the current seat map.
   *
   * @param {string} name - The new stage name for the seat map.
   */
  const editStageName = (name: string) => {
    setSeatMap({ ...seatMap!, stageText: name });

    toast.success(`Stage label edited successfully`);
  };

  /**
   * Calculates the total number of seats across all rows.
   */
  const getTotalSeats = React.useMemo(
    () =>
      Array.from(seatData.values())
        .flat()
        .filter((seat) => seat.type === 'seat').length,
    [seatData]
  );

  /**
   * Saves the seat data.
   */
  const saveData = () => {
    const newSeatData = Array.from(seatData.values()).flat();

    const mergeSeatMap: ISeatMap = { ...seatMap!, seatMapData: newSeatData };

    // eslint-disable-next-line no-console
    console.log(mergeSeatMap);
  };

  /**
   * Resets the seat data to the initial state.
   */
  const resetData = React.useCallback(
    () => setSeatData(groupByRow(data.seatMapData)),
    [groupByRow]
  );

  /**
   * Toggles the preview mode on or off.
   */
  const togglePreview = React.useCallback(() => setPreview((prev) => !prev), []);

  if (loading) {
    return <div className='container'>Loading... Please wait.</div>;
  }

  if (preview) {
    return <Preview seatData={seatData} text={seatMap?.stageText} togglePreview={togglePreview} />;
  }

  return (
    <div className='container'>
      <Header seatMap={seatMap} editMapName={editMapName} />

      <Stage text={seatMap?.stageText} editStageName={editStageName} />

      <div ref={seatsRef} className='seatmap' onContextMenu={(e) => e.preventDefault()}>
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
                          rowIndex={index}
                          deleteRow={deleteRow}
                          editRowName={editRowName}
                          empty={row.startsWith('empty-')}
                          dragHandleProps={draggableProvided.dragHandleProps}
                        >
                          {seatsInRow.map((seat) => (
                            <Seat
                              seat={seat}
                              key={seat.id}
                              rowIndex={index}
                              addSpace={addSpace}
                              deleteSeat={deleteSeat}
                              editSeatName={editSeatName}
                            />
                          ))}
                          <NewSeat
                            rowIndex={index}
                            addSpace={addSpace}
                            addSeat={addSeat}
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
          Total seats: <strong>{getTotalSeats}</strong>
        </div>
        <div className='flex flex-gap-medium'>
          <button type='button' className='button gray' onClick={() => togglePreview()}>
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
