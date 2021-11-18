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
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
          crossorigin="anonymous"
        ></link>
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
