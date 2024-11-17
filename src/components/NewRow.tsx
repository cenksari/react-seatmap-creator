import React from 'react';

// hooks
import useClickOutside from '../hooks/useClickOutside';

const NewRow = (): React.JSX.Element => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [menuOpened, setMenuOpened] = React.useState<boolean>(false);

  useClickOutside(ref, (): void => {
    setMenuOpened(false);
  });

  return (
    <div ref={ref} className='flex flex-gap-smallrow relative'>
      <button
        type='button'
        onClick={() => setMenuOpened(!menuOpened)}
        className={menuOpened ? `seat mini-button active` : `seat mini-button`}
      >
        <span className='material-symbols-outlined'>add</span>
      </button>

      {menuOpened && (
        <div className='flex flex-gap flex-column dropdown'>
          <button type='button'>Sıra ekle</button>
          <button type='button'>Boşluk ekle</button>
        </div>
      )}
    </div>
  );
};

export default NewRow;
