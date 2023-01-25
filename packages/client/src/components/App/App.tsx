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
import NodeClickModal from "../NodeClickModal";
import { DataOperation, Misc } from "../constants";
import { demoData } from "./demoData";

const Container = styled("div")<{ showNodeClickModal: boolean }>(
  ({ showNodeClickModal }) => ({
    border: "2px solid black",
    position: "absolute",
    backgroundColor: "rgba(225, 225, 225, 1)",
    visibility: showNodeClickModal ? "visible" : "hidden",
    borderRadius: 7,
    padding: 4,
    maxWidth: 200,
    maxHeight: 200,
    overflow: "hidden",
  })
);

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
  //Stores if user is Logged in or not
  const [isLoggedIn, setIsRegistered] = useState(!!state);
  //Stores if the demo mode is active or not
  const [isDemoActive, setIsDemoActive] = useState(false);
  //Stores if node form should be visible to create/edit nodes
  const [showNodeForm, setShowNodeForm] = useState(false);
  //Stores if to show the nodeClickModal or not
  const [showNodeClickModal, setShowNodeClickModal] = useState(false);
  //Stores the nodeData to be deleted after we delete or edit the node
  const [hackedNodeData, setHackedNodeData] = useState<NodeDataType | null>(
    null
  );
  //Stores saved data after fetching from database or localStorage
  const [savedData, setSavedData] = useState(
    state?.isLoggedIn ? state.userData ?? [] : getStoredData()
  );
  //Stores info of Logged in user
  const [userInfo, setUserInfo] = useState({
    username: !!state ? state.username : "",
    email: !!state ? state.email : "",
  });
  //Stores if the chart is added/updated or not
  const [isChartAdded, setIsChartAdded] = useState(false);
  //Stores the dimensions of the window to update the chart on zoom in/out
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  //Stores the node form data when creating new node or editing existing data
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

  //NodeClickModal reference
  const nodeClickModalRef = useRef<HTMLDivElement | null>(null);
  //Main reference
  const mainRef = useRef<HTMLDivElement>(null);
  //Account Info modal reference
  const accountInfoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDimensions({
      w: mainRef.current!.getBoundingClientRect().width,
      h: mainRef.current!.getBoundingClientRect().height,
    });
    const handleDebounceResize = debounce(function handleResize() {
      setIsChartAdded(false);
      setDimensions({
        w: mainRef.current!.getBoundingClientRect().width,
        h: mainRef.current!.getBoundingClientRect().height,
      });
    }, 300);
    window.addEventListener("resize", handleDebounceResize);
  }, []);

  //Handles node click
  function handleNodeClick(e: any) {
    e.stopPropagation();
    setShowNodeClickModal(true);

    const current = nodeClickModalRef.current;
    const r = e.srcElement.r.baseVal.value; //node radius
    //Add description of node to modal
    current!.firstElementChild!.lastElementChild!.previousElementSibling!.innerHTML! =
      JSON.parse(e.srcElement.id).description;
    //Add hackedNodeData to modal
    current!.firstElementChild!.lastElementChild!.innerHTML = e.srcElement.id;

    let isTop = false; //is node located on the top in such a way that modal needs to be moved to the right or left of the node
    let isRight = false; //is the node located on the right side in a way that the modal needs to be moved to the left of the node
    if (
      current!.offsetHeight >
        Math.round(
          Number(e.srcElement.cy.baseVal.valueAsString) + dimensions.h / 2 - r
        ) //round off because it is not exactly equal
    ) {
      isTop = true;
    }
    if (
      e.srcElement.cx.baseVal.value >
      dimensions.w / 2 - r - current!.offsetWidth
    ) {
      isRight = true;
    }

    //X-position of nodeClickModal
    let xPosition;
    if (isTop) {
      if (isRight) {
        xPosition =
          Number(e.srcElement.cx.baseVal.valueAsString) +
          dimensions.w / 2 -
          current!.offsetWidth -
          r;
      } else {
        xPosition =
          Number(e.srcElement.cx.baseVal.valueAsString) + dimensions.w / 2 + r;
      }
    } else {
      if (isRight) {
        xPosition =
          Number(e.srcElement.cx.baseVal.valueAsString) +
          dimensions.w / 2 -
          current!.offsetWidth -
          r;
      }
      else{
        xPosition =
          Number(e.srcElement.cx.baseVal.valueAsString) + dimensions.w / 2 - r;
      }
    }

    //Y-position of nodeClickModal
    let yPosition;
    if (isTop || isRight) {
      yPosition =
        Number(e.srcElement.cy.baseVal.valueAsString) +
        dimensions.h / 2 +
        Misc.HEADER_HEIGHT -
        r;
    } else {
      yPosition =
        Number(e.srcElement.cy.baseVal.valueAsString) + dimensions.h / 2 - r + Misc.HEADER_HEIGHT - current!.offsetHeight;
    }
    current!.style.left = xPosition + "px";
    current!.style.top = yPosition < 70 ? "70px" : yPosition + "px";
  }

  //Handles node edit
  function handleEdit(hackDataRef: any) {
    const data = hackDataRef.current!.innerHTML;
    setHackedNodeData(JSON.parse(data));
    setNodeData(() => JSON.parse(data));
    setShowNodeForm(true);
    setShowNodeClickModal(false);
  }

  //Handles node delete
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
    setShowNodeClickModal(false);
  }

  return (
    <div className="App">
      <Header
        setIsDemoActive={setIsDemoActive}
        isDemoActive={isDemoActive}
        setShowNodeForm={setShowNodeForm}
        setSavedData={setSavedData}
        setIsChartAdded={setIsChartAdded}
        demoData={demoData}
        isLoggedIn={isLoggedIn}
        setIsRegistered={setIsRegistered}
        accountInfoRef={accountInfoRef}
        setShowNodeClickModal={setShowNodeClickModal}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
      />
      <Container
        showNodeClickModal={showNodeClickModal}
        ref={nodeClickModalRef}
      >
        <NodeClickModal handleEdit={handleEdit} handleDelete={handleDelete} />
      </Container>
      {showNodeForm && (
        <NodeForm
          savedData={savedData}
          setSavedData={setSavedData}
          showNodeForm={showNodeForm}
          setShowNodeForm={setShowNodeForm}
          setIsChartAdded={setIsChartAdded}
          nodeData={nodeData}
          setNodeData={setNodeData}
          isDemoActive={isDemoActive}
          hackedNodeData={hackedNodeData}
          setHackedNodeData={setHackedNodeData}
          userInfo={userInfo}
          isLoggedIn={isLoggedIn}
        />
      )}
      <Main
        savedData={savedData}
        isChartAdded={isChartAdded}
        setIsChartAdded={setIsChartAdded}
        handleNodeClick={handleNodeClick}
        dimensions={dimensions}
        setShowNodeClickModal={setShowNodeClickModal}
        mainRef={mainRef}
        accountInfoRef={accountInfoRef}
      />
    </div>
  );
}

export default App;
