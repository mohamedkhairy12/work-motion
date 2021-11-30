import React from "react";
import Styles from "./assets/footer.module.scss";
import Logo from "./assets/wm-logo.png";
import LinkedIn from "./assets/LinkedIn.png";
import FaceBook from "./assets/FaceBook.png";
import Twitter from "./assets/twitter.png";
import Image from "next/image";

const footer = () => {
  return (
    <div className={Styles.footer}>
      <div className={`container ${Styles.cont}`}>
        <div className="row">
          <div className="col-12 col-sm-3">
            {/* <img src={Logo.src} /> */}
            <Image width={170} height={37} src={Logo.src} />

            <div className={Styles.social}>
              {/* <img src={LinkedIn.src} /> */}
              <span className={Styles.img}>
              <Image
                
                width={26}
                height={25}
                src={LinkedIn.src}
              />
              </span>
              <span className={Styles.img}>
                {/* <img src={Twitter.src} /> */}
                <Image
                  
                  style="margin:40px"
                  width={26}
                  height={25}
                  src={Twitter.src}
                />
              </span>

              <span>
                {/* <img src={FaceBook.src} /> */}
                <Image width={26} height={25} src={FaceBook.src} />
              </span>
            </div>
            <p className={Styles.address}>
              Richard-Ermisch-Str. 7, 10247 Berlin, Germany WorkMotion Software
              GmbH registered with the commercial register in Germany under HRB
              219211 B.
            </p>
          </div>
          <div className="col-12 col-sm-2">
            <p className={Styles.title}>Product</p>
            <p className={Styles.desc}>Workmotion Platform</p>
          </div>
          <div className="col-12 col-sm-2">
            <p className={Styles.title}>Services</p>
            <p className={Styles.desc}>How it works</p>
            <p className={Styles.desc}>Features</p>
          </div>
          <div className="col-12 col-sm-2">
            <p className={Styles.title}>Resources</p>
            <p className={Styles.desc}>Blog</p>
            <p className={Styles.desc}>FAQ</p>
            <p className={Styles.desc}>Privacy Policy</p>
            <p className={Styles.desc}>Imprint</p>
            <p className={Styles.desc}>Help Center</p>
          </div>
          <div className="col-12 col-sm-2">
            <p className={Styles.title}>About Us</p>
            <p className={Styles.desc}>Meet our team</p>
          </div>
          <div className="col-12 col-sm-1">
            <p className={Styles.title}>Careers</p>
            <p className={Styles.desc}>We're hiring</p>
          </div>
        </div>
        <div className={`row ${Styles.rowTwo}`}>
          <div className=" col-12 col-sm-9">
            <p className={Styles.descTwo}>WorkMotion Software GmbH</p>
          </div>
          {/* <div className="col-12 col-sm-3">
                        <button className={Styles.btn}>
                            Book a free Demo
                        </button>
                    </div> */}
        </div>
      </div>
    </div>
  );
};

export default footer;
