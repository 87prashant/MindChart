import React from 'react';
import Main from './components/Main'
import Header from './components/Header'
import './App.css';
import AddNewThemo from './components/AddNewThemo';

function App() {
  const [showAddNewThemo, setShowAddNewThemo] = React.useState(false)      // track whether the add new from is open or not

  return (
    <div className="App">
      <Header setShowAddNewThemo={setShowAddNewThemo}/>
      <AddNewThemo showAddNewThemo={showAddNewThemo} setShowAddNewThemo={setShowAddNewThemo}/>
      <Main/>
    </div>
  );
}

export default App;
