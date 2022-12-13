import React, { useRef } from "react";
import styled from "@emotion/styled";

const Header = styled("div")({
  display: "flex",
  flexDirection: "row-reverse",
  "& button + button": {
    marginRight: 5,
  },
});

const Button = styled("button")<{ name: string }>(({ name }) => ({
  border: "2px solid black",
  cursor: "pointer",
  backgroundColor: name === "delete" ? "red" : undefined,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 7,
  userSelect: "none",
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
  cursor: "default",
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

const HackDataDiv = styled("div")({
  position: "absolute",
});

interface Props {
  handleEdit: any;
  handleDelete: any;
}

const HoverModal = (props: Props) => {
  const { handleEdit, handleDelete } = props;

  const ref = useRef<HTMLDivElement | null>(null);
  const hackDataRef = useRef<HTMLDivElement | null>(null);

  return (
    <div>
      <Header>
        <Button name={"delete"} onClick={() => handleDelete(hackDataRef)}>
          <img src="/delete.svg" alt="" />
        </Button>
        <Button name={"edit"} onClick={() => handleEdit(hackDataRef)}>
          <img src="/edit.svg" alt="" />
        </Button>
      </Header>
      <Content ref={ref}></Content>
      <HackDataDiv ref={hackDataRef}></HackDataDiv>
    </div>
  );
};

export default HoverModal;
