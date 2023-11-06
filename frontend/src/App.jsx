import { Container } from "@chakra-ui/react"
import { Navigate, Route, Routes } from "react-router-dom"
import UserPage from "./pages/UserPage.jsx"
import PostPage from "./pages/PostPage.jsx"
import Header from "./components/Header.jsx"
import NavBar from "./components/NavBar.jsx"
import HomePage from "./pages/HomePage.jsx"
import LogInPage from "./pages/LogInPage.jsx"
import SignUpPage from "./pages/SignUpPage.jsx"
import ProfileEditPage from "./pages/ProfileEditPage.jsx";
import NotificationsPage from './pages/NotificationsPage.jsx'
import { useSelector } from "react-redux"
function App() {

  const { userInfo } = useSelector((state) => state.auth);
  return (
    <>
    <Container maxW={"1100px"}>
      <Header />
    </Container>
    <Container maxW="750px">
      {/* <NavBar /> */}
    <Routes>
      <Route index= "/" element= {<Navigate to="/home"/>} />
      <Route path= "/home"  element= {userInfo? <HomePage /> : <Navigate to="/auth/login"/>} />
      <Route path="/user/:username" element={<UserPage />}/>
      <Route path="/user/:username/post/:postId" element={<PostPage />}/>
      <Route path="activity" element={userInfo? <NotificationsPage /> : <Navigate to="/auth/login"/>} />
      <Route path="/auth/login" element= {<LogInPage/>} />
      <Route path="/auth/signup" element= {<SignUpPage/>} />
      <Route path="/settings/profile" element= {userInfo? <ProfileEditPage /> : <Navigate to={"/auth/login"} />} />
    </Routes>
    </Container>
    </>
  )
}

export default App
