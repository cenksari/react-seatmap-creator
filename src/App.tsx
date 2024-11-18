import React from 'react';

import { v4 as uuidv4 } from 'uuid';

// styles
import './styles/map.css';

// data
import data from './data/data.json';

// components
import Row from './components/Row';
import Seat from './components/Seat';
import Stage from './components/Stage';
import NewRow from './components/NewRow';
import NewSeat from './components/NewSeat';

// types
import type { ISeat } from './types/types';

const App = (): React.JSX.Element => {
  const [seatData, setSeatData] = React.useState<Map<string, ISeat[]>>(new Map());

  /**
   * Takes an array of seat objects and groups them by row identifier.
   * Returns a Map with the row identifier as the key and an array of seat objects as the value.
   *
   * @param {ISeat[]} dataToGroup The array of seat objects to group.
   */
  const groupByRow = (dataToGroup: ISeat[]) => {
    return dataToGroup.reduce((map, seat) => {
      if (!map.has(seat.row)) {
        map.set(seat.row, []);
      }

      map.get(seat.row)!.push(seat);

      return map;
    }, new Map<string, ISeat[]>());
  };

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
  };

  /**
   * Adds a new empty row to the seat data.
   * Generates a unique row identifier and inserts an empty row into the seat data state.
   */
  const addEmptyRow = () => {
    setSeatData((prevSeatData) => {
      const newSeatData = new Map(prevSeatData);

      const rowId = uuidv4().replace(/-/g, '').slice(0, 12);

      const emptyRow: ISeat = { id: '', row: `empty-${rowId}`, label: '', status: '' };

      newSeatData.set(emptyRow.row, [emptyRow]);

      return newSeatData;
    });
  };

  /**
   * Adds a new seated row to the seat data.
   * Generates a unique row identifier and inserts an empty row into the seat data state.
   *
   * @param {string} name - The row identifier where the seats will be added.
   */
  const addSeatedRow = (name: string) => {
    if (seatData.has(name)) {
      // eslint-disable-next-line no-alert
      alert(`Sıra adı ${name} zaten mevcut.`);

      return;
    }

    setSeatData((prevSeatData) => {
      const newSeatData = new Map(prevSeatData);

      const emptyRow: ISeat = { id: uuidv4(), row: name, label: '1', status: 'available' };

      newSeatData.set(emptyRow.row, [emptyRow]);

      return newSeatData;
    });
  };

  return (
    <div className='container'>
      <Stage />

      {Array.from(seatData?.entries())?.map(([row, seatsInRow]) => (
        <React.Fragment key={row}>
          {row.startsWith('empty-') ? (
            <Row empty />
          ) : (
            <Row row={row}>
              {seatsInRow.map((seat) => (
                <Seat seat={seat} key={seat.id} addEmptySeat={addEmptySeat} />
              ))}
              <NewSeat
                addEmptySeat={addEmptySeat}
                addAvailableSeat={addAvailableSeat}
                seat={seatsInRow[seatsInRow.length - 1]}
              />
            </Row>
          )}
        </React.Fragment>
      ))}

      <NewRow addEmptyRow={addEmptyRow} addSeatedRow={addSeatedRow} />

      <div className='flex flex-gap-medium flex-end buttons'>
        <button type='button' className='button gray'>
          Önizleme
        </button>
        <button type='button' className='button black'>
          Kaydet
        </button>
      </div>
    </div>
  );
};

export default App;
