import { useRef } from "react";

function RegistrationFilters({ setFilter }) {
  const formRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    setFilter(data);
  };

  const handleClearFilters = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
    setFilter({
      registration_status: "",
      date: new Date().toISOString().split("T")[0]
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="reg-filter-form-row">
      <select name="registration_status" id="registration_status" defaultValue="">
        <option value="">All Registrations</option>
        <option value="active">Active</option>
        <option value="expired">Expired</option>
        <option value="suspended">Suspended</option>
      </select>

      {/* MATCHED: Mimics the exact alignment sub-wrapper model as drivers page flex components */}
      <div className="reg-filter-date-group">
        <label htmlFor="date">As of Date</label>
        <input
          type="date"
          name="date"
          id="date"
          defaultValue={new Date().toISOString().split("T")[0]}
        />
      </div>

      <button className="apply-filters-btn" type="submit">
        Apply Filters
      </button>
      
      <button className="clear-filters-btn" type="button" onClick={handleClearFilters}>
        Clear
      </button>
    </form>
  );
}

export default RegistrationFilters;