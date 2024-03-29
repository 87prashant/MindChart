// TODO two source of truths: 1. database 2. savedData might be inconsistent, Use database only

import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import Main from "../Main";
import Header from "../Header";
import { NodeDataType } from "../NodeForm";
import "../../App.css";
import NodeForm from "../NodeForm";
import NodeClickModal from "../NodeClickModal";
import {
  Apis,
  DataOperation,
  Errors,
  Misc,
  ResponseStatus,
} from "../constants";
import { demoData } from "./demoData";
import Tooltip from "../Tooltip";
import NotificationBanner from "../NotificationBanner";
import ConfirmationModal from "../ConfirmationModal";
import { ObjectId } from "bson";
import CanvasScaleOverlay from "../CanvasScaleOverlay";

const Container = styled("div")<{
  showNodeClickModal: boolean;
  canvasScale: number;
}>(({ showNodeClickModal, canvasScale }) => ({
  border: "1px solid rgba(0, 0, 0, 0.1)",
  position: "absolute",
  backgroundColor: "white",
  visibility: showNodeClickModal ? "visible" : "hidden",
  borderRadius: 7,
  padding: 4,
  maxWidth: 200,
  maxHeight: 200,
  overflow: "hidden",
  transform: `scale(${Math.pow(canvasScale, 0.4)})`,
  transformOrigin: "top left",
}));

// To restrict re-rendering of the chart on zoom in and out
export function debounce(fn: any, ms: number) {
  let timer: any;
  return (_: any) => {
    clearTimeout(timer);
    timer = setTimeout(function (this: any) {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

// Returns saved Data in case of not logged in
function getStoredData() {
  return !!window.localStorage.getItem("savedData")
    ? JSON.parse(window.localStorage.getItem("savedData")!).map(
        (d: NodeDataType) => {
          return { ...d, _id: new ObjectId(d._id) };
        }
      )
    : ([] as NodeDataType[]);
}

export interface UserInfoType {
  username: string;
  email: string;
  imageUrl: string;
}

type State =
  | {
      isLoggedIn: boolean;
      userInfo: { username: string; email: string; imageUrl: string };
      userData?: NodeDataType[];
    }
  | undefined;

function App() {
  // It is passed in case routed from verification and forget-password page
  const state: State = useLocation().state;
  // Stores userInfo: email, username, imageUrl
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(
    !!state?.userInfo
      ? state.userInfo
      : !!window.localStorage.getItem("userInfo")
      ? JSON.parse(window.localStorage.getItem("userInfo")!)
      : null
  );

  // Stores if the demo mode is active or not
  const [isDemoActive, setIsDemoActive] = useState(false);
  // Stores if node form should be visible to create/edit nodes
  const [showNodeForm, setShowNodeForm] = useState(false);
  // Stores if to show the nodeClickModal or not
  const [showNodeClickModal, setShowNodeClickModal] = useState(false);
  // Stores the clicked node for deletion or updation the node
  const [selectedNode, setSelectedNode] = useState<NodeDataType | null>(null);
  // Stores saved data after fetching from database or localStorage
  const [savedData, setSavedData] = useState(
    state?.isLoggedIn ? state.userData ?? [] : getStoredData()
  );
  // Stores if the chart is added/updated or not
  const [isChartAdded, setIsChartAdded] = useState(false);
  // Stores the dimensions of the window to update the chart on zoom in/out
  const [dimensions, setDimensions] = useState({
    w: window.innerWidth,
    h: window.innerHeight - Misc.HEADER_HEIGHT,
  });
  // Store whether to show the profile modal or not
  const [showProfileModal, setShowProfileModal] = useState(false);
  // Stores the node form data when creating new node or editing existing data
  const [nodeData, setNodeData] = useState({
    thoughts: {},
    emotions: {},
    priority: 20,
    description: "",
    _id: new ObjectId(),
  });
  // Stores whether to show Tooltip or not
  const [showTooltip, setShowTooltip] = useState(false);
  // Stores timeout id of tooltip
  const [tooltipTimeoutId, setTooltipTimeoutId] =
    useState<NodeJS.Timeout | null>(null);
  // Stores whether to show the notification banner or not
  const [showNotificationBanner, setShowNotificationBanner] =
    useState<boolean>(false);
  // Stores whether to show the confirmation modal or not
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  // Stores handleConfirmation function for confirmation modal
  const [handleConfirmation, setHandleConfirmation] = useState(null);
  // Stores the scale of canvas elements when user zoom in and out
  const [canvasScale, setCanvasScale] = useState(1);
  // Stores whether to show canvas scale overlay
  const [showCanvasScaleOverlay, setShowCanvasScaleOverlay] = useState(false);
  // Stores if updating the existing nodes
  const [isEditing, setIsEditing] = useState(false);

  // NodeClickModal reference
  const nodeClickModalRef = useRef<HTMLDivElement | null>(null);
  // Main reference
  const mainRef = useRef<HTMLDivElement>(null);
  // Tooltip reference
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  // NotificationBanner reference
  const notificationBannerRef = useRef<HTMLDivElement | null>(null);
  // ConfirmationModal reference
  const confirmationModalRef = useRef<HTMLDivElement | null>(null);
  // Server timeout id
  const serverTimeoutId = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isDemoActive) {
      window.localStorage.setItem("savedData", JSON.stringify(savedData));
    }
  }, [savedData, isDemoActive]);

  useEffect(() => {
    window.localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }, [userInfo]);

  useEffect(() => {
    const handleDebounceResize = debounce(function handleResize() {
      setIsChartAdded(false);
      setShowNodeClickModal(false);
      setDimensions({
        w: window.innerWidth,
        h: window.innerHeight - Misc.HEADER_HEIGHT,
      });
    }, 300);
    window.addEventListener("resize", handleDebounceResize);
  }, []);

  // Handles node click
  const handleNodeClick = (
    e: any,
    selectedNodeData: NodeDataType,
    radius: number
  ) => {
    e.stopPropagation();
    setShowNodeClickModal(true);
    setSelectedNode(selectedNodeData);
    const current = nodeClickModalRef.current;
    // Add description of node to modal
    current!.firstElementChild!.lastElementChild!.innerHTML! =
      selectedNodeData.description;
    let isTop = false; //is node located on a position so that modal needs to be moved to the right of the node
    let isRight = false; //is the node located on a position so that the modal needs to be moved to the left of the node
    if (
      current!.offsetHeight * Math.pow(canvasScale, 0.4) >
      Number(e.srcElement.cy.baseVal.valueAsString) + dimensions.h / 2 - radius
    ) {
      isTop = true;
    }
    if (
      e.srcElement.cx.baseVal.value >
      dimensions.w / 2 -
        radius -
        current!.offsetWidth * Math.pow(canvasScale, 0.4)
    ) {
      isRight = true;
    }
    // X-position of nodeClickModal
    let xPosition;
    if (isTop) {
      if (isRight) {
        xPosition =
          Number(e.srcElement.cx.baseVal.valueAsString) +
          dimensions.w / 2 -
          current!.offsetWidth * Math.pow(canvasScale, 0.4) -
          radius;
      } else {
        xPosition =
          Number(e.srcElement.cx.baseVal.valueAsString) +
          dimensions.w / 2 +
          radius;
      }
    } else {
      if (isRight) {
        xPosition =
          Number(e.srcElement.cx.baseVal.valueAsString) +
          dimensions.w / 2 -
          current!.offsetWidth * Math.pow(canvasScale, 0.4) -
          radius;
      } else {
        xPosition =
          Number(e.srcElement.cx.baseVal.valueAsString) +
          dimensions.w / 2 -
          radius;
      }
    }
    // Y-position of nodeClickModal
    let yPosition;
    if (isTop || isRight) {
      yPosition =
        Number(e.srcElement.cy.baseVal.valueAsString) +
        dimensions.h / 2 +
        Misc.HEADER_HEIGHT -
        current!.offsetHeight * Math.pow(canvasScale, 0.4);
    } else {
      yPosition =
        Number(e.srcElement.cy.baseVal.valueAsString) +
        dimensions.h / 2 -
        radius +
        Misc.HEADER_HEIGHT -
        current!.offsetHeight * Math.pow(canvasScale, 0.4);
    }
    current!.style.left = xPosition + "px";
    current!.style.top =
      yPosition < Misc.HEADER_HEIGHT
        ? Misc.HEADER_HEIGHT + "px"
        : yPosition + "px";
  };

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

  // Handles mouseout for element to hide tooltip
  function handleTooltipMouseOut() {
    setShowTooltip(false);
    clearTimeout(tooltipTimeoutId as unknown as number);
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

  // Handles node edit
  function handleEdit() {
    setNodeData(selectedNode!);
    setShowNodeForm(true);
    setShowNodeClickModal(false);
    setIsEditing(true);
  }

  // Handles node delete
  function handleDelete() {
    const newSavedData = savedData.filter((d: NodeDataType) => {
      return !d!._id.equals(selectedNode!._id);
    });
    setSavedData([...newSavedData]);
    if (!!userInfo) {  // check is logged in ?
      serverTimeoutId.current = setTimeout(() => {
        handleStatus();
      }, Misc.MODIFY_DATA_API_TIMEOUT) as unknown as number;
      fetch(`${process.env.REACT_APP_BASE_URL!}${Apis.MODIFY_DATA_API}`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: JSON.parse(window.localStorage.getItem("userInfo")!).email,
          data: selectedNode,
          operation: DataOperation.DELETE,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === ResponseStatus.OK) {
            // do nothing for now
          } else {
            handleNotificationBanner(Errors.SERVER_ERROR, ResponseStatus.ERROR);
          }
          clearTimeout(serverTimeoutId.current);
        });
    }
    setIsChartAdded(false);
    setShowNodeClickModal(false);
  }

  function handleStatus() {
    handleNotificationBanner(Errors.SERVER_ERROR, ResponseStatus.ERROR);
  }

  return (
    <div className="App">
      {showNotificationBanner && (
        <NotificationBanner notificationBannerRef={notificationBannerRef} />
      )}
      {showTooltip && <Tooltip tooltipRef={tooltipRef} />}
      {showConfirmationModal && (
        <ConfirmationModal
          confirmationModalRef={confirmationModalRef}
          setShowConfirmationModal={setShowConfirmationModal}
          handleConfirmation={handleConfirmation}
          setHandleConfirmation={setHandleConfirmation}
        />
      )}
      {showCanvasScaleOverlay && (
        <CanvasScaleOverlay canvasScale={canvasScale} />
      )}
      <Header
        setIsDemoActive={setIsDemoActive}
        isDemoActive={isDemoActive}
        setShowNodeForm={setShowNodeForm}
        setSavedData={setSavedData}
        setIsChartAdded={setIsChartAdded}
        isLoggedIn={!!userInfo}
        setShowProfileModal={setShowProfileModal}
        showProfileModal={showProfileModal}
        setShowNodeClickModal={setShowNodeClickModal}
        handleTooltipMouseIn={handleTooltipMouseIn}
        handleTooltipMouseOut={handleTooltipMouseOut}
        handleNotificationBanner={handleNotificationBanner}
        setShowConfirmationModal={setShowConfirmationModal}
        setHandleConfirmation={setHandleConfirmation}
        setUserInfo={setUserInfo}
        userInfo={userInfo}
      />
      <Container
        showNodeClickModal={showNodeClickModal}
        ref={nodeClickModalRef}
        canvasScale={canvasScale}
      >
        <NodeClickModal
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          setHandleConfirmation={setHandleConfirmation}
          setShowConfirmationModal={setShowConfirmationModal}
        />
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
          isLoggedIn={!!userInfo}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleNotificationBanner={handleNotificationBanner}
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
        setCanvasScale={setCanvasScale}
        canvasScale={canvasScale}
        setShowCanvasScaleOverlay={setShowCanvasScaleOverlay}
      />
    </div>
  );
}

export default App;
