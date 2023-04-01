import styled from "@emotion/styled";
import { Misc } from "./constants";

const Container = styled("div")({
  width: 20,
  height: 120,
  border: "none",
  position: "absolute",
  top: Misc.HEADER_HEIGHT + 10,
  left: 50,
  padding: 8,
  backgroundColor: "#F4EBD0",
  borderRadius: 8,
  boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
});

const BehindBar = styled("div")({
  position: "absolute",
  border: "1px solid grey",
  bottom: 8,
  width: 5,
  height: 104,
  borderRadius: 4,
});

const Bar = styled("div")<{ canvasScale: number }>(({ canvasScale }) => ({
  position: "absolute",
  bottom: 8,
  width: 5,
  height: 104 * Math.pow(canvasScale, 2),
  borderRadius: 4,
  backgroundColor: "teal",
}));

interface Props {
  canvasScale: number;
}

const CanvasScaleOverlay = (props: Props) => {
  const { canvasScale } = props;

  return (
    <Container>
      <BehindBar />
      <Bar canvasScale={canvasScale} />
    </Container>
  );
};

export default CanvasScaleOverlay;
