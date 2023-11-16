import { Avatar, Divider, Flex, Text } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";

const Notification = ({notification}) => {

    const navigate = useNavigate()

    const notificationType = {
        "post_liked": 'Liked your post',
        "user_following": 'Followed you',
        
    }

  return (
    <>
        <Flex 
            gap={1} cursor={'pointer'}
            w={'full'} p={3}  
            onClick={()=>{
                navigate(notification?.post? `/user/${notification?.relatedUser?.username}/post/${notification?.post}` : `/user/${notification?.relatedUser?.username}`)
            }}
        >
            <Avatar 
                key={notification?._id}
                name={notification?.relatedUser.firstName}
                src={notification?.relatedUser.profilePicture || "/default-profile.jpg"}
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
                    onClick={(e)=>{e.stopPropagation(); navigate(`/user/${notification?.relatedUser?.username}`)}} 
                >
                    {notification?.relatedUser.username}
                </Text>
                <Text fontSize={{base:'sm', md:'md'}}>
                    {notification?.type}
                </Text>
            </Flex>
        </Flex>
        <Divider />
    </>
  )
}

export default Notification