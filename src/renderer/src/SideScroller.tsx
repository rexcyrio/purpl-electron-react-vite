import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import { useSelector } from "react-redux";

SideScroller.propTypes = {
  mainContentRef: PropTypes.exact({
    current: PropTypes.instanceOf(Element)
  }),
  side: PropTypes.oneOf(["left", "right"]).isRequired
};

function SideScroller({ mainContentRef, side }) {
  const requestAnimationFrame_isRunning = useRef(false);
  const requestAnimationFrame_id = useRef(0);
  const startTime = useRef(null);
  const isDragging = useSelector((state) => state.isDragging);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "virtualisedRow",
    hover: (item, monitor) => {
      if (!requestAnimationFrame_isRunning.current) {
        startScrolling();
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  function startScrolling() {
    requestAnimationFrame_isRunning.current = true;
    tick();
  }

  function tick() {
    requestAnimationFrame_id.current = window.requestAnimationFrame((timestamp) => {
      if (startTime.current === null) {
        startTime.current = timestamp;
      }

      const elapsedTime = timestamp - startTime.current;

      if (side === "left") {
        mainContentRef.current.scrollLeft -= getScrollAmount(elapsedTime);
      } else {
        mainContentRef.current.scrollLeft += getScrollAmount(elapsedTime);
      }

      tick();
    });
  }

  function stopScrolling() {
    if (requestAnimationFrame_isRunning.current) {
      window.cancelAnimationFrame(requestAnimationFrame_id.current);
    }

    requestAnimationFrame_isRunning.current = false;
    requestAnimationFrame_id.current = 0;
    startTime.current = null;
  }

  useEffect(() => {
    if (!isOver) {
      stopScrolling();
    }
  }, [isOver]);

  return (
    isDragging && (
      <div
        ref={drop}
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
    )
  );
}

function getScrollAmount(elapsedTime) {
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
