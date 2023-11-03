import { Avatar, Box, Button, Flex, Text, VStack } from "@chakra-ui/react"
import { BsInstagram, BsTwitter } from "react-icons/bs"
import BannerAvatar from "./BannerAvatar"
import { useEffect, useState } from "react";
import { useGetUserRelationshipQuery, usePutUserFollowUnfollowMutation } from "../slices/userApiSlice";
import  useCustomToast  from '../hooks/useCustomToast.js'
const UserHeader = ({currentUser}) => {
    const [ user, setUser ] = useState(null);
    const [ followerCount, setFollowerCount ] = useState(0)
    const { data : relation, isLoading, error } = useGetUserRelationshipQuery(currentUser?._id);
    const [ putUserFollowUnfollow ] = usePutUserFollowUnfollowMutation();
    const { showToast } = useCustomToast();

    useEffect(()=>{
        setUser(currentUser);
        setFollowerCount(currentUser?.followers?.length);
    }, [currentUser]);
    
    const self = relation && relation.self;
    const isFollower = relation && relation.isFollower;
    const [isFollowing, setIsFollowing] = useState(false);
    useEffect(() => {
        // Set isFollowing based on the relation data
        if (relation) {
          setIsFollowing(relation.isFollowing);
        }
    }, [relation]);

    const clickHandler = async (e) => {
      e.preventDefault();
      try {
        if(isFollowing){//if user's following then perform unfollow action
          const res = await putUserFollowUnfollow({username: user.username, action: 'unfollow'});
          setFollowerCount((state)=> state-1)
          showToast(res.data.message);
        }else{//if user's not following then perform follow action
          const res = await putUserFollowUnfollow({username: user.username, action: 'follow'});
          setFollowerCount((state)=> state+1)
          showToast(res.data.message, 'success');
        }
        setIsFollowing(!isFollowing);
      } catch (error) {
        showToast(error.message, 'error')
      }
    }

    if(!user){
        return <div>Loading...</div>
    }
    else return (
    <VStack spacing={{base:1, md:4, lg:5}} alignItems={'start'}>
        <BannerAvatar bannerLink={user?.coverPicture}
            avatarLink = {user?.profilePicture || "/default-profile.jpg"}
        />
        <Flex flexDirection={'row-reverse'} w={'full'} pb={2}>
            <Flex gap={2} alignItems={"center"} fontSize={{base:'sm',md:'md', lg:'lg'}}>
                <Text color={"gray.light"}>{formatFollowerCount(followerCount)} {user?.followers?.length===1?"follower":"followers"}</Text>
                <Box w='0.5' h='6' bg={"gray.light"} borderRadius={"full"}></Box>
                <Text color={"gray.light"}>{formatFollowerCount(user?.following?.length)} following</Text>
            </Flex>
        </Flex>
        <Flex 
            flexDirection={'row'}
            justifyContent={'space-between'}
            w={'full'}
            pr={5}
        >
            <Flex flexDirection={'column'}>
                <Text fontSize={{base:'lg', md:'2xl'}} fontWeight={'bold'}>{user?.firstName} {user?.lastName}</Text>
                <Text fontSize={'sm'} color={'gray.light'}>@{user?.username}</Text>
            </Flex>
            {relation && !self && <Button fontSize={'md'} colorScheme={isFollowing? 'gray' : 'messenger'}
                onClick={clickHandler}
            >
                {isFollowing ? "Unfollow" : `Follow${isFollower? ' back':''}`}
            </Button>}
        </Flex>
        <Text fontSize={"sm"}>{user?.bio}</Text>
    </VStack>
  )
}

export default UserHeader

//format the count values in k's, m's and b's
function formatFollowerCount(count) {
  if (count < 1000) {
    return count.toString();
  } else if (count < 1000000) {
    return (count / 1000).toFixed(1) + 'K';
  } else if (count < 1000000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else {
    return (count / 1000000000).toFixed(1) + 'B';
  }
}