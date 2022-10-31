import React from "react";
import styled from "@emotion/styled";

const Header = styled("div")({
  display: "flex",
  flexDirection: "row-reverse",
});

const Button = styled("button")({
  marginRight: 5,
  border: "2px solid black",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 7,
  padding: 3,
  "& img": {
    width: 18,
    height: 18,
  },
});

const HoverModal = () => {
  return (
    <Header>
      <Button>
        <img src="/edit.svg" alt="" />
      </Button>
      <Button>
        <img src="/delete.svg" alt="" />
      </Button>
    </Header>
  );
};

export default HoverModal;
