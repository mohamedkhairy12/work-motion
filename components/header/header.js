import React from "react";
import Styles from "./assets/header.module.scss";
import HeaderPhoto from "./assets/image/header.png";
import HeaderRes from "./assets/image/headerRes.png";
import Image from "next/image";

const Header = () => {
  return (
    <div className={Styles.container}>
      <div className={Styles.img} style={{ position: "relative", width: "100%", paddingBottom: "25%" ,bottom:"10px"}} >
  <Image  layout="fill" objectFit="contain"  alt="Picture" src={HeaderPhoto.src} />
      </div>
      {/* <img className={Styles.img} src={HeaderPhoto.src}/> */}
      <div className={Styles.imgRes}>
        <Image alt="Picture" width={450} height={230} src={HeaderRes.src} />
      {/* <img className={Styles.imgRes} src={HeaderRes.src}/> */}

      </div>
    </div>
  );
};

export default Header;
