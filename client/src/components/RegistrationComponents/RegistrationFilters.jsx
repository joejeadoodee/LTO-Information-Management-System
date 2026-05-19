import { useRef } from "react";

function RegistrationFilters({ setFilter }) {
  const formRef = useRef(null);

  // Helper to generate today's date based on local calendar timezone boundaries
  const getLocalTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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
      date: getLocalTodayString() 
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="reg-filter-form-row">
      <select 
        name="registration_status" 
        id="registration_status" 
        defaultValue=""
      >
        <option value="">All Registrations</option>
        <option value="active">Active</option>
        <option value="expired">Expired</option>
        <option value="suspended">Suspended</option>
      </select>

      <div className="reg-filter-date-group">
        <label htmlFor="date">As of Date</label>
        <input
          type="date"
          name="date"
          id="date"
          defaultValue={getLocalTodayString()} // FIXED: Now initializes to actual local today
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