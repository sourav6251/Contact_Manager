import { Outlet } from "react-router-dom";
import Header from "../common/Header";
// import { Footer } from "../common/Footer";

const HeaderLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="min-h-screen flex flex-col">
                <Outlet />
            </div>
            {/* <Footer /> */}
        </div>
    );
};

export default HeaderLayout;
