import driverIcon from "../assets/driverIcon.svg";
import vehicleIcon from "../assets/vehicleIcon.svg";
import registrationIcon from "../assets/registrationIcon.svg";
import violationIcon from "../assets/violationIcon.svg";
import reportsIcon from "../assets/reportsIcon.svg";
import SidebarButton from "./SidebarButton";

function Sidebar({ page }) {
  return (
    <aside className="w-2xs bg-white fixed h-[calc(100dvh-48px)] p-5 top-12 z-0">
      <SidebarButton
        icon={driverIcon}
        text="Driver Management"
        active={page === "drivers"}
        path="/drivers"
      />
      <SidebarButton
        icon={vehicleIcon}
        text="Vehicle Management"
        active={page === "vehicles"}
        path="/vehicles"
      />
      <SidebarButton
        icon={registrationIcon}
        text="Registration Management"
        active={page === "registrations"}
        path="/registrations"
      />
      <SidebarButton
        icon={violationIcon}
        text="Traffic Violations"
        active={page === "violations"}
        path="/violations"
      />
      <SidebarButton
        icon={reportsIcon}
        text="Reports Center"
        active={page === "reports"}
        path="/reports"
      />
    </aside>
  );
}

export default Sidebar;
