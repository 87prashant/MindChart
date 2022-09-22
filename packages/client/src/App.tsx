import React from 'react';
import Canvas from './components/canvas'
import Header from './components/Header'
import './App.css';
import AddNewThemo from './components/AddNewThemo';

function App() {
  const [showAddNewThemo, setShowAddNewThemo] = React.useState(false)
  return (
    <div className="App">
      <Header setShowAddNewThemo={setShowAddNewThemo}/>
      <AddNewThemo showAddNewThemo={showAddNewThemo} setShowAddNewThemo={setShowAddNewThemo}/>
      <Canvas/>
    </div>
  );
}

export default App;
