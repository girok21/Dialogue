import { Container, Flex, useColorMode } from "@chakra-ui/react"
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
import { useSelector } from "react-redux";
import { useMediaQuery } from '@chakra-ui/react'
import SearchPage from "./pages/SearchPage.jsx"


function App() {

  const{ colorMode } = useColorMode();
  const { userInfo } = useSelector((state) => state.auth);
  const [isTabView] = useMediaQuery('(max-width: 630px)');

  return (
    <>
    <Container
      maxW={"1100px"}
      pos={'fixed'}
      top={0}
      right={0}
      left={0}
      bg={colorMode=='dark'?'#101010':'#edf2f7'}
      zIndex={'5'}
      opacity={'97%'}
    >
        <Header isTabView={isTabView}/>
    </Container>
    {isTabView && 
      <Container
        maxW={"1100px"}
        pos={'fixed'}
        bg={colorMode=='dark'?'#101010':'#edf2f7'}
        zIndex={'5'}
        opacity={'97%'}
        bottom={0}
        right={0}
        left={0}
      >
          <NavBar />
      </Container>}
    <Container 
      maxW={'1100px'} 
      h={isTabView? '75px' :'90px'}
    />
    <Container maxW="750px">
    <Routes>
      <Route index= "/" element= {<Navigate to="/home"/>} />
      <Route path= "/home"  element= {userInfo? <HomePage /> : <Navigate to="/auth/login"/>} />
      <Route path="/user/:username" element={<UserPage />}/>
      <Route path="/user/:username/post/:postId" element={<PostPage />}/>
      <Route path="activity" element={userInfo? <NotificationsPage /> : <Navigate to="/auth/login"/>} />
      <Route path="/auth/login" element= {<LogInPage/>} />
      <Route path="/auth/signup" element= {<SignUpPage/>} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/settings/profile" element= {userInfo? <ProfileEditPage /> : <Navigate to={"/auth/login"} />} />
    </Routes>
    </Container>
    <Container 
      maxW={'1100px'} 
      h={isTabView? '75px' :'0px'}
    />
    <Container maxW="750px"></Container>
    </>
  )
}

export default App
