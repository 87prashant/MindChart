/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Emotion } from "./Form";

export const findColors = (emotions: Emotion[]) => {
  const colors: any[] = [];
  const findColor = (emotion: Emotion) => {
    let color;
    switch (emotion) {
      case "neutral":
        color = "#808080";
        break;
      case "Fear":
        color = "#000000";
        break;
      case "Anger":
        color = "#FF0000";
        break;
      case "Sadness":
        color = "#0000FF";
        break;
      case "Surprise":
        color = "#A020F0";
        break;
      case "Joy":
        color = "#00FF00";
        break;
      case "Anticipation":
        color = "#FFFF00";
        break;
      case "Trust":
        color = "#FFFFFF";
        break;
      default:
        color = "#000000";
    }
    return color;
  };
  emotions.forEach((emotion) =>
    colors.push((emotion: Emotion) => findColor(emotion))
  );

  return colors;
};
