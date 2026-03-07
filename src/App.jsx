import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import DataCityMapPage from "./components/DataCityMap";
import AuthPage from "./components/login";
import DataCityPage from "./pages/DataCityPage";
import HunterProtocolPage from "./pages/HunterProtocolPage";
import LandingPage from "./pages/LandingPage";
import QuestionsPage from "./pages/QuestionsPage";
import DistrictSelectionPage from "./pages/DistrictSelectionPage";

function LoginRoute() {
    const navigate = useNavigate();

    return <AuthPage onEnterCity={() => navigate("/map")} />;
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/districts" element={<DistrictSelectionPage />} />
            <Route path="/map" element={<DataCityMapPage />} />
            <Route path="/questions" element={<QuestionsPage />} />
            <Route path="/hunter-protocol" element={<HunterProtocolPage />} />
            <Route path="/city/:id" element={<DataCityPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
