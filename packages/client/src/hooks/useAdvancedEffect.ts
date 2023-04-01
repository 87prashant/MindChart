// Conditionally execute depending on which dependecy has changed
import { useEffect } from "react";

interface Props {
  targetDependency: any;
  otherDependencies: any[];
  commonCode: () => void;
  conditionalCode: () => void;
  elseCode: () => void;
}

const useAdvancedEffect = (props: Props) => {
  const {
    otherDependencies,
    targetDependency,
    commonCode,
    conditionalCode,
    elseCode,
  } = props;
  
  useEffect(() => {
    commonCode();
    conditionalCode;
  }, [targetDependency]);

  useEffect(() => {
    commonCode;
    elseCode;
  }, [...otherDependencies]);
};

export default useAdvancedEffect;
