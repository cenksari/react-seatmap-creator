import React from 'react';

// hooks
import useClickOutside from '../hooks/useClickOutside';

// types
import type { ISeat } from '../types/types';

const Seat = React.memo(({ id, row, label, status }: ISeat): React.JSX.Element => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [menuOpened, setMenuOpened] = React.useState<boolean>(false);

  useClickOutside(ref, (): void => setMenuOpened(false));

  const renderDropdown = (): React.JSX.Element => (
    <div className='flex flex-gap flex-column dropdown'>
      <button type='button'>Sağına boşluk ekle</button>
      {status === 'available' && <button type='button'>Soluna boşluk ekle</button>}
    </div>
  );

  return (
    <div ref={ref} className='relative'>
      <div
        tabIndex={0}
        role='button'
        data-seat-id={id}
        data-row-id={row}
        onKeyDown={() => {}}
        onClick={() => setMenuOpened((prev) => !prev)}
        aria-label={status === 'available' ? label : row}
        className={`seat ${status} ${menuOpened ? 'active' : ''}`}
      >
        {status === 'available' && label}
      </div>
      {menuOpened && renderDropdown()}
    </div>
  );
});

Seat.displayName = 'Seat';

export default Seat;
