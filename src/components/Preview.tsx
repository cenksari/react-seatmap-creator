import React from 'react';

import { Tooltip } from 'react-tooltip';
import { MapInteractionCSS } from 'react-map-interaction';

// hooks
import useWindowDimensions from '../hooks/useWindowDimensions';

// components
import Row from './Row';
import Seat from './Seat';
import Stage from './Stage';

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

const Preview = ({ text, seatData, togglePreview }: IProps): React.JSX.Element => {
  const { width, height } = useWindowDimensions();

  const [props, setProps] = React.useState(defaultValues);

  return (
    <>
      <div className='close-button'>
        <button
          type='button'
          data-tooltip-id='description'
          onClick={() => togglePreview()}
          data-tooltip-content='Close preview'
          className='button circle flex flex-v-center flex-h-center'
        >
          <span className='material-symbols-outlined'>close</span>
        </button>
        <button
          type='button'
          data-tooltip-id='description'
          data-tooltip-content='Reset position'
          onClick={() => setProps(defaultValues)}
          className='button circle flex flex-v-center flex-h-center'
        >
          <span className='material-symbols-outlined'>my_location</span>
        </button>
      </div>
      <div className='canvas'>
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

          {Array.from(seatData?.entries())?.map(([row, seatsInRow]) => (
            <Row
              preview
              row={row}
              key={row}
              dragHandleProps={null}
              empty={row.startsWith('empty-')}
            >
              {seatsInRow.map((seat) => (
                <Seat preview seat={seat} key={seat.id} />
              ))}
            </Row>
          ))}
        </MapInteractionCSS>
      </div>

      <Tooltip id='description' />
    </>
  );
};

export default Preview;
