import React, { useEffect, useState } from "react";
import Header from "../header";

const ListEditor = ({ title, items, setItems }) => {
  const [newPrompt, setNewPrompt] = useState("");

  const addPrompt = () => {
    if (newPrompt.trim() === "") return;
    setItems([...items, { text: newPrompt, active: false }]);
    setNewPrompt("");
  };

  const toggleActive = (index) => {
    setItems(
      items.map((item, i) => ({
        ...item,
        active: i === index,
      }))
    );
  };

  return (
    <div className="flex-1 mx-4 bg-[#f8fafc] rounded-lg p-6 shadow">
      <h3 className="text-xl font-semibold text-[#1e293b] mb-4">{title}</h3>
      <ul className="space-y-2 mb-4">
        {items.map((item, idx) => (
          <li key={idx}>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={item.active}
                onChange={() => toggleActive(idx)}
                className="accent-[#3b82f6]"
              />
              <span className="text-[#475569]">{item.text}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          type="text"
          value={newPrompt}
          onChange={(e) => setNewPrompt(e.target.value)}
          placeholder="Enter prompt"
          className="flex-1 px-3 py-2 border border-[#e2e8f0] rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:outline-none"
        />
        <button
          onClick={addPrompt}
          className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-lg font-semibold transition"
        >
          Add
        </button>
      </div>
    </div>
  );
};

const Scoring = () => {
  const [listA, setListA] = useState([]);
  const [listB, setListB] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/admin/scoring`)
      .then((res) => res.json())
      .then((data) => {
        setListA(data.web_searches || []);
        setListB(data.goose_prompts || []);
      })
      .catch((err) => setError("Failed to fetch prompts."));
  }, []);

  const saveChanges = () => {
    setError(null);
    setSuccess(false);
    setResponseData(null);
    fetch(`${process.env.REACT_APP_API_URL}/admin/scoring`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ web_searches: listA, goose_prompts: listB }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSuccess(true);
        setResponseData(data);
        setTimeout(() => setSuccess(false), 2000);
      })
      .catch(() => setError("Failed to save."));
  };

  const runGoose = () => {
    setError(null);
    setResponseData(null);
    fetch(`${process.env.REACT_APP_API_URL}/admin/goose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goose_prompts: listB }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSuccess(true);
        setResponseData(data);
      })
      .catch(() => setError("Failed to run Goose."));
  };

  return (
    <div>
      <Header activePage="scoring" className="mt-20" />
      <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#e2e8f0] py-16">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-10">
          <h2 className="text-3xl font-bold font-montserrat text-[#1e293b] mb-8">
            Scoring Admin
          </h2>
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-4">
              Success!
            </div>
          )}
          {responseData && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="text-lg font-semibold text-blue-800 mb-2">Response:</h4>
              <pre className="bg-white border border-blue-100 rounded p-3 text-sm text-gray-700 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(responseData, null, 2)}
              </pre>
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-8 mb-8 h-[300px]">
            <div className="flex-1 flex flex-col">
              <ListEditor
                title="Web Search"
                items={listA}
                setItems={setListA}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <ListEditor
                title="Goose Prompt"
                items={listB}
                setItems={setListB}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={saveChanges}
              className="flex-1 px-8 py-3 bg-[#e2e8f0] hover:bg-[#cbd5e1] text-[#1e293b] font-semibold rounded-lg transition"
            >
              Save & Test
            </button>
            <button
              onClick={runGoose}
              className="flex-1 px-8 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-lg transition"
            >
              Only Goose
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scoring;
