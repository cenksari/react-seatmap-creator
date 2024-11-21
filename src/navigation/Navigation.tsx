import React from 'react';

import { Routes, Route } from 'react-router-dom';

// pages
import CreatorPage from '../pages/CreatorPage';
import SelectionPage from '../pages/SelectionPage';

const Navigation = (): React.JSX.Element => {
  return (
    <Routes>
      <Route path='/' element={<CreatorPage />} />
      <Route path='/selection' element={<SelectionPage />} />
    </Routes>
  );
};

export default Navigation;
