import toast, { Toaster } from 'react-hot-toast';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

const Home = () => {
    const [channelId, setChannelId] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [status, setStatus] = useState("");
    const [data, setData] = useState(null);
    const navigate = useNavigate();
  
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
        console.log(result);
        if (result.error) {
          setStatus(`Error: ${result.error}`);
          setData(null);
          toast.error("Failed to fetch data.");
        } else {
          setData(result.feeds || []);
          setStatus("");
          toast.success("Data updated successfully!");
          
          navigate("/ask-question", { state: { data: result.feeds } });
        }
      } catch (error) {
        setStatus(`Failed to fetch data: ${error.message}`);
        setData(null);
        toast.error("Error fetching data.");
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
        <Toaster />
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
        </div>
      </div>
    );
  }

  export default Home;