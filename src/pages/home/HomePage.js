import React from 'react';
import Home from '../../components/home/Home'
import { PageProvider } from '../../context/PageContext';

function HomePage() {

  return (
    <div>
      <PageProvider>
        <Home/>
      </PageProvider>
    </div>
  )
}

export default HomePage