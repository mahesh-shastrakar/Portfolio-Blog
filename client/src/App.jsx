// Importing necessary modules and components

// import the router components from react-router-dom
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// import components and pages
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Projects from "./pages/Projects";
import Dashboard from "./pages/Dashboard";
import FooterComponent from "./components/FooterComponent";
import PrivateRoute from "./components/PrivateRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import Search from "./pages/Search";

// Create a functional component App
function App() {
  return (
    <>
      {/* // Render the Router component with the Header, Routes, and FooterComponent components */}
      <Router>
        <Header />

        {/* // Render the Routes component with the Route components for the different paths */}
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/search" element={<Search />}></Route>
          <Route path="/projects" element={<Projects />}></Route>

          {/* // the private route is only accessible to authenticated users  */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />}></Route>
          </Route>

          {/* // the only admin private route is only accessible to authenticated users with admin role */}
          <Route element={<OnlyAdminPrivateRoute />}>
            <Route path="/create-post" element={<CreatePost />}></Route>
            <Route path="/update-post/:postId" element={<UpdatePost />}></Route>
          </Route>
          <Route path="/post/:postSlug" element={<PostPage />}></Route>
        </Routes>
        <FooterComponent />
      </Router>
    </>
  );
}

export default App;
