import { Emotion } from "./Form";

export const findColors = (emotions: Emotion[]) => {
  const colors: any[] = [];
  const findColor = (emotion: string) => {
    let color;
    switch (emotion) {
      case "neutral":
        color = "#808080";
        break;
      case "fear":
        color = "#000000";
        break;
      case "anger":
        color = "#FF0000";
        break;
      case "sadness":
        color = "#0000FF";
        break;
      case "surprise":
        color = "#A020F0";
        break;
      case "joy":
        color = "#00FF00";
        break;
      case "anticipation":
        color = "#FFFF00";
        break;
      case "trust":
        color = "#FFFFFF";
        break;
      default:
        color = "#000000";
    }
    return color;
  };
  for (let key in emotions) {
    colors.push(findColor(key));
  }

  return colors;
};
