import Card from "../components/card/card";
import SearchInput from "../components/searchInput/searchInput";
import Layout from "../layouts/layout";
import "../styles/globals.scss";
function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
      <SearchInput />
      <Card />
    </Layout>
  );
}

export default MyApp;
