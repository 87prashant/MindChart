import styled from "@emotion/styled";

const Container = styled("div")({
  position: "absolute",
  width: 60,
  height: 60,
  border: "2px solid black",
  left: -200,
  top: 0,
});

interface Props {
  tooltipRef: any;
}

const Tooltip = (props: Props) => {
  const { tooltipRef } = props;

  return (
    <Container ref={tooltipRef}>
      <div>Content</div>
    </Container>
  );
};

export default Tooltip;
