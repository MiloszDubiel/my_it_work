import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./Components/MainPage/MainPage";
import LoginPage from "./Components/LoginPage/LoginPage";
import RegisterPage from "./Components/RegisterPage/RegisterPage";
import EmployersComponent from "./Components/EmployersComponent/EmlployersComponent";
import CandidatePage from "./Components/CandidateComponent/CandidatePage";
import AdminPanel from "./Components/AdminPanel/AdminPanel";
import JobOffersPage from "./Components/JobOffersPage/JobOffersPage";
import FiltredJobOffersPage from "./Components/JobOffersPage/FilteredJobPage";
import FilltredEmployers from "./Components/EmployersComponent/FiltredEmployerComponent";
import AdminRoute from "./Components/AdminPanel/AdminRoute";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/job-offers" element={<JobOffersPage />} />
          <Route path="/employers" element={<EmployersComponent />} />
          <Route path="/candidates" element={<CandidatePage />} />
          <Route
            path="/job-offers/filltred"
            element={<FiltredJobOffersPage offersPage={true} />}
          />
          <Route
            path="/employers/filltred"
            element={<FilltredEmployers employerPage={true} />}
          />
          <Route path="/candidates/filltred" element={""} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
