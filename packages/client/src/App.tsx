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

// only for checking working
const temp = [
  {
    categories: {
      creative: true,
    },
    emotions: {
      neutral: 10,
    },
    priority: 10,
    description: "kdfjskdcvsdffjlskdj",
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
    description: "kdfjsdfsskdfjlskdj",
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
    description: "kdfjskdfjlsksdfssdj",
  },
  {
    categories: {
      creative: true,
    },
    emotions: {
      neutral: 10,
    },
    priority: 15,
    description: "kddsfjskdfjlskdj",
  },
  {
    categories: {
      creative: true,
    },
    emotions: {
      neutral: 10,
    },
    priority: 19,
    description: "kdfjskdfjfsdfsdfsdlskdj",
  },
  {
    categories: {
      creative: true,
    },
    emotions: {
      joy: 10,
    },
    priority: 50,
    description: "kdfjskdfjfsdfsdfsdlskdj",
  },
  {
    categories: {
      creative: true,
    },
    emotions: {
      anticipation: 10,
    },
    priority: 27,
    description: "kdfjskdfjfsdfsdfsdlskdj",
  },
  {
    categories: {
      creative: true,
    },
    emotions: {
      fear: 10,
    },
    priority: 37,
    description: "kdfjskdfjfsdfsdfsdlskdj",
  },
  {
    categories: {
      creative: true,
    },
    emotions: {
      fear: 10,
    },
    priority: 49,
    description: "kdfjskdfjfsdfsdfsdlskdj",
  },
  {
    categories: {
      creative: true,
    },
    emotions: {
      sadness: 10,
    },
    priority: 12,
    description: "Hello all",
  },
  {
    categories: {
      creative: true,
    },
    emotions: {
      trust: 10,
    },
    priority: 34,
    description: "kdfjskdfjfsdfsdfsdlskdj",
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
    description: "kdfjskdfjfsdfsdfsdlskdj",
  },
  {
    categories: {
      creative: true,
    },
    emotions: {
      surprise: 10,
    },
    priority: 34,
    description:
      "Hello all kdsfjsdkl fsdkjf dkslfj dskljfsdk lfjds;kljf sdkljfsd;jds;lkj flksj flkdsjf lkdsj flkdsjf lkdsj flkdsjf lkdjsflkdsjfdsk lfjdksljf",
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
  const [showForm, setShowForm] = useState(false);
  const [savedData, setSavedData] = useState(temp as FormDataType[]);
  const [isChartAdded, setIsChartAdded] = useState(false);
  const [current, setCurrent] = useState<HTMLDivElement | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    w: 0,
    h: 0,
  });

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
      current!.style.visibility = str === "block" ? "visible" : "hidden";
      return;
    }
    const r = e.srcElement.r.baseVal.value;
    current!.firstElementChild!.lastElementChild!.innerHTML = e.srcElement.id;
    let xPosition =
      Number(e.srcElement.cx.baseVal.valueAsString) + dimensions.w / 2 - r;
    console.log(current!.offsetHeight);
    if (current!.offsetHeight > 80) {
      xPosition = xPosition + r * 2 - 10;
    }
    if (
      e.srcElement.cx.baseVal.value >
      dimensions.w / 2 - r - current!.offsetWidth
    ) {
      xPosition = xPosition - r * 2 - current!.offsetWidth + 20;
    }
    const yPosition =
      Number(e.srcElement.cy.baseVal.valueAsString) + dimensions.h / 2 - r;
    current!.style.left = xPosition + "px";
    current!.style.top = yPosition + "px";
    current!.style.visibility = "visible";
  }

  return (
    <div className="App">
      <Header setShowForm={setShowForm} />
      <Container
        ref={ref}
        onMouseOver={(e) => handleHover(e, "block")}
        onMouseOut={(e) => handleHover(e, "none")}
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
        ref2={ref2}
      />
    </div>
  );
}

export default App;
