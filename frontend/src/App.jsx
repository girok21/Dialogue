import { Container } from "@chakra-ui/react"
import { Navigate, Route, Routes } from "react-router-dom"
import UserPage from "./pages/UserPage"
import PostPage from "./pages/PostPage"
import Header from "./components/header"
import NavBar from "./components/NavBar"
import HomePage from "./pages/HomePage"
function App() {

  return (
    <>
    <Container maxW="620px">
      <Header />
      {/* <NavBar /> */}
    <Routes>
      <Route index= "/" element= {<Navigate to="/home"/>} />
      <Route path= "/home" element= {<HomePage />} />
      <Route path="/user/:username" element={<UserPage />}/>
      <Route path="/user/:username/post/:pid" element={<PostPage />}/>
    </Routes>
    </Container>
    </>
  )
}

export default App
