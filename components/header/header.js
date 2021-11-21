import React from "react";
import Styles from "./assets/header.module.scss";
import HeaderPhoto from "./assets/image/header.png";
import HeaderRes from "./assets/image/headerRes.png";


const header = () => {
  return (
    <div className={Styles.container}>
        <img className={Styles.img} src={HeaderPhoto.src}/>
        <img className={Styles.imgRes} src={HeaderRes.src}/>
    </div>
  );
};


export default header;
