//TODO two source of truths: 1. database 2. savedData might be inconsistent, Use database only
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
import { DataOperation, Misc, ResponseStatus } from "../constants";
import { demoData } from "./demoData";
import Tooltip from "../Tooltip";
import NotificationBanner from "../NotificationBanner";

const Container = styled("div")<{ showNodeClickModal: boolean }>(
  ({ showNodeClickModal }) => ({
    border: "1px solid rgba(0, 0, 0, 0.1)",
    position: "absolute",
    backgroundColor: "white",
    // backgroundColor: "rgba(225, 225, 225, 1)",
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
  //Stores info of logged-in user
  const [userInfo, setUserInfo] = useState({
    username: !!state ? state.username : "",
    email: !!state ? state.email : "",
  });
  //Stores if the chart is added/updated or not
  const [isChartAdded, setIsChartAdded] = useState(false);
  //Stores the dimensions of the window to update the chart on zoom in/out
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  //Store whether to show the profile modal or not
  const [showProfileModal, setShowProfileModal] = useState(false);
  //Stores the node form data when creating new node or editing existing data
  const [nodeData, setNodeData] = useState({
    thoughts: {},
    emotions: {},
    priority: 20,
    description: "",
  });
  // Stores whether to show Tooltip or not
  const [showTooltip, setShowTooltip] = useState(false);
  // Stores timeout id of tooltip
  const [tooltipTimeoutId, setTooltipTimeoutId] =
    useState<NodeJS.Timeout | null>(null);
  // Stores whether to show the notification banner or not
  const [showNotificationBanner, setShowNotificationBanner] =
    useState<boolean>(false);

  // NodeClickModal reference
  const nodeClickModalRef = useRef<HTMLDivElement | null>(null);
  // Main reference
  const mainRef = useRef<HTMLDivElement>(null);
  // Tooltip reference
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  // NotificationBanner reference
  const notificationBannerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDimensions({
      w: mainRef.current!.getBoundingClientRect().width,
      h: mainRef.current!.getBoundingClientRect().height,
    });
    const handleDebounceResize = debounce(function handleResize() {
      setIsChartAdded(false);
      setShowNodeClickModal(false);
      setDimensions({
        w: mainRef.current!.getBoundingClientRect().width,
        h: mainRef.current!.getBoundingClientRect().height,
      });
    }, 300);
    window.addEventListener("resize", handleDebounceResize);
  }, []);

  // Handles node click
  function handleNodeClick(e: any) {
    e.stopPropagation();
    setShowNodeClickModal(true);

    const current = nodeClickModalRef.current;
    const r = e.srcElement.r.baseVal.value; //node radius
    // Add description of node to modal
    current!.firstElementChild!.lastElementChild!.previousElementSibling!.innerHTML! =
      JSON.parse(e.srcElement.id).description;
    // Add hackedNodeData to modal
    current!.firstElementChild!.lastElementChild!.innerHTML = e.srcElement.id;

    let isTop = false; //is node located on a position so that modal needs to be moved to the right of the node
    let isRight = false; //is the node located on a position so that the modal needs to be moved to the left of the node
    if (
      current!.offsetHeight >
      Number(e.srcElement.cy.baseVal.valueAsString) + dimensions.h / 2 - r
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
      } else {
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
        current!.offsetHeight;
    } else {
      yPosition =
        Number(e.srcElement.cy.baseVal.valueAsString) +
        dimensions.h / 2 -
        r +
        Misc.HEADER_HEIGHT -
        current!.offsetHeight;
    }

    current!.style.left = xPosition + "px";
    current!.style.top = yPosition < 70 ? "70px" : yPosition + "px";
  }

  // Handles mouse-in for element to show tooltip
  function handleTooltipMouseIn(e: any) {
    setShowTooltip(true);
    const content = e.currentTarget.getAttribute("data-tooltip");

    setTooltipTimeoutId(() =>
      setTimeout(() => {
        const current = tooltipRef.current as HTMLDivElement;
        current.lastElementChild!.innerHTML = content;

        const tooltipWidth = current!.offsetWidth;
        let shiftToLeft = 0;

        if (tooltipWidth > dimensions.w - e.pageX) {
          shiftToLeft = tooltipWidth - dimensions.w + e.pageX;
        }

        current!.style.left = e.pageX - shiftToLeft + "px";
        current!.style.top = e.pageY + 15 + "px"; // extra 15 px to put it below the element
      }, Misc.TOOLTIP_DELAY)
    );
  }

  // Handles mouse-out for element to hide tooltip
  function handleTooltipMouseOut() {
    setShowTooltip(false);
    clearTimeout(tooltipTimeoutId as unknown as number);
  }

  // Handles node edit
  function handleEdit(hackDataRef: any) {
    const hackedData = hackDataRef.current!.innerHTML;
    setHackedNodeData(JSON.parse(hackedData));
    setNodeData(() => JSON.parse(hackedData));
    setShowNodeForm(true);
    setShowNodeClickModal(false);
  }

  // Handles notification banner visibility
  function handleNotificationBanner(message: string, messageType: string) {
    setShowNotificationBanner(true);

    setTimeout(() => {
      const current = notificationBannerRef!.current;
      current!.lastElementChild!.innerHTML = message;
      current!.style.left = dimensions.w / 2 - current?.offsetWidth! / 2 + "px";
      current!.style.opacity = "1";

      if (messageType === ResponseStatus.OK) {
        current!.style.color = "green"; //
      } else {
        current!.style.color = "red";
      }
    }, 100); // 100 ms, to escape from null/undefined

    setTimeout(() => {
      const current = notificationBannerRef!.current;
      current!.style.opacity = "0";
    }, 3000);

    setTimeout(() => {
      setShowNotificationBanner(false);
    }, 3500);
  }

  // Handles node delete
  function handleDelete(hackDataRef: any) {
    const hackedData = hackDataRef.current!.innerHTML;
    const newSavedData = savedData.filter(
      (d: NodeDataType) => JSON.stringify(d) !== hackedData
    );
    setSavedData([...newSavedData]);

    if (isLoggedIn) {
      fetch(process.env.REACT_APP_MODIFY_DATA_API!, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userInfo.email,
          toBeDeleted: JSON.parse(hackedData),
          operation: DataOperation.DELETE,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          //if status is error, inform the user
        });
    }

    setIsChartAdded(false);
    setShowNodeClickModal(false);
  }

  return (
    <div className="App">
      {showNotificationBanner && (
        <NotificationBanner notificationBannerRef={notificationBannerRef} />
      )}
      {showTooltip && <Tooltip tooltipRef={tooltipRef} />}
      <Header
        setIsDemoActive={setIsDemoActive}
        isDemoActive={isDemoActive}
        setShowNodeForm={setShowNodeForm}
        setSavedData={setSavedData}
        setIsChartAdded={setIsChartAdded}
        demoData={demoData}
        isLoggedIn={isLoggedIn}
        setIsRegistered={setIsRegistered}
        setShowProfileModal={setShowProfileModal}
        showProfileModal={showProfileModal}
        setShowNodeClickModal={setShowNodeClickModal}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
        handleTooltipMouseIn={handleTooltipMouseIn}
        handleTooltipMouseOut={handleTooltipMouseOut}
        handleNotificationBanner={handleNotificationBanner}
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
        setShowProfileModal={setShowProfileModal}
      />
    </div>
  );
}

export default App;
