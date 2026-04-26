import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";

function ReportsPage() {
  return (
    <>
      <Header />
      <Sidebar page="reports" />
      <main className="grid">
        <div className="bg-white">
          <h3>Owned Vehicles by</h3>
        </div>
      </main>
    </>
  );
}

export default ReportsPage;
