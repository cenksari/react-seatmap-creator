import React from 'react';

import { Routes, Route } from 'react-router-dom';

// pages
import CreatorPage from '../pages/CreatorPage';

const Navigation = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path='/' element={<CreatorPage />} />
    </Routes>
  );
};

export default Navigation;
