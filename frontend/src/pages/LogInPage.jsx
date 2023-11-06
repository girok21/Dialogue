import { Box, Button, Divider, Flex, Input, Text, useToast } from '@chakra-ui/react';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/userApiSlice.js';
import { setCredentials } from '../slices/authSlice.js';

const LogInPage = () => {

  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ login, {isLoading}] = useLoginMutation();

  const { userInfo } = useSelector((state)=> state.auth)
  const toast = useToast();
  
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';
  
  useEffect(()=>{
    if(userInfo){
      navigate(redirect);
    }
  },[redirect, userInfo])
  
  const submitHandler = async(e)=>{
    e.preventDefault();
    try {
      const res = await login({userid, password}).unwrap();//returns a promise so unwrap can reolve the returned promise
      dispatch(setCredentials({...res}));
      navigate(redirect)
    } catch (error) {
      toast({
        title: error.data,
        description: error?.data?.message || error?.error,
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  return (
    <>
      <Flex justifyContent={'center'} direction={'column'} alignItems={'center'} gap={5}>
        <Text fontSize={'md'} fontWeight={'bold'}>Log in to your account</Text>
        <Divider bg={'gray.light'}/>
        <Flex w={'full'} 
          justifyContent={"center"}
        >
          <form
            onSubmit={submitHandler}
            id='login-form'
          >
            <Input 
              defaultValue={userid}
              placeholder='Username or Email'
              type='string'
              minH={18}
              px={3}
              pt={6}
              pb={7}
              w={350}
              fontSize={'sm'}
              border={'0.5px solid'}
              borderRadius={'0.5rem'}
              onChange={(e)=>{setUserid(e.target.value)}}
            />
            <Input 
              defaultValue={password}
              placeholder='Password'
              type='password'
              minH={18}
              px={3}
              pt={6}
              pb={7}
              w={350}
              fontSize={'sm'}
              border={'0.5px solid'}
              borderRadius={'0.5rem'}
              onChange={(e)=>{setPassword(e.target.value)}}
            />
            <Button 
            minH={18}
            px={3}
            pt={6}
            pb={7}
            w={350}
            fontSize={'sm'}
            background={'gray'}
            type='submit'
          >
            Log in
          </Button>
          </form>
        </Flex>
        <Flex w={'100%'} direction={'row'} alignItems={'center'} justifyContent={'space-around'}>
          <Box w="47%" h={"1px"} bg="gray.light" mt={1}></Box>
            <Text>or</Text>
          <Box w={"47%"} h={"1px"} bg="gray.light" mt={1}></Box>
        </Flex>
        <Button 
          minH={18}
          px={3}
          pt={6}
          pb={7}
          w={350}
          fontSize={'sm'}
          m={2}
          colorScheme={'telegram'}
          onClick={(e)=>{e.preventDefault(); navigate('/auth/signup')}}
        >
          Create account
        </Button>
      </Flex>
    </>
  )
}

export default LogInPage;