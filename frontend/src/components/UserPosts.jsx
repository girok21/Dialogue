import { Box, Text } from '@chakra-ui/react'
import Post from './Post';
import { useGetPostsQuery } from '../slices/postApiSlice.js';


//show posts which are posted or reshared by the user
const UserFeed = ({posts}) => {
  if (!posts) {
    return (
      <Box width={'full'}>
        <Text fontSize={'2xl'}>Loading...</Text>
      </Box>
    );
  }

  if (posts.length === 0) {
    return (
      <Box width={'full'}>
        <Text fontSize={'2xl'}>No dialogues from user yet!!!</Text>
      </Box>
    );
  }
  return (
    <>
      {posts.map((post) => <Post key={post._id} post={post}/>)}
    </>
)}


export default UserFeed