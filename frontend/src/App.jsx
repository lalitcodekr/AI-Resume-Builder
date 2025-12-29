// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import AdminHome from "./components/admin/AdminHome";
// import AdminUsers from "./components/admin/AdminUser/AdminUsers";
// import LandingPage from "./pages/Landingpage";
// import AdminLayout from "./components/admin/AdminLayout";

// import AdminDashboard from "./components/admin/AdminDashboard/AdminDashboard";
// import AdminCreateTemplate from "./components/admin/AdminCreateTemplates/AdminCreateTemplate";

// const App = () => {
//   return (
//     <Routes>
//       {/* Public route */}
//       <Route path="/" element={<LandingPage />} />

//       {/* Admin routes with layout */}
//       <Route path="/admin" element={<AdminLayout />}>
//         <Route index element={<AdminHome />} /> {/* /admin */}
//         <Route path="/admin/dashboard" element={<AdminDashboard />} />
//         <Route
//           path="/admin/create-templates"
//           element={<AdminCreateTemplate />}
//         />
//         <Route path="/admin/user" element={<AdminUsers />} />
//         {/* /admin/dashboard */}
//         {/* Add other admin pages here */}
//       </Route>
//     </Routes>
//   );
// };

// export default App;

import React from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/Landingpage";

import AdminLayout from "./components/admin/AdminLayout";
import AdminHome from "./components/admin/AdminHome";
import AdminDashboard from "./components/admin/AdminDashboard/AdminDashboard";
import AdminCreateTemplate from "./components/admin/AdminCreateTemplates/AdminCreateTemplate";
import AdminUsers from "./components/admin/AdminUser/AdminUsers";
import Resume from "./components/admin/resume"; // 🔥 templates page
import Templates from "./components/admin/AdminCreateTemplates/Templates";
import TemplateDocs from "./components/admin/AdminCreateTemplates/TemplateDocs";
import AdminSubscription from "./components/admin/AdminSubscription/AdminSubscription";
import AdminAcceptUser from "./components/admin/AdminAcceptUserTemplate/AdminAcceptUser";

const App = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<LandingPage />} />

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminHome />} /> {/* /admin */}
        <Route path="dashboard" element={<AdminDashboard />} />
        {/* <Route path="create-templates" element={<AdminCreateTemplate />} /> */}
        {/* <Route path="create-templates" element={<Templates />} /> */}
        <Route path="create-templates" element={<TemplateDocs />} />
        <Route path="templates" element={<Resume />} />
        <Route path="user" element={<AdminUsers head={"User Management"} />} />
        <Route path="subscription" element={<AdminSubscription />} />
        <Route path="/admin/template-requests" element={<AdminAcceptUser />} />
      </Route>
    </Routes>
  );
};

export default App;
