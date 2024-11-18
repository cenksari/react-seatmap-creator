import React from 'react';

// interfaces
interface IProps {
  row?: string;
  empty?: boolean;
  children?: React.ReactNode;
}

const Row = React.memo(({ row, empty, children }: IProps): React.JSX.Element => {
  return (
    <div key={row} data-row-id={row} className='flex flex-gap-small row'>
      {!empty ? (
        <>
          <div className='row-label'>{row}</div>
          <button type='button' className='seat mini-button'>
            <span className='material-symbols-outlined'>draw</span>
          </button>
          <button type='button' className='seat mini-button'>
            <span className='material-symbols-outlined'>drag_indicator</span>
          </button>
          {children}
        </>
      ) : (
        <div className='row-label'>&bull;</div>
      )}
    </div>
  );
});

Row.displayName = 'Row';

export default Row;
