import { Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContextProvider } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import Loader from "./components/Loader";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HelmetProvider } from "react-helmet-async";
import Routes from "./routes/Routes";
import "./styles/App.css";

const App = () => (
  <HelmetProvider>
    <AuthContextProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<Loader />}>
          <Routes />
        </Suspense>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          // hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          stacked
          transition={Slide}
        />
      </BrowserRouter>
    </AuthContextProvider>
  </HelmetProvider>
);

export default App;
