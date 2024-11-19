import React from 'react';

// interfaces
interface IProps {
  text?: string;
}

const Stage = ({ text }: IProps): React.JSX.Element => {
  return <div className='stage'>{text}</div>;
};

export default Stage;
