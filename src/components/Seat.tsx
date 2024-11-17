import React from 'react';

import type { ISeat } from '../types/types';

const Seat = ({ id, row, label, status }: ISeat): React.JSX.Element => {
  if (status === 'available') {
    return (
      <div data-seat-id={id} data-row-id={row} className='seat available'>
        {label}
      </div>
    );
  }

  return <div data-seat-id={id} data-row-id={row} className='seat empty' />;
};

export default Seat;
