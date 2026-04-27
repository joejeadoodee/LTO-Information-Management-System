import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";

function VehiclesPage() {
  return (
    <>
      <Header />
      <Sidebar page="vehicles" />
      <main className="main">{/*WRITE HTML HERE*/}</main>
    </>
  );
}

export default VehiclesPage;
