import React, { useState, useRef } from "react";
import Main from "./components/Main";
import Header from "./components/Header";
import { FormDataType } from "./components/Form";
import "./App.css";
import Form from "./components/Form";

function App() {
  const [showForm, setShowForm] = useState(false); 
  const temp = [{
    categories: {
      creative: true,
    },
    emotions: {
      neutral: 10
    },
    priority:10,
    description: "kdfjskdcvsdffjlskdj"
  },
  {
    categories: {
      creative: true,
      unknown: false,
    },
    emotions: {
      neutral: 10
    },
    priority: 16,
    description: "kdfjsdfsskdfjlskdj"
  },
  {
    categories: {
      creative: true,
      concrete: true,
    },
    emotions: {
      neutral: 10
    },
    priority: 25,
    description: "kdfjskdfjlsksdfssdj"
  },
  {
    categories: {
      creative: true,

    },
    emotions: {
      neutral: 10
    },
    priority: 15,
    description: "kddsfjskdfjlskdj"
  },
  {
    categories: {
      creative: true,
    },
    emotions: {
      neutral: 10
    },
    priority: 50,
    description: "kdfjskdfjfsdfsdfsdlskdj"
  },
  ]
  const [savedData, setSavedData] = useState(temp as FormDataType[]);
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
