import { Link } from "react-router-dom";

function SidebarButton({ icon, text, active, path }) {
  return (
    <Link to={path}>
      <div
        className={`flex items-center gap-3 h-10 rounded-sm px-3 ${active ? "bg-[#E1E7F0]" : undefined}`}
      >
        <img src={icon} />
        <p className="text-[#495669]">{text}</p>
      </div>
    </Link>
  );
}

export default SidebarButton;
