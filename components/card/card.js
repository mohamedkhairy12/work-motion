import React from "react";
import ImageCard from "./assets/image/unsplash_Ay5VDmOaKBo.png";
import ImageCard2 from "./assets/image/unsplash_JBwcenOuRCg.png";
import Styles from "./assets/card.module.scss";

const card = () => {
  return (
    <div className="container">
      <h1 className={Styles.head}>Explore other features</h1>

      <div className="row">
        <div className="col-12 col-sm-6">
          <div className={Styles.contant}>
            <div className={Styles.details}>
              <img className={Styles.imag} src={ImageCard2.src} />

              <div className={Styles.text}>
                <p className={Styles.fristText}>Net Salary Calculator</p>
                <p className={Styles.secondText}>
                  Calculate and compare the net income of global employees
                </p>
                <p className={Styles.thirdText}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Arcu
                  bibendum fermentum amet faucibus mauris arcu sed justo id.
                </p>
                <div style={{ display: "flex", justifyContent: "end", position: "relative", top: "17%", right: "6%" }}>
                  <button className={Styles.calc}>Calculate</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6">
          <div className={Styles.contant}>
            <div className={Styles.details}>
              <img className={Styles.imag} src={ImageCard2.src} />

              <div className={Styles.text}>
                <p className={Styles.fristText}>Net Salary Calculator</p>
                <p className={Styles.secondText}>
                  Calculate and compare the net income of global employees
                </p>
                <p className={Styles.thirdText}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Arcu
                  bibendum fermentum amet faucibus mauris arcu sed justo id.
                </p>
                <div style={{ display: "flex", justifyContent: "end", position: "relative", top: "17%", right: "6%" }}>
                  <button className={Styles.calc}>Calculate</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="col-12 col-md-1" ></div> */}
      </div>
    </div>
  );
};

export default card;