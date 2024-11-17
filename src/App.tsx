import React from 'react';

// styles
import './map.css';

// data
import data from './data/data.json';

// components
import Seat from './components/Seat';
import NewRow from './components/NewRow';
import NewSeat from './components/NewSeat';

// types
import type { ISeat } from './types/types';

const App = (): React.JSX.Element => {
  const [seatData, setSeatData] = React.useState<Map<string, ISeat[]>>(new Map());

  /**
   * Takes an array of seat objects and groups them by row, returning a
   * Map<string, ISeat[]> where the key is the row letter and the value is
   * an array of seat objects in that row.
   */
  const groupSeatsByRow = (seats: ISeat[]): Map<string, ISeat[]> => {
    const rowMap = new Map<string, ISeat[]>();

    seats.forEach((seat) => {
      if (!rowMap.has(seat.row)) {
        rowMap.set(seat.row, []);
      }

      rowMap.get(seat.row)!.push(seat);
    });

    return rowMap;
  };

  React.useEffect(() => {
    const seats: ISeat[] = data;

    const groupedSeats = groupSeatsByRow(seats);

    setSeatData(groupedSeats);
  }, []);

  return (
    <div className='container'>
      <div className='stage'>SAHNE YÖNÜ</div>

      {Array.from(seatData.entries()).map(([row, seatsInRow]) => (
        <div key={row} data-row-id={row} className='flex flex-gap-small row'>
          <div className='row-label'>{row}</div>
          {seatsInRow.map((seat: ISeat) => (
            <Seat
              id={seat.id}
              key={seat.id}
              row={seat.row}
              label={seat.label}
              status={seat.status}
            />
          ))}
          <NewSeat row={row} />
        </div>
      ))}
      <NewRow />

      <div className='flex flex-space-between buttons'>
        <div>
          Toplam koltuk sayısı: <strong>200</strong>
        </div>
        <div className='flex flex-gap-medium'>
          <button type='button' className='button gray'>
            Vazgeç
          </button>
          <button type='button' className='button black'>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
