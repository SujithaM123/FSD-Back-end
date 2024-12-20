import React, { useState } from "react";
import axios from "axios";

// Predefined Department Options
const departments = ["HR", "Engineering", "Marketing", "Sales", "Finance"];

const EmployeeForm = () => {
  const [form, setForm] = useState({
    name: "",
    employeeId: "",
    email: "",
    phone: "",
    department: "",
    dateOfJoining: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Validate the form
  const validateForm = () => {
    const newErrors = {};

    if (!form.name) newErrors.name = "Name is required.";
    if (!form.employeeId) newErrors.employeeId = "Employee ID is required.";
    if (form.employeeId && form.employeeId.length > 10)
      newErrors.employeeId = "Employee ID must be less than 10 characters.";
    if (!/^[A-Za-z0-9]+$/.test(form.employeeId))
      newErrors.employeeId = "Employee ID must be alphanumeric.";
    if (!form.email) newErrors.email = "Email is required.";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email format is invalid.";
    if (!form.phone) newErrors.phone = "Phone number is required.";
    if (form.phone && !/^\d{10}$/.test(form.phone))
      newErrors.phone = "Phone number must be 10 digits.";
    if (!form.department) newErrors.department = "Department is required.";
    if (!form.dateOfJoining) newErrors.dateOfJoining = "Date of joining is required.";
    else if (new Date(form.dateOfJoining) > new Date())
      newErrors.dateOfJoining = "Date of joining cannot be a future date.";
    if (!form.role) newErrors.role = "Role is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const res = await axios.post("http://localhost:5000/api/employees", form);
        setSuccessMessage("Employee added successfully!");
        setForm({
          name: "",
          employeeId: "",
          email: "",
          phone: "",
          department: "",
          dateOfJoining: "",
          role: "",
        });
        setErrors({});
      } catch (err) {
        setApiError(err.response?.data?.message || "Error submitting form.");
      }
    }
  };

  return (
    <div className="employee-form">
      <form onSubmit={handleSubmit}>
        <h1>Add Employee</h1>

        {/* Success and Error Messages */}
        {successMessage && <p className="success-message">{successMessage}</p>}
        {apiError && <p className="api-error-message">{apiError}</p>}

        {/* Name Field */}
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={errors.name ? "input-error" : "input"}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        {/* Employee ID Field */}
        <div className="form-group">
          <label htmlFor="employeeId">Employee ID:</label>
          <input
            type="text"
            id="employeeId"
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            className={errors.employeeId ? "input-error" : "input"}
          />
          {errors.employeeId && <p className="error-text">{errors.employeeId}</p>}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : "input"}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        {/* Phone Field */}
        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={errors.phone ? "input-error" : "input"}
          />
          {errors.phone && <p className="error-text">{errors.phone}</p>}
        </div>

        {/* Department Field */}
        <div className="form-group">
          <label htmlFor="department">Department:</label>
          <select
            id="department"
            name="department"
            value={form.department}
            onChange={handleChange}
            className={errors.department ? "input-error" : "input"}
          >
            <option value="">Select Department</option>
            {departments.map((dept, idx) => (
              <option key={idx} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && <p className="error-text">{errors.department}</p>}
        </div>

        {/* Date of Joining Field */}
        <div className="form-group">
          <label htmlFor="dateOfJoining">Date of Joining:</label>
          <input
            type="date"
            id="dateOfJoining"
            name="dateOfJoining"
            value={form.dateOfJoining}
            onChange={handleChange}
            className={errors.dateOfJoining ? "input-error" : "input"}
          />
          {errors.dateOfJoining && <p className="error-text">{errors.dateOfJoining}</p>}
        </div>

        {/* Role Field */}
        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <input
            type="text"
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            className={errors.role ? "input-error" : "input"}
          />
          {errors.role && <p className="error-text">{errors.role}</p>}
        </div>

        {/* Submit and Reset Buttons */}
        <div className="button-group">
          <button type="submit" className="submit-button">Submit</button>
          <button
            type="button"
            onClick={() =>
              setForm({
                name: "",
                employeeId: "",
                email: "",
                phone: "",
                department: "",
                dateOfJoining: "",
                role: "",
              })
            }
            className="reset-button"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
