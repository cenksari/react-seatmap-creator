// types
import type { ISeat } from '../types/types';

// interfaces
interface IProps {
  seat: ISeat;
  selected: boolean;
  onSelect: () => void;
}

const SelectSeat: React.FC<IProps> = ({ seat, selected, onSelect }) => {
  const isSeat = seat.type === 'seat';

  const title = isSeat ? `${seat.row} ${seat.label}` : '';

  const classNames = `${seat.type} ${selected && isSeat ? 'active' : 'passive'}`;

  /**
   * Handles the key down event for the seat element. If the 'Enter' or space key is pressed,
   * it prevents the default action and triggers the onSelect callback.
   *
   * @param {React.KeyboardEvent<HTMLDivElement>} event - The keyboard event object.
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      onSelect();
    }
  };

  return isSeat ? (
    <div
      tabIndex={0}
      role='button'
      title={title}
      onClick={onSelect}
      className={classNames}
      onKeyDown={handleKeyDown}
    >
      {seat.label}
    </div>
  ) : (
    <div className={`preview space`} />
  );
};

export default SelectSeat;
