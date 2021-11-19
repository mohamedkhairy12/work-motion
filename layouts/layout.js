import React from "react";
import Head from "next/head";
import Hexad from "next/head";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";


const layout = ({ children }) => {
  return (
    <div>
      <Head>
        <title>about us</title>
        <link rel="icon" href="favicon.ico"></link>
      </Head>
      <Header />
      <main>
      {children}
      </main>
      <Footer/>
    </div>
  );
};

export default layout;