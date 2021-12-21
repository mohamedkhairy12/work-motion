import React from "react";
import Styles from './loader.module.scss'
import LoaderJson from './loader.json'
import Lottie from "lottie-react";

const Loader = () => {
    return (
        <>
              <Lottie animationData={LoaderJson } />
        {/* <div className={Styles.ldsRoller} ><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> */}
        </>
    )
}

export default Loader;
