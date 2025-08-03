import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Header from "./header";

const SubmitInvoice = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    merchant_id: "",
    buyer_name: "",
    amount: "",
    due_date: "",
    issue_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submittedInvoice, setSubmittedInvoice] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/invoices/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

       const data = await response.json();

       if (!response.ok) {
         throw new Error(data.error || "Failed to submit invoice");
       }

      setSubmittedInvoice(data.invoice);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to submit invoice. Please try again.");
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      merchant_id: "",
      buyer_name: "",
      amount: "",
      due_date: "",
      issue_date: "",
    });
    setSuccess(false);
    setSubmittedInvoice(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const LoadingSpinner = () => (
    <span className="flex items-center justify-center">
      <svg
        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      Analyzing Invoice...
    </span>
  );

  const ResultCard = ({ invoice }) => (
    <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
      <h3 className="font-semibold text-[#1e293b] mb-4">Analysis Results:</h3>
      <div className="space-y-3">
        <div>
          <span className="text-gray-600">Credit Score:</span>
          <span className="ml-2 font-semibold">{invoice.credit_score}</span>
        </div>
        {invoice.status === "approved" && (
          <>
            <div>
              <span className="text-gray-600">Advance Rate:</span>
              <span className="ml-2 font-semibold">
                {invoice.advance_rate}%
              </span>
            </div>
            <div>
              <span className="text-gray-600">Funded Amount:</span>
              <span className="ml-2 font-semibold">
                {formatCurrency(invoice.funded_amount)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0]">
      <Header activePage="submit-invoice" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold font-montserrat text-[#1e293b] mb-6 text-center">
            Submit New Invoice
          </h1>

          {success ? (
            <div className="text-center">
              <div
                className={`mb-6 ${
                  submittedInvoice.status === "approved"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <div className="text-4xl mb-2">
                  {submittedInvoice.status === "approved" ? "✓" : "✗"}
                </div>
                <p className="mt-2 text-lg font-semibold">
                  {submittedInvoice.status === "approved"
                    ? "Invoice Approved!"
                    : "Invoice Rejected"}
                </p>
              </div>

              <ResultCard invoice={submittedInvoice} />

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={resetForm}
                  className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
                >
                  Submit Another Invoice
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <FormField
                  label="Merchant ID"
                  name="merchant_id"
                  value={formData.merchant_id}
                  onChange={handleChange}
                  required
                />

                <FormField
                  label="Buyer Name"
                  name="buyer_name"
                  value={formData.buyer_name}
                  onChange={handleChange}
                  required
                />

                <FormField
                  label="Amount"
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />

                <FormField
                  label="Issue Date"
                  name="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={handleChange}
                  required
                />

                <FormField
                  label="Due Date"
                  name="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={handleChange}
                  required
                />

                {error && <div className="text-red-600 text-sm">{error}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 disabled:opacity-50"
                >
                  {loading ? <LoadingSpinner /> : "Submit Invoice"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  min,
  step,
}) => (
  <div>
    <label className="block text-gray-600 font-semibold mb-2">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      name={name}
      required={required}
      min={min}
      step={step}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  min: PropTypes.string,
  step: PropTypes.string,
};

export default SubmitInvoice;
