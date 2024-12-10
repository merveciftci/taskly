import { useCallback, useEffect, useRef } from "react";

const useOutsideClick = (onClose) => {
  const containerRef = useRef();

  const handleClick = useCallback(
    (event) => {
      if (
        !containerRef.current ||
        containerRef.current.contains(event.target)
      ) {
        return;
      }

      onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.body.addEventListener("mousedown", handleClick);

    return () => {
      document.body.removeEventListener("mousedown", handleClick);
    };
  }, [handleClick]);

  return containerRef;
};

export default useOutsideClick;
