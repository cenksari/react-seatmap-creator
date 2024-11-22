import { Routes, Route } from 'react-router-dom';

// pages
import CreatorPage from '../pages/CreatorPage';

const Navigation = (): JSX.Element => {
  return (
    <Routes>
      <Route path='/' element={<CreatorPage />} />
    </Routes>
  );
};

export default Navigation;
