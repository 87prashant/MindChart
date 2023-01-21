// currently return color of max intensity emotion

import { Emotion } from "./NodeForm";
import { EmotionsList, EmotionsColor } from "./constants";

export const findColors = (emotions: Emotion) => {
  const findColor = (emotion: string) => {
    switch (emotion) {
      case EmotionsList.NEUTRAL:
        return EmotionsColor.NEUTRAL;
      case EmotionsList.FEAR:
        return EmotionsColor.FEAR;
      case EmotionsList.ANGER:
        return EmotionsColor.ANGER;
      case EmotionsList.SADNESS:
        return EmotionsColor.SADNESS;
      case EmotionsList.SURPRISE:
        return EmotionsColor.SURPRISE;
      case EmotionsList.JOY:
        return EmotionsColor.JOY;
      case EmotionsList.ANTICIPATION:
        return EmotionsColor.ANTICIPATION;
      case EmotionsList.TRUST:
        return EmotionsColor.TRUST;
      default:
        return EmotionsColor.DEFAULT;
    }
  };
  let max = Math.max(...(Object.values(emotions) as number[]));
  let emotion = Object.keys(emotions).find(
    (key) => +emotions[key as keyof Emotion]! === max
  );

  return findColor(emotion!);
};
