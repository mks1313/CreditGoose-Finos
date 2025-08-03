exports.getReportByTimeframe = (req, res) => {
  const { timeframe } = req.body;

  if (!timeframe) {
    return res.status(400).json({ error: "Missing timeframe" });
  }

  let data;

  switch (timeframe) {
    case "monthly":
      data = {
        totalFunded: 125000,
        totalFees: 6000,
        averageTimeToFund: 22,
        monthlyData: [
          { month: "Jun", amount: 125000 }
        ],
        topMerchants: [
          { name: "Tech Solutions Inc", totalFunded: 45000, invoiceCount: 18, avgProcessingTime: 21 },
          { name: "Global Traders Ltd", totalFunded: 40000, invoiceCount: 15, avgProcessingTime: 23 },
          { name: "StartupX", totalFunded: 40000, invoiceCount: 10, avgProcessingTime: 25 }
        ],
        statusDistribution: { funded: 70, pending: 20, rejected: 10 },
      };
      break;

    case "quarterly":
      data = {
        totalFunded: 375000,
        totalFees: 18000,
        averageTimeToFund: 23,
        monthlyData: [
          { month: "Apr", amount: 100000 },
          { month: "May", amount: 125000 },
          { month: "Jun", amount: 150000 }
        ],
        topMerchants: [
          { name: "Tech Solutions Inc", totalFunded: 150000, invoiceCount: 40, avgProcessingTime: 22 },
          { name: "Global Traders Ltd", totalFunded: 125000, invoiceCount: 35, avgProcessingTime: 24 },
          { name: "Innovate Corp", totalFunded: 100000, invoiceCount: 30, avgProcessingTime: 25 }
        ],
        statusDistribution: { funded: 68, pending: 22, rejected: 10 },
      };
      break;

    case "yearly":
      data = {
        totalFunded: 1200000,
        totalFees: 60000,
        averageTimeToFund: 20,
        monthlyData: [
          { month: "Jan", amount: 95000 },
          { month: "Feb", amount: 105000 },
          { month: "Mar", amount: 125000 },
          { month: "Apr", amount: 150000 },
          { month: "May", amount: 175000 },
          { month: "Jun", amount: 200000 },
          { month: "Jul", amount: 120000 },
          { month: "Aug", amount: 130000 },
          { month: "Sep", amount: 140000 },
          { month: "Oct", amount: 150000 },
          { month: "Nov", amount: 160000 },
          { month: "Dec", amount: 170000 }
        ],
        topMerchants: [
          { name: "Global Traders Ltd", totalFunded: 500000, invoiceCount: 100, avgProcessingTime: 20 },
          { name: "Tech Solutions Inc", totalFunded: 450000, invoiceCount: 90, avgProcessingTime: 21 },
          { name: "Innovate Corp", totalFunded: 250000, invoiceCount: 50, avgProcessingTime: 22 }
        ],
        statusDistribution: { funded: 75, pending: 15, rejected: 10 },
      };
      break;

    default:
      return res.status(400).json({ error: "Invalid timeframe" });
  }

  res.json(data);
};