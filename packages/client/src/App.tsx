import React, { useState, useRef } from "react";
import Main from "./components/Main";
import Header from "./components/Header";
import { FormDataType } from "./components/Form";
import "./App.css";
import Form from "./components/Form";

function App() {
  const [showForm, setShowForm] = useState(false); // track whether the add new from is open or not
  const [savedData, setSavedData] = useState([] as FormDataType[]);
  const [isChartAdded, setIsChartAdded] = useState(false);

  return (
    <div className="App">
      <Header setShowForm={setShowForm} />
      <Form
        savedData={savedData}
        setSavedData={setSavedData}
        showForm={showForm}
        setShowForm={setShowForm}
        setIsChartAdded={setIsChartAdded}
      />
      <Main
        savedData={savedData}
        isChartAdded={isChartAdded}
        setIsChartAdded={setIsChartAdded}
      />
    </div>
  );
}

export default App;
