import Link from "next/link";
import React from "react";
import {Collapse} from "react-collapse";

const Explainer = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div style={{marginBottom: "1rem"}}>
      <h2
        onClick={() => setIsOpen(!isOpen)}
        style={{textAlign: "center", marginBottom: "1rem"}}
      >
        How to use and general Information: {isOpen ? "▲" : "▼"}
      </h2>
      <Collapse isOpened={isOpen}>
      <h3 style={{textAlign: "center", marginBottom: "1rem"}}>How to use</h3>
        <p style={{textAlign: "center", marginBottom: "1rem"}}>
          To get started upload a .tcs file. You get this by clicking the 3 dots
          at the top of the workout in the Fitbit app and then selecting the
          export option (yes, it takes some time for Fitbit to get the export)
        </p>
        <p style={{textAlign: "center", marginBottom: "1rem"}}>
          You can click on the graph to select a specific time and it will set a
          blue dot on the map
        </p>
        <p style={{textAlign: "center", marginBottom: "1rem"}}>
          Hover over the track on the map to see data for that time
        </p>
        <p style={{textAlign: "center", marginBottom: "1rem"}}>
          To switch the graph to feet for altitude select imperial at the top of
          the page
        </p>
        <h3 style={{textAlign: "center", marginBottom: "1rem"}}>General Information</h3>
        <p style={{textAlign: "center", marginBottom: "1rem"}}>
          The code is fully open source on my{" "}
          <Link
            href={"https://github.com/Christian-Schwarz2003/fitbit-analyze"}
            style={{color: "revert", textDecoration: "revert"}}
          >
            Github
          </Link>
        </p>
        <p style={{textAlign: "center"}}>
          The file is being processed fully within your browser. (You can even
          go offline before uploading your file, the map just will be blank, but
          your track still shows up on it)
        </p>
      </Collapse>
    </div>
  );
};

export default Explainer;
