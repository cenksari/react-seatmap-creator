import React from 'react';

// styles
import './map.css';

// data
import data from './data/data.json';

// components
import Row from './components/Row';
import Seat from './components/Seat';
import NewRow from './components/NewRow';
import NewSeat from './components/NewSeat';

// types
import type { ISeat } from './types/types';

const App = (): React.JSX.Element => {
  const [seatData, setSeatData] = React.useState<Map<string, ISeat[]>>(new Map());

  React.useEffect(() => {
    const rowMap = data.reduce((map, seat) => {
      if (!map.has(seat.row)) {
        map.set(seat.row, []);
      }

      map.get(seat.row)!.push(seat);

      return map;
    }, new Map<string, ISeat[]>());

    setSeatData(rowMap);
  }, []);

  return (
    <div className='container'>
      <div className='stage'>SAHNE YÖNÜ</div>

      {Array.from(seatData.entries()).map(([row, seatsInRow]) => (
        <Row key={row} row={row}>
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
        </Row>
      ))}

      <NewRow />
    </div>
  );
};

export default App;
