// import SearchInput from "../components/searchInput/searchInput";
import Layout from "../layouts/layout";
import "../styles/globals.scss";
import SalaryRange from "../components/salaryRange/salaryRange";
function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <SalaryRange />
      <Component {...pageProps} />

      {/* <SearchInput /> */}
    </Layout>
  );
}

export default MyApp;
