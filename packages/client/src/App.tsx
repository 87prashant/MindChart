import React, { useState } from "react";
import Main from "./components/Main";
import Header from "./components/Header";
import { FormDataType } from "./components/AddNewThemo";
import "./App.css";
import AddNewThemo from "./components/AddNewThemo";

function App() {
  const [showAddNewThemo, setShowAddNewThemo] = useState(false); // track whether the add new from is open or not
  const [savedData, setSavedData] = useState([] as FormDataType[]);

  return (
    <div className="App">
      <Header setShowAddNewThemo={setShowAddNewThemo} />
      <AddNewThemo
        savedData={savedData}
        setSavedData={setSavedData}
        showAddNewThemo={showAddNewThemo}
        setShowAddNewThemo={setShowAddNewThemo}
      />
      <Main savedData={savedData} />
    </div>
  );
}

export default App;
