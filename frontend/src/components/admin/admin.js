import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../header";

const features = [
  { key: "scoring", label: "Scoring", implemented: true },
  ...[1, 2, 3, 4, 5].map((i) => ({
    key: `feature-${i}`,
    label: `Feature ${i}`,
    implemented: false,
  })),
];

const Admin = () => {
  const navigate = useNavigate();

  const handleClick = (feature) => {
    if (feature === "scoring") {
      navigate("/admin/scoring");
    } else {
      alert(`${feature} is not implemented yet`);
    }
  };

  return (
    <div>
      <Header activePage="admin" className="mt-20" />

      <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold font-montserrat text-[#1e293b] mb-8">
            Admin Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map(({ key, label, implemented }) => (
              <button
                key={key}
                onClick={() => handleClick(key)}
                className={`px-8 py-4 rounded-lg font-semibold transition duration-200 flex items-center justify-center
                ${
                  implemented
                    ? "bg-[#3b82f6] hover:bg-[#2563eb] text-white"
                    : "bg-gray-200 text-[#475569] cursor-not-allowed"
                }
              `}
                disabled={!implemented}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
