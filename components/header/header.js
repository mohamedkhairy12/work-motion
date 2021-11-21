import React from "react";
import Styles from "./assets/header.module.scss";
import HeaderPhoto from "./assets/image/header.png";


const header = () => {
  return (
    <div className={Styles.container}>
        <img className={Styles.img} src={HeaderPhoto.src}/>
    </div>
  );
};


export default header;
