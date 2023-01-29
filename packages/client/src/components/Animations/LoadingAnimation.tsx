//TODO fix the displacement of the dots on size change and make component more modular

import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import DotSvg from "../SvgComponent/DotSvg";

const sizeAnimation = (variable: number) => keyframes`
0% { 
    width: ${variable}px;
    height: ${variable}px;
}
50% {
    width: ${variable * 2}px;
    height: ${variable * 2}px;
} 
100% { 
    width: ${variable}px;
    height: ${variable}px;
}`;

const Wrapper = styled("div")<{ variable: number }>(({ variable }) => ({
  display: "flex",
}));

const Dot = styled("span")<{ size: number; index: number }>(
  ({ size, index }) => ({
    width: 10,
    height: 10,
    transition: "all ease 1s",
    "& svg": {
      width: size,
      height: size,
      fill: "green",
      animation: `${sizeAnimation(size)} 1s ${index / 6}s infinite`,
    },
  })
);

interface Props {
  size: number;
}

const LoadingAnimation = (props: Props) => {
  const { size } = props;

  return (
    <Wrapper variable={size}>
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
