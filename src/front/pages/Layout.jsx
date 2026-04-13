import { Outlet, useLocation } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    const location = useLocation();

    const hideGenericNavbar = location.pathname.startsWith("/client") || location.pathname.startsWith("/establecimiento");
    const hideFooter = location.pathname.startsWith("/client") || location.pathname.startsWith("/establecimiento");
    return (
        <ScrollToTop>
            <Navbar />
            {!hideGenericNavbar && <Navbar/>}
                <Outlet />
            {!hideFooter && <Footer />}
        </ScrollToTop>
    )
}