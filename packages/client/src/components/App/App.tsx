//TODO two source of truths: 1. database 2. savedData might be inconsistent, Use database only
//TODO Add description on every useState, useRef, useMemo, etc.

import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import Main from "../Main";
import Header from "../Header";
import { FormDataType } from "../Form";
import "../../App.css";
import Form from "../Form";
import HoverModal from "../HoverModal";
import { DataOperation } from "../constants";

const Container = styled("div")({
  border: "2px solid black",
  position: "absolute",
  visibility: "hidden",
  backgroundColor: "rgba(225, 225, 225, 1)",
  borderRadius: 7,
  padding: 4,
  maxWidth: 200,
  maxHeight: 200,
  overflow: "hidden",
});

const demoData: FormDataType[] = [
  {
    categories: {
      creative: true,
      concrete: false,
      abstract: false,
      analytical: false,
      critical: false,
      unknown: false,
    },
    emotions: {
      neutral: 10,
    },
    priority: 10,
    description: "Random text 1 for demo",
  },
  {
    categories: {
      creative: true,
      unknown: false,
      concrete: false,
      abstract: false,
      analytical: false,
      critical: false,
    },
    emotions: {
      neutral: 10,
    },
    priority: 16,
    description: "Random text 2 for demo",
  },
  {
    categories: {
      creative: true,
      concrete: true,
      abstract: false,
      analytical: false,
      critical: false,
      unknown: false,
    },
    emotions: {
      neutral: 10,
    },
    priority: 25,
    description: "Random text 3 for demo",
  },
  {
    categories: {
      creative: true,
      concrete: false,
      abstract: false,
      analytical: false,
      critical: false,
      unknown: false,
    },
    emotions: {
      neutral: 10,
    },
    priority: 15,
    description: "Random text 4 for demo",
  },
  {
    categories: {
      creative: true,
      concrete: false,
      abstract: false,
      analytical: false,
      critical: false,
      unknown: false,
    },
    emotions: {
      neutral: 10,
    },
    priority: 19,
    description: "Random text 5 for demo",
  },
  {
    categories: {
      creative: true,
      concrete: false,
      abstract: false,
      analytical: false,
      critical: false,
      unknown: false,
    },
    emotions: {
      joy: 10,
    },
    priority: 50,
    description: "Random text 6 for demo",
  },
  {
    categories: {
      creative: true,
      concrete: false,
      abstract: false,
      analytical: false,
      critical: false,
      unknown: false,
    },
    emotions: {
      anticipation: 10,
    },
    priority: 27,
    description: "Random text 7 for demo",
  },
  {
    categories: {
      creative: true,
      concrete: false,
      abstract: false,
      analytical: false,
      critical: false,
      unknown: false,
    },
    emotions: {
      fear: 10,
    },
    priority: 37,
    description: "Random text 8 for demo",
  },
  {
    categories: {
      creative: true,
      concrete: false,
      abstract: false,
      analytical: false,
      critical: false,
      unknown: false,
    },
    emotions: {
      fear: 10,
    },
    priority: 70,
    description: "Random text 9 for demo",
  },
  {
    categories: {
      creative: true,
      concrete: false,
      abstract: false,
      analytical: false,
      critical: false,
      unknown: false,
    },
    emotions: {
      sadness: 10,
    },
    priority: 12,
    description: "Random text 10 for demo",
  },
  {
    categories: {
      creative: true,
      concrete: false,
      abstract: false,
      analytical: false,
      critical: false,
      unknown: false,
    },
    emotions: {
      trust: 10,
    },
    priority: 34,
    description: "Random text 11 for demo",
  },
  {
    categories: {
      creative: false,
      concrete: false,
      abstract: false,
      analytical: true,
      critical: false,
      unknown: false,
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
    description: "Random text 12 for demo",
  },
  {
    categories: {
      creative: true,
      concrete: false,
      abstract: false,
      analytical: false,
      critical: false,
      unknown: false,
    },
    emotions: {
      surprise: 10,
    },
    priority: 10,
    description:
      "Random text 9 for demo Random text 9 for demo Random text 9 for demo Random text 9 for demo Random text 9 for demo Random text 9 for demo Random text 9 for demo Random text 9 for demo Random text 9 for demo ",
  },
];

function debounce(fn: any, ms: number) {
  let timer: any;
  return (_: any) => {
    clearTimeout(timer);
    timer = setTimeout(function (this: any) {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

type State = {
    isRegistered: boolean;
    username: string;
    email: string;
} | undefined

function App() {
  const state: State = useLocation().state
  
  const storedData: FormDataType[] = window.localStorage.getItem("savedData")
    ? JSON.parse(window.localStorage.getItem("savedData")!)
    : ([] as FormDataType[]);

  const [isRegistered, setIsRegistered] = useState(!!state);
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [current, setCurrent] = useState<HTMLDivElement | null>(null);
 
  //To store the formData to be deleted 
  const [hackedNodeData, setHackedNodeData] = useState<FormDataType | null>(
    null
  );
  const [savedData, setSavedData] = useState(
    isDemoActive ? demoData : storedData
  );
  const [userInfo, setUserInfo] = useState({
    username: !!state ? state?.username : "",
    email: !!state ? state?.email : "",
  });
  const [isChartAdded, setIsChartAdded] = useState(false);
  const [dimensions, setDimensions] = useState({
    w: 0,
    h: 0,
  });
  const [formData, setFormData] = useState({
    categories: {
      creative: false,
      concrete: false,
      abstract: false,
      analytical: false,
      critical: false,
      unknown: false,
    },
    emotions: {},
    priority: 20,
    description: "",
  });

  const ref = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const accountInfoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsChartAdded(false);
    setDimensions({
      w: ref2.current!.getBoundingClientRect().width,
      h: ref2.current!.getBoundingClientRect().height,
    });
    const handleDebounceResize = debounce(function handleResize() {
      setIsChartAdded(false);
      setDimensions({
        w: ref2.current!.getBoundingClientRect().width,
        h: ref2.current!.getBoundingClientRect().height,
      });
    }, 300);

    window.addEventListener("resize", handleDebounceResize);
    return ref.current!.removeEventListener("resize", handleDebounceResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrent(() => ref.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  function handleNodeClick(e: any) {
    e.stopPropagation();
    const r = e.srcElement.r.baseVal.value;
    current!.firstElementChild!.lastElementChild!.previousElementSibling!.innerHTML =
      JSON.parse(e.srcElement.id).description;
    current!.firstElementChild!.lastElementChild!.innerHTML = e.srcElement.id;
    let xPosition =
      Number(e.srcElement.cx.baseVal.valueAsString) + dimensions.w / 2 - r;
    let isUp = false;
    if (
      current!.offsetHeight > 70 + r &&
      Math.round(
        Number(e.srcElement.cy.baseVal.valueAsString) + dimensions.h / 2
      ) === r
    ) {
      xPosition = xPosition + r * 2;
      isUp = true;
    }
    if (
      e.srcElement.cx.baseVal.value >
      dimensions.w / 2 - r - current!.offsetWidth
    ) {
      xPosition = xPosition - current!.offsetWidth + 2 * r;
      if (isUp) {
        xPosition = xPosition - r * 4;
      }
    }
    const yPosition =
      Number(e.srcElement.cy.baseVal.valueAsString) +
      dimensions.h / 2 +
      70 -
      r -
      current!.offsetHeight;
    current!.style.left = xPosition + "px";
    current!.style.top = yPosition < 0 ? "0px" : yPosition + "px";
    current!.style.visibility = "visible";
  }

  function handleEdit(hackDataRef: any) {
    const data = hackDataRef.current!.innerHTML;
    setHackedNodeData(JSON.parse(data));
    current!.style.visibility = "hidden";
    setFormData(() => JSON.parse(data));
    setShowForm(true);
  }

  function handleDelete(hackDataRef: any) {
    const data = hackDataRef.current!.innerHTML;
    const { categories, emotions, description, priority } = JSON.parse(data);
    const newSavedData = (savedData as any).filter((d: FormDataType) => {
      return (
        d.categories !== categories &&
        d.emotions !== emotions &&
        d.description !== description &&
        d.priority !== priority
      );
    });
    setSavedData([...newSavedData]);
    if (isRegistered) {
      fetch(process.env.REACT_APP_MODIFY_DATA_API!, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userInfo.email,
          toBeDeleted: JSON.parse(data),
          operation: DataOperation.DELETE
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data.status);
        });
    }
    setIsChartAdded(false);
    current!.style.visibility = "hidden";
  }

  return (
    <div className="App">
      <Header
        setIsDemoActive={setIsDemoActive}
        isDemoActive={isDemoActive}
        setShowForm={setShowForm}
        setSavedData={setSavedData}
        setIsChartAdded={setIsChartAdded}
        demoData={demoData}
        isRegistered={isRegistered}
        setIsRegistered={setIsRegistered}
        accountInfoRef={accountInfoRef}
        current={current}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
      />
      <Container ref={ref}>
        <HoverModal handleEdit={handleEdit} handleDelete={handleDelete} />
      </Container>
      <Form
        savedData={savedData}
        setSavedData={setSavedData}
        showForm={showForm}
        setShowForm={setShowForm}
        setIsChartAdded={setIsChartAdded}
        formData={formData}
        setFormData={setFormData}
        isDemoActive={isDemoActive}
        hackedNodeData={hackedNodeData}
        setHackedNodeData={setHackedNodeData}
        userInfo={userInfo}
        isRegistered={isRegistered}
      />
      <Main
        savedData={savedData}
        isChartAdded={isChartAdded}
        setIsChartAdded={setIsChartAdded}
        handleNodeClick={handleNodeClick}
        dimensions={dimensions}
        current={current}
        ref2={ref2}
        accountInfoRef={accountInfoRef}
      />
    </div>
  );
}

export default App;
