function RegistrationExpired() {
  return (
    <div className="bg-white flex flex-col p-5 h-70 justify-between">
      <div>
        <h3 className="font-bold text-2xl mb-5 text-[#293747]">
          Vehicle Registration Expired By
        </h3>
        <p className="text-[#64738A] font-semibold text-sm mb-1">Date</p>
        <input
          className="w-full bg-[#EDF4FF] text-[#5e6369] py-2 px-0.5 rounded-lg"
          type="date"
          defaultValue={new Date().toISOString().split("T")[0]}
          required
        />
      </div>
      <button className="button-behave bg-[#3F5F92]">Generate Report</button>
    </div>
  );
}

export default RegistrationExpired;
