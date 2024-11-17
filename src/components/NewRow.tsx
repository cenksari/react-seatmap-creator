import React from 'react';

// hooks
import useClickOutside from '../hooks/useClickOutside';

const NewRow = (): React.JSX.Element => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [menuOpened, setMenuOpened] = React.useState<boolean>(false);

  useClickOutside(ref, (): void => setMenuOpened(false));

  return (
    <div ref={ref} className='flex flex-gap-smallrow relative new-row'>
      <button
        type='button'
        onClick={() => setMenuOpened((prev) => !prev)}
        className={`row-label mini-button ${menuOpened ? 'active' : ''}`}
      >
        <span className='material-symbols-outlined'>add</span>
      </button>

      {menuOpened && (
        <div className='flex flex-gap flex-column dropdown'>
          <button type='button'>Sıra ekle</button>
          <button type='button'>Boş sıra ekle</button>
        </div>
      )}
    </div>
  );
};

export default NewRow;
