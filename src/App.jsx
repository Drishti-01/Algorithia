import { Navigate, Route, Routes } from "react-router-dom";
import DataCityPage from "./pages/DataCityPage";
import LandingPage from "./pages/LandingPage";
import QuestionsPage from "./pages/QuestionsPage";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/questions" element={<QuestionsPage />} />
            <Route path="/city/:id" element={<DataCityPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}