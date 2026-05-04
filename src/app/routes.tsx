import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "./pages/Home";
import ListingPage from "./pages/ListingPage";
import PropertyDetail from "./pages/PropertyDetail";
import ContactUs from "./pages/ContactUs";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminAddProperty from "./pages/admin/AdminAddProperty";
import AdminEditProperty from "./pages/admin/AdminEditProperty";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminFAQs from "./pages/admin/AdminFAQs";
import AdminTerms from "./pages/admin/AdminTerms";
import AdminPrivacy from "./pages/admin/AdminPrivacy";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "properties", Component: ListingPage },
      { path: "properties/:id", Component: PropertyDetail },
      { path: "contact", Component: ContactUs },
      { path: "about", Component: About },
      { path: "faq", Component: FAQ },
      { path: "terms-conditions", Component: TermsConditions },
      { path: "privacy-policy", Component: PrivacyPolicy },
      { path: "admin/login", Component: AdminLogin },
      { path: "admin/signup", Component: AdminSignup },
      { path: "admin/dashboard", Component: AdminDashboard },
      { path: "admin/properties", Component: AdminProperties },
      { path: "admin/properties/add", Component: AdminAddProperty },
      { path: "admin/properties/edit/:id", Component: AdminEditProperty },
      { path: "admin/inquiries", Component: AdminInquiries },
      { path: "admin/contacts", Component: AdminContacts },
      { path: "admin/faqs", Component: AdminFAQs },
      { path: "admin/terms", Component: AdminTerms },
      { path: "admin/privacy", Component: AdminPrivacy },
      { path: "*", Component: NotFound },
    ],
  },
]);