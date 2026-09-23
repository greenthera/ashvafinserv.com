import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import AmortizationCalculator from './pages/AmortizationCalculator.jsx';
import SipSwpCalculator from './pages/SipSwpCalculator.jsx';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index.html" element={<Home />} />
        <Route path="/amortization-calculator" element={<AmortizationCalculator />} />
        <Route path="/sip-swp-calculator" element={<SipSwpCalculator />} />
        {/* Redirect the old .html links (sitemap, bookmarks, backlinks) to the clean URLs. */}
        <Route path="/amortization-calculator.html" element={<Navigate to="/amortization-calculator" replace />} />
        <Route path="/sip-swp-calculator.html" element={<Navigate to="/sip-swp-calculator" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
