import { useState, useEffect, useRef } from "react";
import Main from "./components/Main";
import Header from "./components/Header";
import { FormDataType } from "./components/Form";
import "./App.css";
import Form from "./components/Form";
import HoverModal from "./components/HoverModal";
import styled from "@emotion/styled";

const Container = styled("div")({
  border: "2px solid black",
  position: "absolute",
  visibility: "hidden",
  backgroundColor: "rgba(225, 225, 225, 1)",
  borderRadius: 7,
  padding: 4,
  maxWidth: 200,
  maxHeight: 200,
});

const demoData = [
  {
    categories: {
      creative: true,
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
    },
    emotions: {
      fear: 10,
    },
    priority: 49,
    description: "Random text 9 for demo",
  },
  {
    categories: {
      creative: true,
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
    },
    emotions: {
      trust: 10,
    },
    priority: 34,
    description: "Random text 11 for demo",
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
    description: "Random text 12 for demo",
  },
  {
    categories: {
      creative: true,
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

function App() {
  const [isDemoActive, setIsDemoActive] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [savedData, setSavedData] = useState(
    isDemoActive ? demoData : ([] as FormDataType[])
  );
  const [isChartAdded, setIsChartAdded] = useState(false);
  const [current, setCurrent] = useState<HTMLDivElement | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    w: 0,
    h: 0,
  });

  console.log(savedData)

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

  //handling both mouseover and mouseout of nodes and 'HoverModal' component
  function handleHover(e: any, str: string | undefined) {
    if (!e) {
      current!.style.visibility = "hidden";
      return;
    }
    if (str) {
      current!.style.visibility = str === "visible" ? "visible" : "hidden";
      return;
    }
    const r = e.srcElement.r.baseVal.value;
    current!.firstElementChild!.lastElementChild!.innerHTML = e.srcElement.id;
    let xPosition =
      Number(e.srcElement.cx.baseVal.valueAsString) + dimensions.w / 2 - r;
    let isUp = false;
    if (
      current!.offsetHeight > 80 &&
      Math.floor(
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

  return (
    <div className="App">
      <Header
        setIsDemoActive={setIsDemoActive}
        isDemoActive={isDemoActive}
        setShowForm={setShowForm}
        setSavedData={setSavedData}
        setIsChartAdded={setIsChartAdded}
        demoData={demoData}
      />
      <Container
        ref={ref}
        onMouseOver={(e) => handleHover(e, "visible")}
        onMouseOut={(e) => handleHover(e, "hidden")}
      >
        <HoverModal />
      </Container>
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
        handleHover={handleHover}
        dimensions={dimensions}
        current={current}
        ref2={ref2}
      />
    </div>
  );
}

export default App;
