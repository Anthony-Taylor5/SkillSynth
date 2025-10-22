import "./App.css";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import SignIn from "./components/SignIn.tsx";
import NavBar from "./components/NavBar.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Profile from "./pages/Profile.tsx";
import Projects from "./pages/Projects.tsx";
import Learn from "./pages/Learn.tsx";
import Contact from "./pages/Contact.tsx"; 
import Groups from "./pages/Groups.tsx"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Pages() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/signin" element={<SignIn />} />

        <Route
          path="/dashboard"
          element={
            <>
              <NavBar />
              <main className="w-[min(1100px,95%)] mx-auto py-8 pb-28 overflow-y-auto">
                <Dashboard />
              </main>
              <Footer />
            </>
          }
        />

        <Route
          path="/profile"
          element={
            <>
              <NavBar />
              <main className="w-[min(1100px,95%)] mx-auto py-8 pb-28 overflow-y-auto">
                <Profile />
              </main>
              <Footer />
            </>
          }
        />


        <Route
          path="/projects"
          element={
            <>
              <NavBar />
              <main className="w-[min(1100px,95%)] mx-auto py-8 pb-28 overflow-y-auto">
                <Projects />
              </main>
              <Footer />
            </>
          }
        />

        <Route
          path="/groups"
          element={
            <>
              <NavBar />
              <main className="w-[min(1100px,95%)] mx-auto py-8 pb-28 overflow-y-auto">
                <Groups />
              </main>
              <Footer />
            </>
          }
        />

        <Route
          path="/learn"
          element={
            <>
              <NavBar />
              <main className="w-[min(1100px,95%)] mx-auto py-8 pb-28 overflow-y-auto">
                <Learn />
              </main>
              <Footer />
            </>
          }
        />

        <Route
          path="/contact"
          element={
            <>
              <NavBar />
              <main className="w-[min(1100px,95%)] mx-auto py-8 pb-28 overflow-y-auto">
                <Contact />
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Pages;
