function Modal({ children, setShow }) {
  return (
    <div className="bg-[rgba(0,0,0,0.5)] fixed w-dvw h-dvh z-20 top-0 left-0 px-20 py-10">
      <div className="bg-white w-full h-full p-10 overflow-hidden">
        <button
          className="bg-[#3F5F92] text-white px-3 rounded-sm mb-5"
          onClick={() => setShow(false)}
        >
          Exit
        </button>
        <div className="overflow-y-scroll w-full h-full">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
