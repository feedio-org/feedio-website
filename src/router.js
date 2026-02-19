import ChangePassword from "pages/account/changepassword";
import CreateAccount from "pages/account/create";
import ForgotPassword from "pages/account/forgotpassword";
import Login from "pages/account/login";
import VerifyAccount from "pages/account/verify";
import Billings from "pages/billing";
import PaymentCancel from "pages/billing/paymentCancel";
import PaymentSuccess from "pages/billing/paymentSuccess";
import CourseIndex from "pages/courseIndex";
import Dashboard from "pages/dashboard";
import VideoSearch from "pages/demo";
import Settings from "pages/settings";
import { useContext } from "react";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider
} from "react-router-dom";
import { VaContext } from "shared/rbac/context";
import store from "shared/store";
import { VaLayout } from "./layouts";
import FusifyVideoSearch from "pages/demo/fusify.demo";

function RootRouter() {
  const authCxt = useContext(VaContext);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route index path="/" element={<Login />} />
        <Route path="/demo" element={<VideoSearch />} />
        <Route path="/fusify" element={<FusifyVideoSearch />} />
        <Route
          index
          path="/account/create-account"
          element={<CreateAccount />}
        />
        <Route
          index
          path="/account/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          index
          path="/account/change-password"
          element={<ChangePassword />}
        />
        <Route index path="/account/verify" element={<VerifyAccount />} />
        <Route index path="/account/login" element={<Login />} />
        <Route
          path="/"
          element={
            authCxt?.authenticated ? (
              <VaLayout />
            ) : (
              <Navigate to="/account/login" />
            )
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/billings" element={<Billings />} />
          <Route path="/dashboard/:courseId" element={<CourseIndex />} />
          <Route path="/profile" element={<Settings />} />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/cancel" element={<PaymentCancel />} />
        </Route>
        <Route path="/account/changepassword" element={<Settings />} />
        {/* 404 Route */}
      </>
    )
  );

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
export default RootRouter;
