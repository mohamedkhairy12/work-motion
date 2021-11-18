import SearchInput from "../components/searchInput/searchInput";
import Layout from "../layouts/layout";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }) {
  return (
      <Layout>
        <Component {...pageProps} />
      
        <SearchInput />
      </Layout>
  );
}

export default MyApp;
