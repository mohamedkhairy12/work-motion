import React from "react";
import Styles from "./assets/header.module.scss";
import HeaderPhoto from "./assets/image/header.png";
import HeaderRes from "./assets/image/headerRes.png";

const Header = () => {
  return (
    <div className={Styles.container}>
      <div className={Styles.img}>
        <img alt="Picture"  src={HeaderPhoto.src} />
      </div>
      {/* <img className={Styles.img} src={HeaderPhoto.src}/> */}
      <div className={Styles.imgRes}>
        <img alt="Picture"  src={HeaderRes.src} />
      {/* <img className={Styles.imgRes} src={HeaderRes.src}/> */}

      </div>
    </div>
  );
};

export default Header;
