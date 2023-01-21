//TODO two source of truths: 1. database 2. savedData might be inconsistent, Use database only
//TODO Add description on every useState, useRef, useMemo, etc.
//TODO Find alternate way of using hackedNodeData

import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import Main from "../Main";
import Header from "../Header";
import { NodeDataType } from "../NodeForm";
import "../../App.css";
import NodeForm from "../NodeForm";
import HoverModal from "../HoverModal";
import { DataOperation } from "../constants";
import { demoData } from "./DemoData";

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

//To restrict re-rendering of the chart on zoom in and out
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
//Returns saved Data in case of not logged in
function getStoredData() {
  return window.localStorage.getItem("savedData")
    ? JSON.parse(window.localStorage.getItem("savedData")!)
    : ([] as NodeDataType[]);
}

type State =
| {
  isLoggedIn: boolean;
  username: string;
  email: string;
  userData?: NodeDataType[];
}
| undefined;

function App() {
  //It is passed in case routed from verification and forget-password page
  const state: State = useLocation().state;
  //To store if user is Logged in or not
  const [isLoggedIn, setIsRegistered] = useState(!!state);
  //To store if the demo mode is active or not
  const [isDemoActive, setIsDemoActive] = useState(false);
  //To store if node form should be visible to create/edit nodes
  const [ showNodeForm,  setShowNodeForm] = useState(false);
  //
  const [current, setCurrent] = useState<HTMLDivElement | null>(null);
  //To store the nodeData to be deleted after we delete or edit the node
  const [hackedNodeData, setHackedNodeData] = useState<NodeDataType | null>(
    null
  );
  //Store saved saved data return after fetching from database or localStorage
  const [savedData, setSavedData] = useState(
    state?.isLoggedIn ? state.userData ?? [] : getStoredData()
  );
  //Store the info of Logged in user
  const [userInfo, setUserInfo] = useState({
    username: !!state ? state?.username : "",
    email: !!state ? state?.email : "",
  });
  //Store if the chart is added—or updated—or not
  const [isChartAdded, setIsChartAdded] = useState(false);
  //Store the dimensions of the window to update the chart on zoom in/out
  const [dimensions, setDimensions] = useState({
    w: 0,
    h: 0,
  });
  //store the node form data when creating new node or editing existing data
  const [nodeData, setNodeData] = useState({
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
    setNodeData(() => JSON.parse(data));
     setShowNodeForm(true);
  }

  function handleDelete(hackDataRef: any) {
    const data = hackDataRef.current!.innerHTML;
    const { categories, emotions, description, priority } = JSON.parse(data);
    const newSavedData = (savedData as any).filter((d: NodeDataType) => {
      return (
        d.categories !== categories &&
        d.emotions !== emotions &&
        d.description !== description &&
        d.priority !== priority
      );
    });
    setSavedData([...newSavedData]);
    if (isLoggedIn) {
      fetch(process.env.REACT_APP_MODIFY_DATA_API!, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userInfo.email,
          toBeDeleted: JSON.parse(data),
          operation: DataOperation.DELETE,
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
         setShowNodeForm={ setShowNodeForm}
        setSavedData={setSavedData}
        setIsChartAdded={setIsChartAdded}
        demoData={demoData}
        isLoggedIn={isLoggedIn}
        setIsRegistered={setIsRegistered}
        accountInfoRef={accountInfoRef}
        current={current}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
      />
      <Container ref={ref}>
        <HoverModal handleEdit={handleEdit} handleDelete={handleDelete} />
      </Container>
      <NodeForm
        savedData={savedData}
        setSavedData={setSavedData}
         showNodeForm={ showNodeForm}
         setShowNodeForm={ setShowNodeForm}
        setIsChartAdded={setIsChartAdded}
        nodeData={nodeData}
        setNodeData={setNodeData}
        isDemoActive={isDemoActive}
        hackedNodeData={hackedNodeData}
        setHackedNodeData={setHackedNodeData}
        userInfo={userInfo}
        isLoggedIn={isLoggedIn}
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
