import mainIcon from "../assets/mainIcon.svg";

function Header() {
  return (
    <header className="fixed top-0 h-12 w-full bg-white flex items-center pl-5 gap-3 shadow-lg z-10">
      <img src={mainIcon} />
      <h1 className="font-bold text-[#3D5F93]">LTO INFORMATION MANAGEMENT</h1>
    </header>
  );
}

export default Header;
