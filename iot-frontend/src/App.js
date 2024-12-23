import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import Home  from './pages/Home';
import AskQuestion from "./pages/AskQuestions";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ask-question" element={<AskQuestion />} />
      </Routes>
    </Router>
  );
}

export default App;
