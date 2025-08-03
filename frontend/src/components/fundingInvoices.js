import React, { useState, useEffect } from "react";
import Header from "./header";

// Sub-components for better organization
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] flex items-center justify-center">
    <div className="text-center">
      <i className="fas fa-spinner fa-spin text-4xl text-[#3b82f6] mb-4"></i>
      <p className="text-[#475569] font-medium">Loading your invoices...</p>
    </div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="m-6 bg-[#fee2e2] text-[#dc2626] p-4 rounded-lg">
    {message}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="text-[#64748b] mb-4">
      <i className="fas fa-file-invoice text-4xl"></i>
    </div>
    <h3 className="text-lg font-medium text-[#1e293b]">No invoices found</h3>
    <p className="text-[#475569] mt-1">
      Connect your Square account to see your invoices
    </p>
  </div>
);

const ConfirmationModal = ({ invoice, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#059669] rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-check text-white text-2xl"></i>
        </div>
        <h3 className="text-2xl font-bold text-[#1e293b] mb-2">
          Financing Approved!
        </h3>
        <p className="text-[#475569] mb-6">
          Your invoice for {formatCurrency(invoice.amount)} has been approved
          for financing at {invoice.advance_rate}% advance rate.
        </p>
        <div className="space-y-4">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition duration-300"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
);

const InvoiceCard = ({ invoice, onClick }) => (
  <div
    className="bg-[#f8fafc] rounded-xl p-6 hover:shadow-lg transition duration-300 cursor-pointer border border-[#e2e8f0] hover:border-[#3b82f6]"
    onClick={onClick}
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="font-semibold text-[#1e293b]">{invoice.buyer_name}</h3>
        <p className="text-sm text-[#64748b]">
          Invoice #{invoice.square_invoice_id}
        </p>
      </div>
      <div className="bg-[#dbeafe] text-[#3b82f6] px-3 py-1 rounded-full text-sm font-medium">
        {invoice.status}
      </div>
    </div>

    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-[#475569]">Amount:</span>
        <span className="font-semibold text-[#1e293b]">
          {formatCurrency(invoice.amount)}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-[#475569]">Due Date:</span>
        <span className="text-[#1e293b]">{formatDate(invoice.due_date)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-[#475569]">Fee</span>
        <span className="text-[#1e293b]">{invoice.fee}%</span>
      </div>
      <div className="flex justify-between">
        <span className="text-[#475569]">Advance Rate:</span>
        <span className="text-[#1e293b]">{invoice.advance_rate}%</span>
      </div>
    </div>

    <button className="w-full mt-4 px-4 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition duration-300 flex items-center justify-center">
      <i className="fas fa-money-bill-wave mr-2"></i>
      Get Financing
    </button>
  </div>
);

// Utility functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const FundingInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/invoices/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch invoices: ${response.status}`);
        }

        const data = await response.json();
        setInvoices(data.invoices || []);
      } catch (err) {
        console.error("Failed to fetch invoices:", err);
        const mockInvoices = [
          {
            id: 1,
            buyer_name: "Demo Company A",
            square_invoice_id: "DEMO001",
            status: "pending",
            amount: 5000.0,
            fee: 2.5,
            due_date: "2025-03-15",
            advance_rate: 90,
          },
          {
            id: 2,
            buyer_name: "Demo Company B",
            square_invoice_id: "DEMO002",
            status: "approved",
            amount: 7500.0,
            fee: 3.0,
            due_date: "2025-03-20",
            advance_rate: 80,
          },
          {
            id: 3,
            buyer_name: "Demo Company C",
            square_invoice_id: "DEMO003",
            status: "pending",
            amount: 3000.0,
            fee: 3.5,
            due_date: "2025-03-25",
            advance_rate: 87,
          },
        ];
        setInvoices(mockInvoices);
        setError("Using demo data - couldn't connect to Square");
        // setError(err.message || "Could not load invoices. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleInvoiceSelect = (invoice) => {
    setSelectedInvoice(invoice);
    setShowConfirmation(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0]">
      <Header activePage="funding-invoices" className="mt-20" />

      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] p-6">
        {showConfirmation && selectedInvoice && (
          <ConfirmationModal
            invoice={selectedInvoice}
            onClose={() => setShowConfirmation(false)}
          />
        )}

        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-[#e2e8f0]">
              <h1 className="text-2xl font-bold text-[#1e293b]">
                Square Invoices
              </h1>
              <p className="text-[#475569] mt-1">
                Select an invoice to check financing options
              </p>
            </div>

            {error && <ErrorMessage message={error} />}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {invoices.map((invoice) => (
                <InvoiceCard
                  key={invoice.id}
                  invoice={invoice}
                  onClick={() => handleInvoiceSelect(invoice)}
                />
              ))}
            </div>

            {invoices.length === 0 && !error && <EmptyState />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundingInvoices;
