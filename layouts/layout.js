import React from "react";
import Head from "next/head";
import Hexad from "next/head";

import Footer from "../components/footer/footer";


const layout = ({ children }) => {
  return (
    <div>
      <Head>
        <title>WorkMotion</title>
        <link rel="icon" href="favicon.svg"></link>
      </Head>
     
      <main>
      {children}
      </main>
      <Footer/>
    </div>
  );
};

export default layout;
