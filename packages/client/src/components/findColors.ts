// currently return color of max intensity emotion

import { Emotion } from "./Form";

export const findColors = (emotions: Emotion) => {
  const findColor = (emotion: string) => {
    switch (emotion) {
      case "neutral":
        return "#808080";
      case "fear":
        return "#000000";
      case "anger":
        return "#FF0000";
      case "sadness":
        return "#0000FF";
      case "surprise":
        return "#A020F0";
      case "joy":
        return "#00FF00";
      case "anticipation":
        return "#FFFF00";
      case "trust":
        return "#FFFFFF";
      default:
        return "#000000";
    }
  };
  let max = Math.max(...(Object.values(emotions) as number[]));
  let emotion = Object.keys(emotions).find(
    (key) => +emotions[key as keyof Emotion]! === max
  );

  return findColor(emotion!);
};
