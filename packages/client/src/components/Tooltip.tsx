import styled from "@emotion/styled";

const Container = styled("div")({
  position: "absolute",
  maxWidth: 150,
  maxHeight: 150,
  left: -150,
  top: 0,
  backgroundColor: "white",
  boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.2)",
  borderRadius: 8,
  padding: 10,
  fontSize: 11,
  color: "grey",
});

interface Props {
  tooltipRef: any;
}

const Tooltip = (props: Props) => {
  const { tooltipRef } = props;

  return (
    <Container ref={tooltipRef}>
    </Container>
  );
};

export default Tooltip;
