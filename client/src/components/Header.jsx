import mainIcon from "../assets/mainIcon.svg";

function Header() {
  return (
    <header className="fixed h-12 w-full bg-white flex items-center pl-5 gap-3 shadow-lg z-10">
      <img src={mainIcon} />
      <h1 className="font-bold text-[#233D89]">LTO INFORMATION MANAGEMENT</h1>
    </header>
  );
}

export default Header;
