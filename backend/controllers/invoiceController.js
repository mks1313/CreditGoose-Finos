const { exec } = require('child_process');
exports.connectSquare = (req, res) => {
  res.json({ message: "Connected to Square." });
};

exports.getInvoices = (req, res) => {
  res.json({
    invoices: [
      {
        id: "inv001",
        merchant_id: "mch123",
        amount: 2500.75,
        fee: 2.5,
        issue_date: "2024-12-01T00:00:00Z",
        due_date: "2025-01-01T00:00:00Z",
        status: "approved",
        fee: 25.75
      },
      {
        id: "inv002",
        merchant_id: "mch456",
        amount: 1800.00,
        fee: 3.0,
        issue_date: "2024-12-15T00:00:00Z",
        due_date: "2025-01-15T00:00:00Z",
        status: "pending",
        fee: 18.00
      },
      {
        id: "inv003",
        merchant_id: "mch789",
        amount: 3000.50,
        fee: 3.5,
        issue_date: "2025-01-01T00:00:00Z",
        due_date: "2025-02-01T00:00:00Z",
        status: "funded"
      },
      {
        id: "inv004",
        merchant_id: "mch001",
        amount: 3000.50,
        fee: 3.5,
        issue_date: "2025-01-01T00:00:00Z",
        due_date: "2025-02-01T00:00:00Z",
        status: "funded"
      },
      {
        id: "inv005",
        merchant_id: "mch002",
        amount: 3000.50,
        fee: 2.5,
        issue_date: "2025-01-01T00:00:00Z",
        due_date: "2025-02-01T00:00:00Z",
        status: "funded"
      },
    ],
    stats: {
      total_count: 3,
      total_amount: 7301.25,
      total_funded_amount: 3000.50,
      total_fees: 73.75
    }
  });
};

exports.fundInvoices = (req, res) => {
  // lógica mock
  res.json({ message: "Funding requested." });
};

exports.enableAutoFunding = (req, res) => {
  res.json({ message: "Auto-funding enabled." });
};

exports.getMonthlyReport = (req, res) => {
  res.json({ totalFunded: 25000, totalFees: 850 });
};

function extractGooseResponse(gooseOutput) {
  if (!gooseOutput || typeof gooseOutput !== 'string') {
    return null;
  }

  // Split by lines and find the actual response
  const lines = gooseOutput.split('\n');

  // Look for the line that contains the actual response (after ANSI color codes)
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) continue;

    // Remove ANSI color codes (like [38;2;222;222;222m and [0m)
    // Remove ANSI escape sequences and ESC characters
    let cleanLine = line
      .replace(/\x1b\[[0-9;]*m/g, '') // Remove ANSI color codes (ESC[...m)
      .replace(/\x1b/g, '') // Remove standalone ESC characters
      .replace(/\u001b\[[0-9;]*m/g, '') // Alternative ANSI format
      .replace(/\u001b/g, '') // Alternative ESC format
      .trim();

    // Skip system messages (lines containing session info, logging, working directory)
    if (cleanLine.includes('starting session') ||
        cleanLine.includes('logging to') ||
        cleanLine.includes('working directory') ||
        cleanLine.includes('provider:') ||
        cleanLine.includes('model:')) {
      continue;
    }

    // Return the first non-system message we find
    if (cleanLine) {
      return cleanLine;
    }
  }

  return null;
}

function get_description(buyer_name) {
  let buyers = [
    {
      "buyer_name": "India SME Technology Services Ltd",
      "description": "Private limited under liquidation with authorized capital ₹10 crore and paid-up ₹4.4 crore. Last audited in FY 2016. No public loan data. Operates techsmall.com; registered with MCA India. Limited social media presence and customer reviews. Active since ~2005 with low LinkedIn activity. Governance issues noted; board includes CEO Ravi Tyagi. Not found in payment registries. No recent media red flags."
    },
    {
      "buyer_name": "All India SME Precious Metals Refiners Association",
      "description": "Authorized and paid-up capital ₹10,000; FY 2023 revenue up 280.88%, profit down 529.34%, net worth declined 125.09%. No employees as of April 2024. No website but active LinkedIn (~10,000 followers). Minimal media coverage. Directors include Vidit Garg, Deepak Gupta, Siddharth Gogia, Ramkishan. Compliant with filings and no ongoing litigations."
    },
    {
      "buyer_name": "Apple Inc.",
      "description": "Strong audited financials, consistent profits, and solid net worth. Excellent payment discipline and credit data. Massive digital presence and billions of users. Positive media sentiment with occasional controversies. Strong governance and no major litigations."
    },
    {
      "buyer_name": "Theranos, Inc.",
      "description": "Historical private startup with limited financial data. Initially had strong digital presence, later marred by severe negative media after fraud scandals. Subject to legal actions and governance failures."
    },
    {
      "buyer_name": "Patagonia, Inc.",
      "description": "Over 40 years in operation with strong financials and solid revenue. Reliable payment history and credit standing. Strong web and social media presence. Widely praised for sustainability. Good governance with no major legal issues."
    },
    {
      "buyer_name": "Oatly Group AB",
      "description": "Public financial disclosures with growth-stage metrics and modest profits. Mostly reliable payment record. Active in brand-driven digital channels. Social sentiment generally positive with some sustainability criticisms. No notable legal concerns."
    },
    {
      "buyer_name": "Thermo Fisher Scientific India Pvt Ltd",
      "description": "Private subsidiary with stable revenue and positive margins. Good payment discipline. Moderate digital footprint due to B2B focus. Sentiment ranges from neutral to positive. Legally compliant with no red flags."
    }
  ];

  const match = buyers.find(buyer => buyer.buyer_name === buyer_name);
  return match ? match.description : null;
}


// Updated runGoose function with extraction
exports.submitInvoice = (req, res) => {

  console.log(`Received: ${req.body.buyer_name}`);

  let company_info = get_description(req.body.buyer_name)

  console.log(`For company '${req.body.buyer_name}' got info ${company_info}`)

  let PROMPT = `Score this company using the following methodology. If some data is unavailable, ignore it—do not attempt to access external tools or extensions. Just return a one-line response with the final score (1–1000) and outcome (Auto-approve, Manual, or Decline).

Company Risk Scoring Methodology
Score a company from 1–1000 and return an outcome: Auto-approve, Manual, or Decline.

Step 1: Initial Qualification Filter (Fatal Checks)
Reject if any of the following:

Country not on whitelist (ISO + Open Data Index)

Industry is blacklisted (e.g., weapons, crypto – based on NAICS/SIC)

Company age < 12 months (from registry/incorporation date)

Matches on AML/Sanctions/PEP lists (OFAC, EU, UN)

Serious adverse media or legal flags (fraud, insolvency – via GDELT/court APIs)

Step 2: Bucket Assignment (Entity Type & Data Visibility)
Assign one of 3 buckets based on available information:

A: Public/Data-Rich – Listed or large private with full audited accounts and bureau file

B: Private/Moderate – Private with ≥2 years of financials or bureau file, limited public data

C: Private/Thin-File – Micro/startup or stale/missing statements

Step 3: Data Modules by Bucket
Gather relevant signals:

A: Financial ratios, bureau data, sentiment scan

B: + Digital footprint, social presence, paid ads, reviews, director checks

C: All of B, with deeper web and behavioral data

Step 4: Scoring by Risk Pillars (0–1000 Total)
Each pillar is scored 0–100, then weighted by bucket:

Financial Strength: A=60%, B=40%, C=20%

Payment Discipline: A=25%, B=25%, C=20%

Digital Legitimacy: A=5%, B=15%, C=25%

Social/Media Sentiment: A=5%, B=10%, C=15%

Governance/Legal: A=5%, B=10%, C=20%

Step 5: Final Outcome

Score ≥700 → Auto-approve

Score 550–699 → Manual

Score <550 → Decline

Step 6: Data-Quality Guardrails
Only score if data completeness ≥95% and data age ≤12 months; else fallback to manual review.

Step 7: Post-Funding Monitoring
Re-run weekly non-financial checks for Bucket B/C. Trigger alerts if score drops ≥50 points.

The company info:

${company_info}

Response Format:
One line only — Final Score: [###], Outcome: [Auto-approve / Manual / Decline]

Respond strictly just in one line without newline characters.`;

  console.log('Calling Goose...');

  if (!company_info) {
    return res.status(400).json({ error: "No active prompts found" });
  }

  const gooseCliCommand = `goose run -t "${PROMPT}"`;

  const goosePromise = new Promise((resolve, reject) => {
    exec(gooseCliCommand, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        try {
            const parsedGooseResponse = JSON.parse(stdout);
            resolve(parsedGooseResponse);
        } catch (parseError) {
            resolve(stdout);
        }
      }
    });
  });

  Promise.all([goosePromise])
    .then(([goosePromptResult]) => {
      console.debug("Goose result:", goosePromptResult);

      // Extract the actual response from Goose output
      const extractedResponse = extractGooseResponse(goosePromptResult);

      console.log(`Goose response: ${extractedResponse}`);

      res.json(
        {
          invoice: {
            id: req.body.id,
            merchant_id: req.body.merchant_id,
            buyer_name: req.body.buyer_name,
            amount: req.body.amount,
            due_date: req.body.due_date,
            issue_date: req.body.issue_date,
            status: "approved",  // TODO: statuses
            credit_score: extractedResponse,
            advance_rate: 85,
            funded_amount: 8500.00
          }
        } || null,
      );
    })
    .catch(errors => {
      console.error("The promise rejected:", errors);
      res.status(500).json({ error: "An error occurred during Goose execution." });
    });
};

exports.fundInvoiceById = (req, res) => {
  const invoiceId = req.params.id;

  const mockInvoices = [
    {
      id: "inv001",
      merchant_id: "mch123",
      amount: 2500.75,
      issue_date: "2024-12-01T00:00:00Z",
      due_date: "2025-01-01T00:00:00Z",
      status: "approved",
      fee: 25.75
    },
    {
      id: "inv002",
      merchant_id: "mch456",
      amount: 1800.00,
      issue_date: "2024-12-15T00:00:00Z",
      due_date: "2025-01-15T00:00:00Z",
      status: "pending",
      fee: 18.00
    },
    {
      id: "inv003",
      merchant_id: "mch789",
      amount: 3000.50,
      issue_date: "2025-01-01T00:00:00Z",
      due_date: "2025-02-01T00:00:00Z",
      status: "funded",
      fee: 3.5
    },
    {
      id: "inv004",
      merchant_id: "mch001",
      amount: 3000.50,
      issue_date: "2025-01-01T00:00:00Z",
      due_date: "2025-02-01T00:00:00Z",
      status: "funded",
      fee: 3.5
    },
    {
      id: "inv005",
      merchant_id: "mch002",
      amount: 3000.50,
      issue_date: "2025-01-01T00:00:00Z",
      due_date: "2025-02-01T00:00:00Z",
      status: "funded",
      fee: 2.5
    }
  ];

  const invoice = mockInvoices.find((inv) => inv.id === invoiceId);

  if (!invoice) {
    return res.status(404).json({ error: "Invoice not found" });
  }

  if (invoice.status !== "approved") {
  return res.json({
    status: "rejected",
    message: `This invoice cannot be financed because it is marked as '${invoice.status}'.`,
  });
}

  const advanceRate = 85;
  const fundedAmount = (invoice.amount * advanceRate) / 100;

  res.json({
    status: "approved",
    message: "Financing approved",
    invoice: {
      ...invoice,
      status: "funded",
      advance_rate: advanceRate,
      funded_amount: fundedAmount.toFixed(2),
    },
  });
};