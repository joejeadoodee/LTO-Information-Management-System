function ReportDriverViolation({ drivers }) {
  const options = drivers.map((driver) => (
    <option value={driver.driver_id} key={driver.driver_id}>
      {driver.full_name}
    </option>
  ));

  return (
    <div className="bg-white flex flex-col p-5 h-70 justify-between">
      <div>
        <h3 className="font-bold text-2xl mb-5 text-[#293747]">
          Driver Violations
        </h3>
        <p className="text-[#64738A] font-semibold text-sm mb-1">DRIVER</p>
        <select
          className="w-full bg-[#EDF4FF] text-[#5e6369] py-2 px-0.5 rounded-lg mb-3"
          name="owner"
          id="owner"
        >
          <option value="" selected disabled hidden>
            Select driver
          </option>
          {options}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[#64738A] font-semibold text-sm mb-1">FROM</p>
            <input
              className="w-full bg-[#EDF4FF] text-[#5e6369] py-2 px-0.5 rounded-lg"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div>
            <p className="text-[#64738A] font-semibold text-sm mb-1">TO</p>
            <input
              className="w-full bg-[#EDF4FF] text-[#5e6369] py-2 px-0.5 rounded-lg"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
        </div>
      </div>
      <button className="button-behave bg-[#3F5F92]">Generate Report</button>
    </div>
  );
}

export default ReportDriverViolation;
