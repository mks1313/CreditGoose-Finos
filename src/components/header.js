"use client";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard" },
  // { name: "Funding Invoices", href: "/funding-invoices" },
  { name: "Admin", href: "/admin" },
  { name: "Submit Invoice", href: "/submit-invoice" },
  { name: "Auto Funding", href: "/auto-funding-settings" },
  { name: "Reports", href: "/reports" },
];

const Header = ({ activePage = "dashboard" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (href) => {
    navigate(href);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => handleNavigation("/")}
            className="flex items-center"
            aria-label="Go to homepage"
          >
            <i className="fas fa-feather text-[#3b82f6] text-2xl mr-2"></i>
            <span className="text-2xl font-bold font-montserrat text-[#1e293b]">
              CreditGoose
            </span>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map(({ name, href }) => (
              <button
                key={name}
                onClick={() => handleNavigation(href)}
                className={`font-semibold transition duration-300 ${
                  activePage.toLowerCase() === name.toLowerCase()
                    ? "text-[#3b82f6]"
                    : "text-[#475569] hover:text-[#3b82f6]"
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="text-[#475569] hover:text-[#3b82f6]"
              aria-label="Toggle navigation menu"
            >
              <i
                className={`fas fa-${isMenuOpen ? "times" : "bars"} text-xl`}
              ></i>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4">
            {NAV_LINKS.map(({ name, href }) => (
              <button
                key={name}
                onClick={() => handleNavigation(href)}
                className={`block w-full text-left py-2 px-4 rounded-lg font-semibold transition duration-300 ${
                  activePage.toLowerCase() === name.toLowerCase()
                    ? "text-[#3b82f6] bg-[#f8fafc]"
                    : "text-[#475569] hover:text-[#3b82f6] hover:bg-[#f8fafc]"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
