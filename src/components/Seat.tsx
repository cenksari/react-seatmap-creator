import React from 'react';

// hooks
import useClickOutside from '../hooks/useClickOutside';

// types
import type { ISeat } from '../types/types';

const Seat = ({ id, row, label, status }: ISeat): React.JSX.Element => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [menuOpened, setMenuOpened] = React.useState<boolean>(false);

  useClickOutside(ref, (): void => {
    setMenuOpened(false);
  });

  if (status === 'available') {
    return (
      <div className='relative' ref={ref}>
        <div
          tabIndex={0}
          role='button'
          data-seat-id={id}
          data-row-id={row}
          onKeyDown={() => {}}
          onClick={() => setMenuOpened(!menuOpened)}
          className={menuOpened ? `seat available active` : `seat available`}
        >
          {label}
        </div>
        {menuOpened && (
          <div className='flex flex-gap flex-column dropdown'>
            <button type='button'>Sağına boşluk ekle</button>
            <button type='button'>Soluna boşluk ekle</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className='relative' ref={ref}>
      <div
        tabIndex={0}
        role='button'
        aria-label={row}
        data-row-id={row}
        data-seat-id={id}
        onKeyDown={() => {}}
        onClick={() => setMenuOpened(!menuOpened)}
        className={menuOpened ? `seat empty active` : `seat empty`}
      />

      {menuOpened && (
        <div className='flex flex-gap flex-column dropdown'>
          <button type='button'>Sağına boşluk ekle</button>
        </div>
      )}
    </div>
  );
};

export default Seat;
