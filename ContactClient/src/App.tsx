import { BrowserRouter, Route, Routes } from "react-router-dom";
import HeaderLayout from "./components/layout/HeaderLayout";
import Landing from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import AboutPage from "./pages/AboutPage";
import FeaturePage from "./pages/FeaturePage";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route  path="/" Component={HeaderLayout}>
                      <Route path="/" Component={Landing}/>
                      <Route path="/login" Component={LoginPage}/>
                      <Route path="/about" Component={AboutPage}/>
                      <Route path="/feature" Component={FeaturePage}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
