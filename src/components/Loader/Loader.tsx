import React from 'react';

import logo from './logo.svg';
import { Overlay, Label } from './LoaderStyles';

const Loader = () => (
  <Overlay>
    <img src={logo} className="App-logo" alt="logo" />
    <Label>Loading...</Label>
  </Overlay>
);

export default Loader;
