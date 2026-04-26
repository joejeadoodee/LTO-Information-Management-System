function DriverFilters({ setFilter }) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    setFilter(data);
  };

  return (
    <form
      className="flex gap-5 mb-5 justify-start w-full"
      onSubmit={handleSubmit}
    >
      <select name="license_status" id="license_status">
        <option value="" selected disabled hidden>
          License Status
        </option>
        <option value="Valid">Valid</option>
        <option value="Suspended">Suspended</option>
        <option value="Expired">Expired</option>
        <option value="Revoked">Revoked</option>
      </select>
      <select name="license_type" id="license_type">
        <option value="" selected disabled hidden>
          License Type
        </option>
        <option value="Student Permit">Student Permit</option>
        <option value="Professional">Professional</option>
        <option value="Non-Professional">Non-Professional</option>
      </select>
      <select name="sex" id="sex">
        <option value="" selected disabled hidden>
          Sex
        </option>
        <option value="M">Male</option>
        <option value="F">Female</option>
      </select>
      <div className="flex flex-row! items-center m-0! gap-1">
        <label htmlFor="age_min">Age Range</label>
        <input
          className="w-20 pr-0!"
          type="number"
          name="age_min"
          id="age_min"
          placeholder="min"
        />
        -
        <input
          className="w-20 pr-0!"
          type="number"
          name="age_max"
          id="age_max"
          placeholder="max"
        />
      </div>
      <button
        className="bg-[#3F5F92] text-white px-5 rounded-sm button-behave"
        type="submit"
      >
        Apply Filters
      </button>
    </form>
  );
}

export default DriverFilters;
