import { Avatar, Divider, Flex, Input, InputGroup, InputLeftElement, Stack, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi';
import { useGetUsersBySearchQuery } from '../slices/userApiSlice.js'
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const [ searchString, setSearchString ] = useState('');
  const [users, setUsers] = useState(null);
  const navigate = useNavigate();
  const { data , isLoading, error } = useGetUsersBySearchQuery(searchString);
  const onInputChange = (e)=>{
    setSearchString(e.target.value);
  }
  useEffect(()=>{
    if(data){
      setUsers(data)
    }
  },[data]);
  return (
    <Flex 
      w={'full'}
      gap={3}
      flexDirection={'column'}
    >
      <Stack shadow={'sm'}
              pb={5}
      >
          <InputGroup  >
            <InputLeftElement pointerEvents='none'>
              <FiSearch color='gray.300' size={20} />
            </InputLeftElement>
            <Input onChange={onInputChange} type='tel' placeholder='Search' />
          </InputGroup>
      </Stack>
      {searchString === "" && <>
        <Text fontSize={{base:'sm', md:'md'}} pl={3} pb={5}>People you can follow</Text>
      </>}
      {
      users && !isLoading && (<>
        {users?.map((user) => (
          <React.Fragment key={user._id}>
            <Flex key={user._id} gap={2} 
              cursor={'pointer'}
              onClick={(e)=>{navigate(`/user/${user.username}`)}}
              h={'fit-content'}
              w={'full'}
            >
              <Avatar
                  key={user._id}
                  name={user.firstName}
                  src={user.profilePicture || "/default-profile.jpg"}
                  size={{
                      base: 'sm',
                      md: 'md',
                  }}
                  border={'1px solid black'}
              />
              <Flex
                  flexDirection={'column'}
              >  
                  <Text 
                      fontSize={{base:'sm', md:'md'}} 
                      fontWeight={'semibold'}
                      className='text-underline'  
                  >
                      {user.username}
                  </Text>
                  <Text fontSize={{base:'sm', md:'md'}} color={'gray.500'}>
                      {user.firstName} {user.lastName}
                  </Text>
                  <Text 
                      fontSize={{base:'sm', md:'md'}}
                      mt={2}
                  >
                      {user.followers.length} followers
                  </Text>
              </Flex>
            </Flex>
            <Divider />
          </React.Fragment>
        ))}
      </>)}
    </Flex>
  )
}

export default SearchPage