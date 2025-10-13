import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./Components/MainPage/MainPage";
import LoginPage from "./Components/LoginPage/LoginPage";
import RegisterPage from "./Components/RegisterPage/RegisterPage";
import EmployersComponent from "./Components/EmployersComponent/EmlployersComponent";
import CandidateComponent from "./Components/CandidateComponent/CandidateComponent";
import FilltredContent from "./Components/FilltredContent/FilltredContent";
import AdminPanel from "./Components/AdminPanel/AdminPanel";
import JobOffersPage from "./Components/JobOffersPage/JobOffersPage";
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
        <Routes>
          <Route path="/job-offers" element={<JobOffersPage />} />
        </Routes>
        <Routes>
          <Route path="/employers" element={<EmployersComponent />} />
        </Routes>
        <Routes>
          <Route path="/candidates" element={<CandidateComponent />} />
        </Routes>
        <Routes>
          <Route
            path="/job-offerts/filltred"
            element={<FilltredContent offertPage={true} />}
          />
        </Routes>
        <Routes>
          <Route
            path="/employers/filltred"
            element={<FilltredContent employersPage={true} />}
          />
        </Routes>
        <Routes>
          <Route
            path="/candidates/filltred"
            element={<FilltredContent candidatePage={true} />}
          />
        </Routes>
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
