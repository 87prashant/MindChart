import React, { useState } from "react";
import Main from "./components/Main";
import Header from "./components/Header";
import { FormDataType } from "./components/Form";
import "./App.css";
import Form from "./components/Form";

// only for checking working
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
  priority: 19,
  description: "kdfjskdfjfsdfsdfsdlskdj"
},
{
  categories: {
    creative: true,
  },
  emotions: {
    joy: 10
  },
  priority: 50,
  description: "kdfjskdfjfsdfsdfsdlskdj"
},
{
  categories: {
    creative: true,
  },
  emotions: {
    anticipation: 10
  },
  priority: 27,
  description: "kdfjskdfjfsdfsdfsdlskdj"
},
{
  categories: {
    creative: true,
  },
  emotions: {
    fear: 10
  },
  priority: 37,
  description: "kdfjskdfjfsdfsdfsdlskdj"
},
{
  categories: {
    creative: true,
  },
  emotions: {
    fear: 10
  },
  priority: 49,
  description: "kdfjskdfjfsdfsdfsdlskdj"
},
{
  categories: {
    creative: true,
  },
  emotions: {
    sadness: 10
  },
  priority: 12,
  description: "kdfjskdfjfsdfsdfsdlskdj"
},
{
  categories: {
    creative: true,
  },
  emotions: {
    trust: 10
  },
  priority: 34,
  description: "kdfjskdfjfsdfsdfsdlskdj"
},
{
  categories: {
    anticipation: true,
  },
  emotions: {
    trust: 10,
    anticipation: 23,
    joy: 15,
    fear: 26,
    neutral: 32,
    sadness: 12,
    anger: 50,
  },
  priority: 12,
  description: "kdfjskdfjfsdfsdfsdlskdj"
},
{
  categories: {
    creative: true,
  },
  emotions: {
    surprise: 10
  },
  priority: 34,
  description: "kdfjskdfjfsdfsdfsdlskdj"
},
]

function App() {
  const [showForm, setShowForm] = useState(false); 
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
