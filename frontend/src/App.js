import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import SubmitInvoice from "./components/submitInvoice";
import Dashboard from "./components/dashboard";
import "./App.css";
import Header from "./components/header";
import ReportsPage from "./components/reports";
import AutoFundingSettings from "./components/autoFunding";
import Admin from "./components/admin/admin";
import Scoring from "./components/admin/scoring";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/submit-invoice" element={<SubmitInvoice />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/header" element={<Header />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/scoring" element={<Scoring />} />
        <Route
          path="/auto-funding-settings"
          element={<AutoFundingSettings />}
        />
      </Routes>
    </Router>
  );
};

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0]">
      <Header activePage="home" />
      <main>
        <HeroSection navigate={navigate} />
        <FeaturesSection />
        <StatsSection />
        <CTASection navigate={navigate} />
      </main>
      <Footer />
    </div>
  );
};

const HeroSection = ({ navigate }) => (
  <section className="container mx-auto px-4 py-16 md:py-24">
    <div className="text-center max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold font-montserrat text-[#1e293b] mb-6">
        Transform Your Invoices Into Instant Capital
      </h1>
      <p className="text-xl text-[#475569] font-roboto mb-8">
        AI-powered invoice financing that helps businesses grow with quick,
        flexible funding solutions
      </p>
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <Button onClick={() => navigate("/submit-invoice")} variant="primary">
          Get Started Now
        </Button>
        <Button onClick={() => navigate("/dashboard")} variant="secondary">
          View Dashboard
        </Button>
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section className="container mx-auto px-4 py-16">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <FeatureCard
        icon="bolt"
        title="Lightning Fast Approval"
        description="Get decisions within minutes using our advanced AI analysis"
      />
      <FeatureCard
        icon="chart-line"
        title="Competitive Rates"
        description="Enjoy industry-leading advance rates up to 90% of invoice value"
      />
      <FeatureCard
        icon="shield-alt"
        title="Secure & Reliable"
        description="Bank-grade security protecting your sensitive financial data"
      />
    </div>
  </section>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg text-center">
    <i className={`fas fa-${icon} text-4xl text-[#3b82f6] mb-4`}></i>
    <h3 className="text-xl font-semibold font-montserrat text-[#1e293b] mb-3">
      {title}
    </h3>
    <p className="text-[#475569]">{description}</p>
  </div>
);

const StatsSection = () => (
  <section className="bg-[#1e293b] text-white py-16">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">
          Trusted by Growing Businesses
        </h2>
        <p className="text-xl text-[#94a3b8]">
          Join thousands of businesses using CreditGoose for their financing
          needs
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        <StatItem value="$100M+" label="Invoices Funded" />
        <StatItem value="5,000+" label="Happy Clients" />
        <StatItem value="99%" label="Approval Rate" />
        <StatItem value="4.9/5" label="Client Rating" />
      </div>
    </div>
  </section>
);

const StatItem = ({ value, label }) => (
  <div>
    <div className="text-3xl font-bold text-[#3b82f6] mb-2">{value}</div>
    <div className="text-[#94a3b8]">{label}</div>
  </div>
);

const CTASection = ({ navigate }) => (
  <section className="container mx-auto px-4 py-16">
    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
      <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-[#1e293b] mb-6">
        Ready to Accelerate Your Cash Flow?
      </h2>
      <p className="text-xl text-[#475569] mb-8">
        Get started with CreditGoose today and transform your invoices into
        working capital
      </p>
      <Button onClick={() => navigate("/submit-invoice")} variant="primary">
        Submit Your First Invoice
      </Button>
    </div>
  </section>
);

const Button = ({ children, onClick, variant = "primary" }) => {
  const baseClasses =
    "font-semibold py-4 px-8 rounded-lg transition duration-300";
  const variantClasses = {
    primary: "bg-[#3b82f6] hover:bg-[#2563eb] text-white",
    secondary:
      "border-2 border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
};

const Footer = () => (
  <footer className="bg-white border-t border-[#e2e8f0]">
    <div className="container mx-auto px-4 py-8">
      <div className="text-center text-[#64748b]">
        <p>© 2025 CreditGoose. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default App;
