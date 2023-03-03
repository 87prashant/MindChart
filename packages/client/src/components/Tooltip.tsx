import styled from "@emotion/styled";

const Container = styled("div")({
  position: "absolute",
  maxWidth: 200,
  left: -200,
  top: 0,
  backgroundColor: "white",
  boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
  borderRadius: 8,
  padding: 10,
  fontSize: 12,
  color: "grey",
  display: "flex",
  flexDirection: "column",
  zIndex: 2
});

const QuestionMark = styled("img")({
  width: 10,
  height: 10,
  alignSelf: "end",
  marginBottom: 2,
});

const Message = styled("div")({});

interface Props {
  tooltipRef: any;
}

const Tooltip = (props: Props) => {
  const { tooltipRef } = props;

  return (
    <Container ref={tooltipRef}>
      <QuestionMark src="question_mark.svg" alt="" />
      <Message></Message>
    </Container>
  );
};

export default Tooltip;
