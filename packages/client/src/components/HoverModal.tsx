import React, { useRef } from "react";
import styled from "@emotion/styled";
import { FormDataType } from "./Form";

const Header = styled("div")({
  display: "flex",
  flexDirection: "row-reverse",
});

const Button = styled("button")<{ name: string }>(({ name }) => ({
  marginRight: 5,
  border: "2px solid black",
  cursor: "pointer",
  backgroundColor: name === "delete" ? "red" : undefined,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 7,
  padding: 3,
  "& img": {
    width: 18,
    height: 18,
  },
}));

const Content = styled("div")({
  borderRadius: 7,
  marginTop: 8,
  backgroundColor: "white",
  width: "100%",
  maxHeight: 150,
  overflow: "auto",
  padding: 5,
  "::-webkit-scrollbar": {
    width: 10,
    height: 10,
  },
  "::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 5px grey",
    borderRadius: 8,
  },
  "::-webkit-scrollbar-thumb": {
    background: "rgba(165, 165, 165, 1)",
    borderRadius: 10,
  },
});

interface Props {
  setSavedData: any;
  savedData: any;
  setIsChartAdded: any;
  current: HTMLDivElement | null;
}

const HoverModal = (props: Props) => {
  const { savedData, setSavedData, setIsChartAdded, current } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  function handleDelete(e: any) {
    const description = ref.current!.innerHTML;
    const newSavedData = savedData.filter(
      (d: FormDataType) => d.description !== description
    );
    setSavedData([...newSavedData]);
    setIsChartAdded(false);
    current!.style.visibility = "hidden";
  }

  return (
    <div>
      <Header>
        <Button name={"delete"} onClick={(e) => handleDelete(e)}>
          <img src="/delete.svg" alt="" />
        </Button>
        <Button name={"edit"}>
          <img src="/edit.svg" alt="" />
        </Button>
      </Header>
      <Content ref={ref}></Content>
    </div>
  );
};

export default HoverModal;
