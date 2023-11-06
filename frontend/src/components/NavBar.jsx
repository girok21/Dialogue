import { Box, Flex, useColorMode, useDisclosure } from "@chakra-ui/react"
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreatePostModal from "./CreatePostModal.jsx";

const NavBar = () => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate()
  const iconColor = colorMode === 'dark'? 'navBarIcon.dark' : 'navBarIcon.light';
  const { userInfo } = useSelector((state) => state.auth);
  
  const { isOpen, onOpen, onClose } = useDisclosure();

  // const [ isModalOpen, setIsModalOpen ] = useState(false);
  const initialState = {
    home: false,
    search: false,
    post: false,
    notification: false,
    profile: false
  }

  const onCreatePostHandler = () =>{
  }


  // const [ iconActiveState, setIconActiveState ] = useState(initialState)
  const outlineColor = colorMode === 'light'? '#b8b8b8' : '#4d4d4d';
  return (
    <>
        <Flex
            flexDirection={"row"}
            gap={2}
        >
            <Box
              className="navbar_icon"
              _hover={{
                background: `${iconColor}`
              }}
              onClick={()=>{ navigate('/home')}}
            >
              <HomeSvg outlineColor={outlineColor}/>
            </Box>
            <Box
              className="navbar_icon"
              _hover={{
                background: `${iconColor}`
              }}
            >
              <SearchSvg outlineColor={outlineColor}/>
            </Box>
            <Box
              className="navbar_icon"
              _hover={{
                background: `${iconColor}`
              }}
              onClick={onOpen}
            >
              <PostSvg outlineColor={outlineColor}/>
              <CreatePostModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
            </Box>
            <Box
              className="navbar_icon"
              _hover={{
                background: `${iconColor}`
              }}
              onClick={()=>{navigate(`/activity`)}}
            >
              <HeartSvg outlineColor={outlineColor}/>
            </Box>
            <Box
              className="navbar_icon"
              _hover={{
                background: `${iconColor}`
              }}
              onClick={()=>{ navigate(`/user/${userInfo.username}`)}}
            >
              <ProfileSvg outlineColor={outlineColor}/>
            </Box>
        </Flex>
    </>
  )
}

export default NavBar

const HomeSvg = ({outlineColor})=>{
  return(
    <svg aria-label="Home" fill="currentColor" height="26" role="img" viewBox="0 0 26 26" width="26"><title>Home</title><path d="M2.25 12.8855V20.7497C2.25 21.8543 3.14543 22.7497 4.25 22.7497H9.25C9.52614 22.7497 9.75 22.5258 9.75 22.2497V17.6822V16.4997C9.75 14.7048 11.2051 13.2497 13 13.2497C14.7949 13.2497 16.25 14.7048 16.25 16.4997V17.6822V22.2497C16.25 22.5258 16.4739 22.7497 16.75 22.7497H21.75C22.8546 22.7497 23.75 21.8543 23.75 20.7497V12.8855C23.75 11.3765 23.0685 9.94814 21.8954 8.99882L16.1454 4.34539C14.3112 2.86094 11.6888 2.86094 9.85455 4.34539L4.10455 8.99882C2.93153 9.94814 2.25 11.3765 2.25 12.8855Z" fill="transparent" stroke={outlineColor} strokeLinecap="round" strokeWidth="2.5"></path></svg>)}

const SearchSvg = ({outlineColor})=>{
  return (
    <svg aria-label="Search" fill="transparent" height="26" role="img" viewBox="0 0 26 26" width="26"><title>Search</title><path clipRule="evenodd" d="M3.5 11.5C3.5 7.08172 7.08172 3.5 11.5 3.5C15.9183 3.5 19.5 7.08172 19.5 11.5C19.5 15.9183 15.9183 19.5 11.5 19.5C7.08172 19.5 3.5 15.9183 3.5 11.5ZM11.5 1C5.70101 1 1 5.70101 1 11.5C1 17.299 5.70101 22 11.5 22C13.949 22 16.2023 21.1615 17.9883 19.756L22.3661 24.1339C22.8543 24.622 23.6457 24.622 24.1339 24.1339C24.622 23.6457 24.622 22.8543 24.1339 22.3661L19.756 17.9883C21.1615 16.2023 22 13.949 22 11.5C22 5.70101 17.299 1 11.5 1Z" fill={outlineColor} fillRule="evenodd"></path></svg>
)}

const PostSvg = ({outlineColor})=>{
  return(
    <svg aria-label="Create" fill="transparent" height="26" role="img" viewBox="0 0 26 26" width="26"><title>Create</title><path d="M22.75 13L22.75 13.15C22.75 16.5103 22.75 18.1905 22.096 19.4739C21.5208 20.6029 20.6029 21.5208 19.4739 22.096C18.1905 22.75 16.5103 22.75 13.15 22.75L12.85 22.75C9.48969 22.75 7.80953 22.75 6.52606 22.096C5.39708 21.5208 4.4792 20.6029 3.90396 19.4739C3.25 18.1905 3.25 16.5103 3.25 13.15L3.25 12.85C3.25 9.48968 3.25 7.80953 3.90396 6.52606C4.4792 5.39708 5.39708 4.4792 6.52606 3.90396C7.80953 3.25 9.48968 3.25 12.85 3.25L13 3.25" stroke={outlineColor} strokeLinecap="round" strokeWidth="2.5"></path><path d="M21.75 4.25L13.75 12.25" stroke={outlineColor} strokeLinecap="round" strokeWidth="2.5"></path></svg>
)}

const HeartSvg = ({outlineColor})=>{
  return(
    <svg aria-label="Notifications" fill="transparent" height="26" role="img" viewBox="0 0 26 26" width="26"><title>Notifications</title><path d="M2.5 9.85683C2.5 14.224 6.22178 18.5299 12.0332 22.2032C12.3554 22.397 12.7401 22.5909 13 22.5909C13.2703 22.5909 13.655 22.397 13.9668 22.2032C19.7782 18.5299 23.5 14.224 23.5 9.85683C23.5 6.11212 20.8698 3.5 17.4599 3.5C15.4847 3.5 13.9356 4.39792 13 5.74479C12.0851 4.40812 10.5257 3.5 8.5401 3.5C5.14059 3.5 2.5 6.11212 2.5 9.85683Z" stroke={outlineColor} strokeWidth="2.5"></path></svg>)
}

const ProfileSvg = ({outlineColor})=>(
  <svg aria-label="Profile" fill="none" height="26" role="img" viewBox="0 0 26 26" width="26"><title>Profile</title><circle cx="13" cy="7.25" r="4" stroke={outlineColor} strokeWidth="2.5"></circle><path d="M6.26678 23.75H19.744C21.603 23.75 22.5 23.2186 22.5 22.0673C22.5 19.3712 18.8038 15.75 13 15.75C7.19625 15.75 3.5 19.3712 3.5 22.0673C3.5 23.2186 4.39704 23.75 6.26678 23.75Z" stroke={outlineColor} strokeWidth="2.5"></path></svg>
)