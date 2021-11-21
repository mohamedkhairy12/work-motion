import Card from "../components/card/card";
import SearchInput from "../components/searchInput/searchInput";
import SalaryRange from "../components/salaryRange/salaryRange";
import Layout from "../layouts/layout";
import "../styles/globals.scss";
function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <SearchInput />
      <SalaryRange /> 
      <Component {...pageProps} />
      
      <Card />
    </Layout>
  );
}

export default MyApp;
