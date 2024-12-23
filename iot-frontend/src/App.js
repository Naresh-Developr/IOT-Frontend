import React, { useState } from "react";

function App() {
  const [channelId, setChannelId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState("");
  const [data, setData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Fetching data...");

    try {
      const response = await fetch("http://127.0.0.1:8000/fetch-thingspeak-data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ channel_id: channelId, api_key: apiKey }),
      });

      const result = await response.json();

      if (result.error) {
        setStatus(`Error: ${result.error}`);
        setData(null);
      } else {
        setData(result.feeds || []);
        setStatus("");
      }
    } catch (error) {
      setStatus(`Failed to fetch data: ${error.message}`);
      setData(null);
    }
  };

  const renderTable = () => {
    if (!data || data.length === 0) {
      return <p className="text-gray-500">No data available to display.</p>;
    }

    const headers = Object.keys(data[0]);

    return (
      <table className="min-w-full border-collapse border border-gray-300 shadow-md">
        <thead className="bg-blue-500 text-white">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="py-3 px-4 border-b">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
              {headers.map((header, i) => (
                <td key={i} className="py-2 px-4 border-b">{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h1 className="text-3xl font-semibold text-center text-blue-700 mb-8">
          Fetch ThingSpeak Data
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="channel_id" className="block text-sm font-medium text-gray-700">
              Channel ID
            </label>
            <input
              type="text"
              id="channel_id"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              className="w-full mt-2 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label htmlFor="api_key" className="block text-sm font-medium text-gray-700">
              API Key
            </label>
            <input
              type="text"
              id="api_key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full mt-2 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Fetch Data
          </button>
        </form>

        <div className="mt-6 text-center">
          {status && <p className="text-red-500">{status}</p>}
          {data && data.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Fetched Data</h2>
              {renderTable()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
