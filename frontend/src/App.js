import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import JobOffersPage from "./pages/JobOffersPage/JobOffersPage";
import { FavoritesProvider } from "./context/FavoriteContext";
const App = () => {
  return (
    <>
      <FavoritesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/job-offers" element={<JobOffersPage />} />
            {/* <Route path="/employers" element={<EmployersComponent />} />
            <Route
              path="/candidates"
              element={
                <IsEmployer>
                  <CandidatePage />
                </IsEmployer>
              }
            />
            <Route
              path="/employers/filltred"
              element={<FilltredEmployers employerPage={true} />}
            />
            <Route
              path="/candidates/filltred"
              candidatesPage={true}
              element={<FiltredCandidate />}
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            /> */}
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </>
  );
};

export default App;
