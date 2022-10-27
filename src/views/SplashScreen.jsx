import React from 'react';
import logo from './Logo.png';
// Components

const Logo = () => {
  return (
    <div className='logo logo__container'>
      <img src={logo} alt='Logo' />
    </div>
  );
};

const SplashScreen = () => {
  return (
    <div className='splashScreen splashScreen__container'>
      <Logo />
    </div>
  );
};



export default SplashScreen;



