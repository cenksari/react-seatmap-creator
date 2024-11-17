import React from 'react';

// hooks
import useClickOutside from '../hooks/useClickOutside';

// interfaces
interface IProps {
  row: string;
}

const NewSeat = ({ row }: IProps): React.JSX.Element => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [menuOpened, setMenuOpened] = React.useState<boolean>(false);

  useClickOutside(ref, (): void => {
    setMenuOpened(false);
  });

  console.log(row);

  return (
    <div ref={ref} className='relative'>
      <button
        type='button'
        onClick={() => setMenuOpened(!menuOpened)}
        className={menuOpened ? `seat mini-button active` : `seat mini-button`}
      >
        <span className='material-symbols-outlined'>add</span>
      </button>

      {menuOpened && (
        <div className='flex flex-gap flex-column dropdown'>
          <button type='button'>Koltuk ekle</button>
          <button type='button'>Boşluk ekle</button>
        </div>
      )}
    </div>
  );
};

export default NewSeat;
