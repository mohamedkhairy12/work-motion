import Card from "../components/card/card";
import SearchInput from "../components/searchInput/searchInput";
import SalaryRange from "../components/salaryRange/salaryRange";
import Layout from "../layouts/layout";
import "../styles/globals.scss";
function MyApp({ Component, pageProps }) {
  return (
    <Layout>
<<<<<<< HEAD
      <Component {...pageProps} />
=======
>>>>>>> c036f99743585b525a47e50cb1ee4488495ac582
      <SearchInput />
      <SalaryRange /> 
      <Component {...pageProps} />
      
      <Card />
    </Layout>
  );
}

export default MyApp;
