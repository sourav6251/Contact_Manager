import { BrowserRouter, Route, Routes } from "react-router-dom";
import HeaderLayout from "./components/layout/HeaderLayout";
import Landing from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import AboutPage from "./pages/AboutPage";
import FeaturePage from "./pages/FeaturePage";
import { Provider } from "react-redux";
import { store } from "./redux/SliceStore";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { Toaster } from "sonner";
import Logout from "./components/auth/Logout";
import ContactManager from "./pages/ContactManager";
import Profile from "./components/profile/ProfilePage";
import TagsContact from "./components/tags/TagsContact";
import SettingsPages from "./pages/SettingsPages";
// import Settings from "./pages/SettingsPages";
// import SettingsPages from "./pages/SettingsPages";
// import Settings from "./components/settings/Settings";
function App() {
    return (
        <Provider store={store}>
            {/* <ThemeProvider> */}
                <Toaster />
                <BrowserRouter>
                    <Routes>
                        <Route element={<HeaderLayout />}>
                            {/* Public Routes */}
                            <Route path="/" element={<Landing />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/feature" element={<FeaturePage />} />

                            {/* Protected Routes */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/about" element={<AboutPage />} />
                                <Route path="/logout" element={<Logout />} />
                                <Route
                                    path="/contacts"
                                    element={<ContactManager />}
                                />
                                <Route
                                    path="/profile"
                                    element={<Profile/>}
                                />
                                <Route
                                    path="/tags"
                                    element={<TagsContact/>}
                                />
                                <Route
                                    path="/settings"
                                    element={<SettingsPages/>}
                                />
                            </Route>

                            {/* Catch-all */}
                            <Route path="*" element={<Landing />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            {/* </ThemeProvider> */}
        </Provider>
    );
}

export default App;
