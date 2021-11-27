import React from "react";
import ImageCard from "./assets/image/unsplash_Ay5VDmOaKBo.png";
import ImageCard2 from "./assets/image/unsplash_JBwcenOuRCg.png";
import Styles from "./assets/card.module.scss";
import Link from "next/link";

const card = () => {
  // const goToSalary = () =>{  
  //   window.location.href="/SalaryCalculator";
  // }
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
                <div className={Styles.btn}>
                  <Link href="/SalariesCalculator">
                    <button className={Styles.calc} >Calculate</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6">
          <div className={Styles.contant}>
            <div className={Styles.details}>
              <img className={Styles.imag} src={ImageCard.src} />

              <div className={Styles.text}>
                <p className={Styles.fristText}>County Guide</p>
                <p className={Styles.secondText}>
                  Find information on payroll, labor conditions, statutory
                  benefits, leave conditions, etc.
                </p>
                <p className={Styles.thirdText}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Arcu
                  bibendum fermentum amet faucibus mauris arcu sed justo id.
                </p>
                <div className={Styles.btn}>
                  <button className={Styles.calc}>Learn More</button>
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
