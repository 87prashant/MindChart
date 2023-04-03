// Conditionally execute depending on which dependecy has changed
import { useEffect } from "react";

export interface EffectProps {
  conditionalCode: () => any;
  elseCode: () => void;
  conditionalDep: any[];
  elseDep: any[];
}

const useConditionalEffect = (props: EffectProps) => {
  const { conditionalCode, elseCode, conditionalDep, elseDep } = props;

  useEffect(() => {
    conditionalCode();
  }, [...conditionalDep]);

  useEffect(() => {
    elseCode();
  }, [...elseDep]);
};

export default useConditionalEffect;
