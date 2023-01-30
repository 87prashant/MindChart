//TODO make it more re-usable

import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import DotSvg from "../SvgComponent/DotSvg";

const sizeAnimation = (variable: number) => keyframes`
0% { 
    width: ${variable}px;
    height: ${variable}px;
}
40% {
    width: ${variable * 1.8}px;
    height: ${variable * 1.8}px;
} 
80% { 
    width: ${variable}px;
    height: ${variable}px;
}
100% { 
  width: ${variable}px;
  height: ${variable}px;
}
`;

const Wrapper = styled("div")({
  display: "flex",
});

const Dot = styled("span")<{ size: number; index: number }>(
  ({ size, index }) => ({
    width: 10,
    height: 10,
    "& svg": {
      width: size,
      height: size,
      fill: "green",
      animation: `${sizeAnimation(size)} 1.3s ${index / 6}s infinite`,
    },
  })
);

interface Props {
  size: number;
}

const LoadingAnimation = (props: Props) => {
  const { size } = props;

  return (
    <Wrapper>
      <Dot size={size} index={0}>
        <DotSvg />
      </Dot>
      <Dot size={size} index={1}>
        <DotSvg />
      </Dot>
      <Dot size={size} index={2}>
        <DotSvg />
      </Dot>
    </Wrapper>
  );
};

export default LoadingAnimation;
