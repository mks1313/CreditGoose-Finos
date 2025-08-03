import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Header from "./header";

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({
    total_count: 0,
    total_amount: 0,
    total_funded_amount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const navigate = useNavigate();

  const fetchInvoices = async (status = "") => {
    setLoading(true);
    setError(null);
    try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/invoices/invoices`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch invoices");
        }

        const data = await response.json();
        setInvoices(data.invoices);
        setStats(data.stats);

      const filtered = status
        ? data.invoices.filter((inv) => inv.status === status)
        : data.invoices;

      setInvoices(filtered);
      setStats(data.stats);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(selectedStatus);
  }, [selectedStatus]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleViewInvoice = (invoiceId) => {
    navigate(`/invoice/${invoiceId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0]">
      <Header activePage="dashboard" />

      {showConfirmation && selectedInvoice && (
        <ConfirmationModal
          invoice={selectedInvoice}
          onClose={() => setShowConfirmation(false)}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold font-montserrat text-[#1e293b] mb-8">
          Invoice Dashboard
        </h1>

        <StatsCards stats={stats} formatCurrency={formatCurrency} />

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#1e293b] mb-4 md:mb-0">
              Invoice List
            </h2>
            <StatusFilter
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />
          </div>

          <InvoiceTable
            loading={loading}
            error={error}
            invoices={invoices}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            onViewInvoice={handleViewInvoice}
            setSelectedInvoice={setSelectedInvoice}
            setShowConfirmation={setShowConfirmation}
          />
        </div>
      </div>
    </div>
  );
};

const StatsCards = ({ stats, formatCurrency }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <StatCard title="Total Invoices" value={stats.total_count} />
    <StatCard title="Total Amount" value={formatCurrency(stats.total_amount)} />
    <StatCard
      title="Total Funded"
      value={formatCurrency(stats.total_funded_amount)}
    />
  </div>
);

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-[#475569] text-sm font-semibold mb-2">{title}</h3>
    <p className="text-2xl font-bold text-[#1e293b]">{value}</p>
  </div>
);

const StatusFilter = ({ selectedStatus, onStatusChange }) => (
  <select
    value={selectedStatus}
    onChange={(e) => onStatusChange(e.target.value)}
    className="px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
  >
    <option value="">All Statuses</option>
    <option value="pending">Pending</option>
    <option value="approved">Approved</option>
    <option value="funded">Funded</option>
    <option value="rejected">Rejected</option>
  </select>
);

const InvoiceTable = ({
  loading,
  error,
  invoices,
  formatCurrency,
  formatDate,
  onViewInvoice,
  setSelectedInvoice,
  setShowConfirmation,
}) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (invoices.length === 0) {
    return <NoInvoicesMessage />;
  }

 const handleInvoiceSelect = async (invoice) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/invoices/fund/${invoice.id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();

    if (data.status === "rejected") {
      setSelectedInvoice({
        ...invoice,
        rejectionReason: data.message,
        rejected: true
      });
      setShowConfirmation(true);
      return;
    }

    if (!response.ok) {
      throw new Error(data.message || "Funding failed");
    }

    setSelectedInvoice(data.invoice);
    setShowConfirmation(true);
  } catch (err) {
    console.error("Funding error:", err);
    alert(`Error: ${err.message}`);
  }
};

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#e2e8f0]">
            <TableHeader>ID</TableHeader>
            <TableHeader>Merchant</TableHeader>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Issue Date</TableHeader>
            <TableHeader>Due Date</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Fee</TableHeader>
            <TableHeader>Actions</TableHeader>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <InvoiceRow
              key={invoice.id}
              handleInvoiceSelect={handleInvoiceSelect}
              invoice={invoice}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              onViewInvoice={onViewInvoice}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableHeader = ({ children }) => (
  <th className="text-left py-4 px-4 text-[#475569] font-semibold">
    {children}
  </th>
);

const InvoiceRow = ({
  invoice,
  formatCurrency,
  formatDate,
  onViewInvoice,
  handleInvoiceSelect,
}) => (
  <tr className="border-b border-[#e2e8f0] hover:bg-[#f8fafc]">
    <td className="py-4 px-4">{invoice.id}</td>
    <td className="py-4 px-4">{invoice.merchant_id}</td>
    <td className="py-4 px-4">{formatCurrency(invoice.amount)}</td>
    <td className="py-4 px-4">{formatDate(invoice.issue_date)}</td>
    <td className="py-4 px-4">{formatDate(invoice.due_date)}</td>
    <td className="py-4 px-4">
      <StatusBadge status={invoice.status} />
    </td>
    <td className="py-4 px-4">{invoice.fee}</td>

    <td className="py-4 px-4">
      <button
        // TODO: Maxim
        onClick={() => handleInvoiceSelect(invoice)}
        className="w-full mt-4 px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition duration-300 flex items-center justify-center"
      >
        <i className="fas fa-money-bill-wave mr-2"></i>
        Get Financing
      </button>
    </td>
  </tr>
);

const StatusBadge = ({ status }) => {
  const statusClasses = {
    approved: "bg-[#059669] text-white",
    rejected: "bg-[#dc2626] text-white",
    funded: "bg-[#3b82f6] text-white",
    pending: "bg-[#f59e0b] text-white",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm ${
        statusClasses[status] || "bg-gray-500 text-white"
      }`}
    >
      {status}
    </span>
  );
};

const ViewButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-[#3b82f6] hover:text-[#2563eb]"
    aria-label="View invoice"
  >
    <i className="fas fa-eye"></i>
  </button>
);

const LoadingSpinner = () => (
  <div className="text-center py-8">
    <i className="fas fa-spinner fa-spin text-2xl text-[#3b82f6]"></i>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="text-[#dc2626] text-center py-8">{message}</div>
);

const NoInvoicesMessage = () => (
  <div className="text-center py-8 text-[#475569]">No invoices found</div>
);

// PropTypes for type checking
StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

ViewButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

InvoiceRow.propTypes = {
  invoice: PropTypes.object.isRequired,
  formatCurrency: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  fee: PropTypes.string,
  onViewInvoice: PropTypes.func.isRequired,
};

const ConfirmationModal = ({ invoice, onClose }) => {
  const isRejected = invoice?.rejected;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto">
        <div className="text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isRejected ? "bg-[#f59e0b]" : "bg-[#059669]"
            }`}
          >
            <i
              className={`fas ${
                isRejected ? "fa-times" : "fa-check"
              } text-white text-2xl`}
            ></i>
          </div>
          <h3 className="text-2xl font-bold text-[#1e293b] mb-2">
            {isRejected ? "Financing Pending" : "Financing Approved!"}
          </h3>
          <p className="text-[#475569] mb-6">
            {isRejected ? (
              <span>{invoice.rejectionReason}</span>
            ) : (
              <span>
                Your invoice for ${invoice.amount} has been approved for
                financing at {invoice.advance_rate}% advance rate.
              </span>
            )}
          </p>
          <div className="space-y-4">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg transition duration-300"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
