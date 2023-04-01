import styled from "@emotion/styled";
import { Misc } from "./constants";

const Container = styled("div")({
  width: 20,
  minHeigth: 120,
  border: "none",
  position: "absolute",
  top: Misc.HEADER_HEIGHT + 10,
  left: 50,
  padding: 8,
  backgroundColor: "white",
  borderRadius: 8
});

const Bar = styled("div")<{ canvasScale: number }>(({ canvasScale }) => ({
  position: "relative",
  bottom: 0,
  width: 5,
  height: 100 * Math.pow(canvasScale,2),
  borderRadius: 4,
  backgroundColor: "blue"
}));

interface Props {
  canvasScale: number;
}

const CanvasScaleOverlay = (props: Props) => {
  const { canvasScale } = props;

  return (
    <Container>
      <Bar canvasScale={canvasScale} />
    </Container>
  );
};

export default CanvasScaleOverlay;
