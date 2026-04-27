function ReportYearlyViolation() {
  return (
    <div className="bg-white flex flex-col p-5 h-70 justify-between">
      <div>
        <h3 className="font-bold text-2xl mb-5 text-[#293747]">
          Total Violations on Year
        </h3>
        <p className="text-[#64738A] font-semibold text-sm mb-1">YEAR</p>
        <input
          className="w-full bg-[#EDF4FF] text-[#5e6369] py-2 px-3 rounded-lg"
          type="number"
          id="year"
          name="year"
          min="1900"
          max="2099"
          step="1"
          defaultValue={new Date().getFullYear()}
          required
        />
      </div>
      <button className="button-behave bg-[#3F5F92]">Generate Report</button>
    </div>
  );
}

export default ReportYearlyViolation;
