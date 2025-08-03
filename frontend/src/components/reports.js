import { useEffect, useState } from "react";
import Header from "./header";

// Mocked report data
const mockReportData = {
  totalFunded: 1250000.0,
  totalFees: 75000.0,
  averageTimeToFund: 24,
  monthlyData: [
    { month: "Jan", amount: 95000 },
    { month: "Feb", amount: 105000 },
    { month: "Mar", amount: 125000 },
    { month: "Apr", amount: 150000 },
    { month: "May", amount: 175000 },
    { month: "Jun", amount: 200000 },
  ],
  topMerchants: [
    {
      name: "Tech Solutions Inc",
      totalFunded: 450000,
      invoiceCount: 45,
      avgProcessingTime: 22,
    },
    {
      name: "Global Traders Ltd",
      totalFunded: 350000,
      invoiceCount: 35,
      avgProcessingTime: 24,
    },
    {
      name: "Innovate Corp",
      totalFunded: 250000,
      invoiceCount: 25,
      avgProcessingTime: 26,
    },
    {
      name: "Digital Services Co",
      totalFunded: 200000,
      invoiceCount: 20,
      avgProcessingTime: 23,
    },
  ],
  statusDistribution: {
    funded: 65,
    pending: 20,
    rejected: 15,
  },
};

const ReportsPage = () => {
  const [timeframe, setTimeframe] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(mockReportData);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/report`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ timeframe }),
          
        });

        if (!response.ok) throw new Error("Failed to fetch report data");
        const data = await response.json();
        setReportData(data);
      } catch (err) {
        console.error(err);
        setReportData(mockReportData); // fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [timeframe]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0]">
      <Header activePage="reports" />

      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-montserrat text-[#1e293b] mb-4 md:mb-0">
            Funding Reports
          </h1>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <i className="fas fa-spinner fa-spin text-3xl text-[#3b82f6]"></i>
          </div>
        ) : (
          <>
            {error && (
              <div className="text-center text-[#dc2626] mb-4">{error}</div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  label: "Total Funded",
                  value: formatCurrency(reportData.totalFunded),
                  icon: "fa-dollar-sign",
                },
                {
                  label: "Total Fees",
                  value: formatCurrency(reportData.totalFees),
                  icon: "fa-percentage",
                },
                {
                  label: "Avg. Time to Fund",
                  value: `${reportData.averageTimeToFund} hrs`,
                  icon: "fa-clock",
                },
              ].map(({ label, value, icon }) => (
                <div key={label} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#475569] font-semibold">{label}</h3>
                    <i className={`fas ${icon} text-[#3b82f6]`}></i>
                  </div>
                  <p className="text-3xl font-bold text-[#1e293b]">{value}</p>
                </div>
              ))}
            </div>

            {/* Top Merchants Table */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-[#1e293b] mb-6">
                Top Merchants by Volume
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#e2e8f0]">
                      {[
                        "Merchant",
                        "Total Funded",
                        "Invoice Count",
                        "Avg. Processing Time",
                      ].map((header) => (
                        <th
                          key={header}
                          className="text-left py-4 px-4 text-[#475569] font-semibold"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.topMerchants.map((m, i) => (
                      <tr
                        key={i}
                        className="border-b border-[#e2e8f0] hover:bg-[#f8fafc]"
                      >
                        <td className="py-4 px-4">{m.name}</td>
                        <td className="py-4 px-4">
                          {formatCurrency(m.totalFunded)}
                        </td>
                        <td className="py-4 px-4">{m.invoiceCount}</td>
                        <td className="py-4 px-4">{m.avgProcessingTime} hrs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-[#1e293b] mb-6">
                Key Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: "fa-arrow-trend-up",
                    title: "Growth Trend",
                    text: "Month-over-month funding volume increased by 15%",
                    color: "text-[#059669]",
                  },
                  {
                    icon: "fa-clock",
                    title: "Processing Efficiency",
                    text: "Average processing time reduced by 2 hours",
                    color: "text-[#3b82f6]",
                  },
                ].map(({ icon, title, text, color }) => (
                  <div key={title} className="p-4 bg-[#f8fafc] rounded-lg">
                    <i className={`fas ${icon} ${color} mb-2`}></i>
                    <h4 className="font-semibold text-[#1e293b] mb-2">
                      {title}
                    </h4>
                    <p className="text-[#475569]">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
