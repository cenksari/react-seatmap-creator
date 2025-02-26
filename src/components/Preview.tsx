import { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { MapInteractionCSS } from 'react-map-interaction';

// hooks
import useWindowDimensions from '../hooks/useWindowDimensions';

// components
import Row from './Row';
import Stage from './Stage';
import Legend from './Legend';
import SelectSeat from './SelectSeat';

// types
import type { ISeat } from '../types/types';

// interfaces
interface IProps {
  text?: string;
  seatData: Map<string, ISeat[]>;
  togglePreview: () => void;
}

// variables
const defaultValues = {
  scale: 1,
  translation: { x: 20, y: 20 },
};

const Preview: React.FC<IProps> = ({ text, seatData, togglePreview }) => {
  const { width, height } = useWindowDimensions();

  const [props, setProps] = useState(defaultValues);
  const [selectedSeats, setSelectedSeats] = useState<ISeat[]>([]);

  /**
   * Handles the selection of a seat by logging the seat data to the console.
   * Intended to be replaced with a callback function that performs the actual
   * logic for selecting a seat.
   *
   * @param {ISeat} seat - The seat object to be selected.
   */
  const handleSelect = (seat: ISeat): void => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s.id !== seat.id) : [...prev, seat]
    );
  };

  const rows: [string, ISeat[]][] = Array.from(seatData?.entries());

  return (
    <>
      <div className='close-button' onContextMenu={(e) => e.preventDefault()}>
        <button
          type='button'
          onClick={() => togglePreview()}
          className='button circle flex flex-v-center flex-h-center'
        >
          <span className='material-symbols-outlined'>close</span>
        </button>
        <button
          type='button'
          onClick={() => setProps(defaultValues)}
          className='button circle flex flex-v-center flex-h-center'
        >
          <span className='material-symbols-outlined'>my_location</span>
        </button>
      </div>
      <div className='canvas' onContextMenu={(e) => e.preventDefault()}>
        <MapInteractionCSS
          showControls
          value={props}
          minScale={0.7}
          maxScale={1.5}
          controlsClass='controls'
          onChange={(val: any) => setProps(val)}
          btnClass='button circle flex flex-v-center flex-h-center'
          translationBounds={{ xMax: width - 50, yMax: height - 50 }}
          plusBtnContents={<span className='material-symbols-outlined'>zoom_in</span>}
          minusBtnContents={<span className='material-symbols-outlined'>zoom_out</span>}
        >
          <Stage preview text={text} />

          {rows?.map(([row, seatsInRow], index) => (
            <Row
              preview
              row={row}
              key={row}
              rowIndex={index}
              dragHandleProps={null}
              empty={row.startsWith('empty-')}
            >
              {seatsInRow.map((seat) => (
                <SelectSeat
                  seat={seat}
                  key={seat.id}
                  onSelect={() => handleSelect(seat)}
                  selected={selectedSeats.includes(seat)}
                />
              ))}
            </Row>
          ))}
        </MapInteractionCSS>
      </div>

      <Legend />

      <Tooltip id='description' />
    </>
  );
};

export default Preview;
