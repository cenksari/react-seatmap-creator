import React from 'react';

import { Tooltip } from 'react-tooltip';
import { useNavigate } from 'react-router-dom';
import { MapInteractionCSS } from 'react-map-interaction';

// hooks
import useWindowDimensions from '../hooks/useWindowDimensions';

// styles
import '../styles/creator.css';

// data
import data from '../data/data.json';

// components
import Row from '../components/Row';
import Stage from '../components/Stage';
import SelectSeat from '../components/SelectSeat';

// types
import type { ISeat, ISeatMap } from '../types/types';

// variables
const defaultValues = {
  scale: 1,
  translation: { x: 20, y: 20 },
};

const SelectionPage = (): React.JSX.Element => {
  const navigate = useNavigate();

  const { width, height } = useWindowDimensions();

  const [props, setProps] = React.useState(defaultValues);
  const [loading, setLoading] = React.useState<boolean>(true);
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

  if (loading) {
    return <div className='container'>Loading... Please wait.</div>;
  }

  return (
    <>
      <div className='close-button' onContextMenu={(e) => e.preventDefault()}>
        <button
          type='button'
          onClick={() => navigate(-1)}
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
          <Stage preview text={seatMap?.stageText} />

          {Array.from(seatData?.entries())?.map(([row, seatsInRow], index) => (
            <Row preview row={row} key={row} rowIndex={index} empty={row.startsWith('empty-')}>
              {seatsInRow.map((seat) => (
                <SelectSeat seat={seat} key={seat.id} />
              ))}
            </Row>
          ))}
        </MapInteractionCSS>
      </div>

      <Tooltip id='description' />
    </>
  );
};

export default SelectionPage;
