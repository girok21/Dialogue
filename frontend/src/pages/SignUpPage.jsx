import { Divider, Flex, Input, InputGroup, InputRightAddon, useToast, Text, Button, InputRightElement } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from "react-router-dom";
import { useRegisterMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";

const SignUpPage = () => {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const { userInfo } = useSelector((state) => state.auth) 
  const [ register, {isLoading} ] = useRegisterMutation();
  const toast = useToast();
  
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if(userInfo){
      navigate(redirect);
    }
  }, [userInfo, redirect])

  const submitHandler = async(e)=>{
    e.preventDefault();
    if(!email || !password || !passwordConfirmation || !firstName || !lastName || !username){
      toast({
        title: "All fields are required",
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
      return;
    }else if(password !== passwordConfirmation){
      toast({
        title: "Confirm password do not match",
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
      return;
    }else if(password.length < 5){
      toast({
        title: "Password's weak(atleast 5 characters)",
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
      return;
    }
      try {
        const res = await register({
          email,
          firstName,
          lastName,
          username,
          password
        });
        dispatch(setCredentials({...res.data}));
        if(res.error){
          throw new Error(res.error)
        }
        if(!res.error)
        navigate(redirect);
      } catch (error) {
        return toast({
          title: error.data,
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
      }
  }

  return (
    <>
      <Flex w={'full'}
        flexDirection={"column"}
        gap={3}
      >
        <Text
          fontSize={"2xl"}
          fontWeight={"bold"}
          px={5}
        >
          Sign Up
          {/* <Text
          fontSize={"sm"}
          fontWeight={"light"}
          >
            It's quick and easy
          </Text> */}
        </Text>
        <Divider bg={"gray.light"} />
        <Flex w={'full'}
          justifyContent={'center'}
        >
          <form id="signup-form" onSubmit={submitHandler}>
            {/* Full name Section */}
            <Flex w={'100%'}
              flexDirection={'row'}
              gap={3}
            >
              <Input 
                placeholder="First Name"
                type="text"
                minH={18}
                px={3}
                pt={6}
                pb={7}
                w={"50%"}
                fontSize={'sm'}
                border={'0.5px solid'}
                borderRadius={'0.5rem'}
                overflow={'hidden'}
                onChange={(e)=>setFirstName(e.target.value)}
              />
              <Input 
                placeholder="Last Name"
                type="text"
                minH={18}
                px={3}
                pt={6}
                pb={7}
                w={"50%"}
                fontSize={'sm'}
                border={'0.5px solid'}
                borderRadius={'0.5rem'}
                overflow={'hidden'}
                onChange={(e)=>setLastName(e.target.value)}
              />
            </Flex>
            <Input 
              defaultValue={email}
              placeholder='Email Address'
              type='email'
              minH={18}
              px={3}
              pt={6}
              pb={7}
              w={'100%'}
              fontSize={'sm'}
              border={'0.5px solid'}
              borderRadius={'0.5rem'}
              onChange={(e)=>{setEmail(e.target.value)}}
            />
            <Input 
              defaultValue={username}
              placeholder='Enter username'
              type='text'
              minH={18}
              px={3}
              pt={6}
              pb={7}
              w={'100%'}
              fontSize={'sm'}
              border={'0.5px solid'}
              borderRadius={'0.5rem'}
              onChange={(e)=>{setUsername(e.target.value)}}
            />
            <InputGroup>
            <Input 
              defaultValue={password}
              placeholder='New Password'
              type={showPassword? 'text':'password'}
              minH={18}
              px={3}
              pt={6}
              pb={7}
              w={"100%"}
              fontSize={'sm'}
              border={'0.5px solid'}
              borderRadius={'0.5rem'}
              onChange={(e)=>{setPassword(e.target.value)}}
            />
            <InputRightElement width='4.5rem' h={"100%"}>
              <Button size='md' p={0} borderRadius={"50%"} onClick={()=>{setShowPassword(!showPassword)}}>
                {showPassword?<BsFillEyeFill/> : <BsFillEyeSlashFill/>}
              </Button>
            </InputRightElement>
            </InputGroup>
            <InputGroup>
              <Input 
                defaultValue={passwordConfirmation}
                placeholder='Confirm Password'
                type={showPasswordConfirmation? 'text':'password'}
                minH={18}
                px={3}
                pt={6}
                pb={7}
                w={"100%"}
                fontSize={'sm'}
                border={'0.5px solid'}
                borderRadius={'0.5rem'}
                onChange={(e)=>{setPasswordConfirmation(e.target.value)}}
                />
              <InputRightElement width='4.5rem' h={"100%"}>
                <Button size='md' p={0} borderRadius={"50%"} onClick={()=>{setShowPasswordConfirmation(!showPasswordConfirmation)}}>
                  {showPasswordConfirmation?<BsFillEyeFill/> : <BsFillEyeSlashFill/>}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Button 
              minH={18}
              px={3}
              pt={6}
              pb={7}
              w={350}
              fontSize={'md'}
              m={2}
              colorScheme={'purple'}
              mx={'auto'}
              type="submit"
            >
              Create Account
            </Button>
          </form>
        </Flex>
        <Divider bg={'gray.light'} />
        <Flex 
          flexDirection={'column'}
          alignItems={'center'}
          gap={2}
        >
          <Text
            fontSize={'sm'}
          >
            Already have an account?
          </Text>
          <Button 
            minH={18}
            px={3}
            pt={6}
            pb={7}
            w={350}
            fontSize={'sm'}
            colorScheme={'telegram'}
            onClick={()=>{navigate('/auth/login')}}
            >
            Log in
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

export default SignUpPage