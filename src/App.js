import React, { useReducer } from 'react';
import Main from './Main';
import { getInitialState, reducer, AppContext } from './reducer';
import './Variables.css';
import './Fonts.css';
import './Icons.css';
// import './tempFirebaseHack';

function App() {
  const [state, dispatchChange] = useReducer(reducer, getInitialState());

  return (
    <AppContext.Provider value={{ state, dispatchChange }}>
      <Main />
    </AppContext.Provider>
  );
}

export default App;
