import React from 'react';

// interfaces
interface IProps {
  text?: string;
}

const Stage = ({ text }: IProps): React.JSX.Element => {
  return (
    <div className='flex flex-gap flex-v-center flex-h-center stage'>
      {text}
      <button type='button'>
        <span className='material-symbols-outlined'>draw</span>
      </button>
    </div>
  );
};

export default Stage;
