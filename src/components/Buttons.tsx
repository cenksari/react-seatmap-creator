// interfaces
interface IProps {
  totals: number;
  save: () => void;
  reset: () => void;
  toggle: () => void;
}

const Buttons: React.FC<IProps> = ({ totals, save, reset, toggle }) => (
  <div className='flex flex-space-between flex-v-center buttons'>
    <div className='totals'>
      Total seats: <strong>{totals}</strong>
    </div>
    <div className='flex flex-gap-medium'>
      <button type='button' className='button gray' onClick={() => toggle()}>
        Preview
      </button>
      <button type='button' className='button gray' onClick={() => reset()}>
        Reset
      </button>
      <button type='button' className='button black' onClick={() => save()}>
        Save seat map
      </button>
    </div>
  </div>
);

export default Buttons;
