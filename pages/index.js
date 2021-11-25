import Card from "../components/card/card";
import SearchInput from "../components/searchInput/searchInput";
import SalaryRange from "../components/salaryRange/salaryRange";
export default function Home() {
  return (
    <>
      <div className="container">
      <SearchInput />
      <SalaryRange />
      <Card />
      </div>
    </>
  );
}