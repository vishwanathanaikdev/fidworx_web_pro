import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AboutUsRoute from "./routes/AboutUsRoute";
import HomeRoute from "./routes/HomeRoute";
import MenuRoute from "./routes/MenuRoute";
import ManagedOfficeDetailRoute from "./routes/ManagedOfficeDetailRoute";
import AuthRoute from "./routes/AuthRoute"; // ✅ new

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/menu" element={<MenuRoute />} />
        <Route path="/office/:id" element={<ManagedOfficeDetailRoute />} />
        <Route path="/about" element={<AboutUsRoute />} />
        <Route path="/auth" element={<AuthRoute />} /> {/* ✅ new global Auth route */}
      </Routes>
    </Router>
  );
}

export default App;








//===============>>> Old one without Auth 200%


// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AboutUsRoute from "./routes/AboutUsRoute";
// import HomeRoute from "./routes/HomeRoute";
// import MenuRoute from "./routes/MenuRoute";   
// import ManagedOfficeDetailRoute from "./routes/ManagedOfficeDetailRoute"; // ✅ new responsive route
// import "./App.css";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<HomeRoute />} />
//         <Route path="/menu" element={<MenuRoute />} />   {/* ✅ responsive */}
//         <Route path="/office/:id" element={<ManagedOfficeDetailRoute />} /> {/* ✅ responsive */}
//         <Route path="/about" element={<AboutUsRoute />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;









//------------------>> Menupage 29/sep


// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import ManagedOfficeDetail from "./pages/ManagedOfficeDetail";
// import AboutUsRoute from "./routes/AboutUsRoute";
// import HomeRoute from "./routes/HomeRoute";
// import MenuRoute from "./routes/MenuRoute";   // ✅ added
// import "./App.css";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<HomeRoute />} />
//         <Route path="/menu" element={<MenuRoute />} />   {/* ✅ now responsive */}
//         <Route path="/office/:id" element={<ManagedOfficeDetail />} />
//         <Route path="/about" element={<AboutUsRoute />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;









//=========>>> Home page added


// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import MenuPage from "./pages/MenuPage";
// import ManagedOfficeDetail from "./pages/ManagedOfficeDetail";
// import AboutUsRoute from "./routes/AboutUsRoute";
// import HomeRoute from "./routes/HomeRoute";   // ✅ added
// import "./App.css";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<HomeRoute />} />    {/* ✅ replaced */}
//         <Route path="/menu" element={<MenuPage />} />
//         <Route path="/office/:id" element={<ManagedOfficeDetail />} />
//         <Route path="/about" element={<AboutUsRoute />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;









//........>> About us added 

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import MenuPage from "./pages/MenuPage";
// import ManagedOfficeDetail from "./pages/ManagedOfficeDetail";
// // import AboutUs from "./pages/websiteUser/AboutUs";  // ✅ import
// import AboutUsRoute from "./routes/AboutUsRoute";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/menu" element={<MenuPage />} />
//         <Route path="/office/:id" element={<ManagedOfficeDetail />} />
//         {/* <Route path="/about" element={<AboutUs />} />  */}
//            <Route path="/about" element={<AboutUsRoute />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;








//===================>>>>  Working for rsponsive


// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import MenuPage from "./pages/MenuPage";
// import ManagedOfficeDetail from "./pages/ManagedOfficeDetail";
// import AboutUs from "./pages/websiteUser/AboutUs";  // ✅ import

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/menu" element={<MenuPage />} />
//         <Route path="/office/:id" element={<ManagedOfficeDetail />} />
//         <Route path="/about" element={<AboutUs />} /> {/* ✅ About Us */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;






///////old working 
// // App.js
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import MenuPage from "./pages/MenuPage";
// import ManagedOfficeDetail from "./pages/ManagedOfficeDetail";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/menu" element={<MenuPage />} />
//         <Route path="/office/:id" element={<ManagedOfficeDetail/>} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;








//==============>>> old

// // App.js
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import MenuPage from "./pages/MenuPage";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/menu" element={<MenuPage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
