import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useAppSelector } from "@renderer/store/hooks";
import PropTypes from "prop-types";
import React, { useRef } from "react";

SideScroller.propTypes = {
  fileExplorerRef: PropTypes.exact({
    current: PropTypes.instanceOf(HTMLDivElement)
  }),
  side: PropTypes.oneOf(["left", "right"]).isRequired
};

function SideScroller({ fileExplorerRef, side }): JSX.Element {
  const requestAnimationFrame_isRunning = useRef(false);
  const requestAnimationFrame_id = useRef(0);
  const startTime = useRef<number | null>(null);
  const isDragging = useAppSelector((state) => state.isDragging);

  // const [{ isOver }, drop] = useDrop(() => ({
  //   accept: "virtualisedRow",
  //   hover: (item, monitor) => {
  //     if (!requestAnimationFrame_isRunning.current) {
  //       startScrolling();
  //     }
  //   },
  //   collect: (monitor) => ({
  //     isOver: monitor.isOver()
  //   })
  // }));

  function startScrolling(): void {
    requestAnimationFrame_isRunning.current = true;
    tick();
  }

  function tick(): void {
    requestAnimationFrame_id.current = window.requestAnimationFrame((timestamp) => {
      if (startTime.current === null) {
        startTime.current = timestamp;
      }

      const elapsedTime = timestamp - startTime.current;

      if (side === "left") {
        fileExplorerRef.current.scrollLeft -= getScrollAmount(elapsedTime);
      } else {
        fileExplorerRef.current.scrollLeft += getScrollAmount(elapsedTime);
      }

      tick();
    });
  }

  function stopScrolling(): void {
    if (requestAnimationFrame_isRunning.current) {
      window.cancelAnimationFrame(requestAnimationFrame_id.current);
    }

    requestAnimationFrame_isRunning.current = false;
    requestAnimationFrame_id.current = 0;
    startTime.current = null;
  }

  // useEffect(() => {
  //   if (!isOver) {
  //     stopScrolling();
  //   }
  // }, [isOver]);

  return (
    <>
      {isDragging ? (
        <div
          // ref={drop}
          style={{
            height: "32%",
            width: "3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "pink",
            position: "absolute",
            top: "calc(50% - 16%)",
            [side]: "0"
          }}
        >
          {side === "left" ? <ArrowBackIosNewIcon /> : <ArrowForwardIosIcon />}
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

function getScrollAmount(elapsedTime: number): number {
  const base = 7;

  if (elapsedTime < 1500) {
    return base;
  }

  if (elapsedTime < 3000) {
    return 2.5 * base;
  }

  return 5 * base;
}

export default React.memo(SideScroller);
