function ReportLocationViolation() {
  return (
    <div className="bg-white flex flex-col p-5 h-70 justify-between">
      <div>
        <h3 className="font-bold text-2xl mb-5 text-[#293747]">
          Violations on Location
        </h3>
        <p className="text-[#64738A] font-semibold text-sm mb-1">LOCATION</p>
        <input
          className="w-full bg-[#EDF4FF] text-[#5e6369] py-2 px-3 rounded-lg"
          type="text"
          id="location"
          name="location"
          placeholder="Enter a city or a region"
          required
        />
      </div>
      <button className="button-behave bg-[#3F5F92]">Generate Report</button>
    </div>
  );
}

export default ReportLocationViolation;
