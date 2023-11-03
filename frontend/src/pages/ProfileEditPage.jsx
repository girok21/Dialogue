import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Avatar, Button, Flex, FormControl, FormLabel, Image, Input, Text, Textarea, useDisclosure, useToast } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import BannerAvatar from '../components/BannerAvatar';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import usePreviewImage from "../hooks/usePreviewImage.js";
import { useUpdateDataMutation } from '../slices/userApiSlice.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../slices/authSlice.js';


const ProfileEditPage = () => {

  const {userInfo} = useSelector((state)=>state.auth);
  const [ updateData ] = useUpdateDataMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userObject, setUserObject] = useState({
    username: userInfo.username,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
    bio: userInfo.bio,
  })
  const { handleImageChange, imgUrl } = usePreviewImage();

  const fileRef = useRef(null);
  const cancelRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const onChangeProfPicHandler = () =>{
    fileRef.current.click();
  }
  const onChangeCovPicHandler = () =>{
    fileRef.current.click();
  }
  const submitHandler = async (e) =>{
    e.preventDefault();
    try {
        const res = await updateData({...userObject, profilePicture: imgUrl});
        if(Object.keys(res.data).length === 0){
            throw new Error
        }
        dispatch(setCredentials({...res.data}));
        navigate('/');
    }catch(error){
        console.log(error)
        toast({
            title: 'Error updating profile picture',
            status: 'error',
            duration: 2000
        })
    }
  }
    
  return (
    <>
        <Flex 
            // w={'50%'} 
            bg={'gray.700'} 
            borderRadius={'0.7rem'} 
            // position={'absolute'} 
            // mx={'auto'} 
            // left={'0'} 
            // right={'0'}
            overflow={'hidden'}
            flexDirection={'column'}
            gap={0}
            pb={5}
        >
            <form  onSubmit={submitHandler}>
            <Flex w={'full'} flexDirection={'row'}  bg={'gray.900'} h={'fit-content'} p={3} justifyContent={'space-between'} textColor={'white'}>
                <Flex gap={5} alignItems={'center'}>
                    <div className='icon-container' onClick={(e)=>{e.preventDefault(); navigate('/')}}>
                        <AiOutlineClose size={20} style={{ fill: 'white'}}/>
                    </div>
                    <Text fontSize={'xl'} fontWeight={'bold'}>Edit Profile</Text>
                </Flex>
                <Button colorScheme='green' size={'md'} onClick={submitHandler}>
                    Save
                </Button>
            </Flex>
            <Flex 
                px={2}
            >
                <Flex flexDirection={'column'} style={{width: '100%', gap:'2px', color:'white'}}>
                    <BannerAvatar bannerLink={userInfo.coverPicture}
                        avatarLink = {userInfo.profilePicture || "/default-profile.jpg"}
                        avatarB64String = {imgUrl}
                        isEdit={true}
                    />
                    <Flex flexDirection={'row-reverse'} gap={'1'} my={{base:'10px', md:'15px'}}>
                        <Button size={{base:'xs', md:'sm'}} onClick={onChangeProfPicHandler}>Change Banner</Button>
                        {/* <Input type='file' hidden/> */}
                        <Button size={{base:'xs', md:'sm'}} onClick={onChangeCovPicHandler}>Change Avatar</Button>
                        <Input type='file' hidden ref={fileRef} onChange={handleImageChange}/>
                    </Flex>
                    <Flex flexDirection={'column'} pl={{base:0, sm:10, lg:20}} gap={2} mt={{base:0, md:5}} fontSize={{base:'sm', md:'lg'}}>
                        <Flex flexDirection={'row'} gap={2}>
                            <FormControl isRequired w={'50%'}>
                                <FormLabel>First Name</FormLabel>
                                <Input value={userObject.firstName} onChange={(e)=>{setUserObject({...userObject, firstName:e.target.value})}}/>
                            </FormControl>
                            <FormControl isRequired w={'50%'}>
                                <FormLabel>Last Name</FormLabel>
                                <Input value={userObject.lastName} onChange={(e)=>{setUserObject({...userObject, lastName:e.target.value})}}/>
                            </FormControl>                     
                        </Flex>
                        <FormControl isRequired>
                            <FormLabel>Email</FormLabel>
                            <Input value={userObject.email} onChange={(e)=>{setUserObject({...userObject, email:e.target.value})}}/>
                        </FormControl>
                        <FormControl >
                            <FormLabel>Bio</FormLabel>
                            <Textarea value={userObject.bio} onChange={(e)=>{setUserObject({...userObject, bio:e.target.value})}}/>
                        </FormControl>
                    </Flex>
                </Flex>
            </Flex>
            </form>
        </Flex>
    </>
  )
}

export default ProfileEditPage