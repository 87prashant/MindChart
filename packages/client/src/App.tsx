import React from 'react';
import Canvas from './components/canvas'
import Header from './components/Header'
import './App.css';
import AddNewThemo from './components/AddNewThemo';

function App() {
  return (
    <div className="App">
      <Header/>
      <AddNewThemo />
      <Canvas/>
    </div>
  );
}

export default App;
