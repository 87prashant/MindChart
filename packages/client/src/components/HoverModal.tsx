import React from "react";
import styled from "@emotion/styled";

const Container = styled("div")({
  border: "2px solid black",
  backgroundColor: "white",
  boxShadow: "5px 5px 4px #888888",
  borderRadius: 7,
  padding: 4,
  maxWidth: 200,
  maxHeight: 200
});

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
    <Container>
      <Header>
        <Button>
          <img src="/edit.svg" alt="" />
        </Button>
        <Button>
          <img src="/delete.svg" alt="" />
        </Button>
      </Header>
    </Container>
  );
};

export default HoverModal;
