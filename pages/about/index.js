import Image from "next/image";
import React from "react";
import styles from "./assets/about.module.scss";
// import { ReactComponent as Homzmart } from '.img/homzmart.svg';

const about = () => {
  return (
    <div className="container">
      <h1>about,</h1>
      <div className="row">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
          feugiat volutpat volutpat. Pellentesque ac sem varius, fringilla nibh
          ac, malesuada nibh. Sed interdum nunc nibh , at convallis justo
          laoreet et. Etiam egestas porta felis, in viverra dolor semper quis.
          Nulla facilisi. Donec vestibulum placerat elit, at elementum tortor
          volutpat eget. Curabitur ultricies nibh dolor, et tempus nibh sodales
          nec. In blandit sagittis turpis, non vehicula odio rhoncus fringilla.
          Sed pulvinar, nunc maximus accumsan euismod, libero est posuere sem, a
          ultricies massa lorem nec metus. Cras mattis lacus sed dui auctor, nec
          sodales ipsum iaculis. Pellentesque vehicula dolor nisi, sed pharetra
          tortor semper eget. Sed cursus, erat sed imperdiet interdum, elit orci
          commodo tellus, a cursus turpis ante vitae ante. In ac massa viverra
          libero condimentum condimentum sit amet ut lectus. Nulla feugiat
          semper vulputate. Duis consequat lacinia ante eu viverra. Nunc
          interdum placerat placerat
        </p>
      </div>
    </div>
  );
};

export default about;
