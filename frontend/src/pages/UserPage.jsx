import UserHeader from "../components/UserHeader"
import Post from "../components/Post"
import { Flex, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import UserPosts from "../components/UserPosts";
import UserReplies from "../components/UserReplies";
import { useParams } from "react-router-dom";
import { useGetUserProfileQuery } from '../slices/userApiSlice.js'

const UserPage = () => {

  const [feedSection, setFeedSection] = useState('dialogues');//feedSection = dialogues / replies
  const [ user, setUser ] = useState(null);
  const [ posts, setPosts ] = useState(null);
  const [ replies, setReplies ] = useState(null);
  const { username } = useParams();
  const { data,  isLoading, error } = useGetUserProfileQuery(username);

  useEffect(() => {
    if (!isLoading && !error && data) {
      setUser(data.user);
      setPosts(data.posts);
      setReplies(data.replies);
    }
  }, [data, isLoading, error]);

  const onClickHandler = (currentSection)=>{
    if(currentSection === feedSection)
      return;
    if(feedSection === 'dialogues')
      setFeedSection('replies');
    else
      setFeedSection('dialogues');
  }

  const activeStyleObject = {
    borderBottom : "1.5px solid white",
    justifyContent : "center",
    cursor : "pointer",
    transition : 'border-color 0.3s ease-in-out, border-width 0.3s ease-in-out'
  }

  const passiveStyleObject = {
    borderBottom : "1px solid gray",
    justifyContent : "center",
    color : "gray.light",
    cursor : "pointer"
  }

  return (
    <>
      {isLoading && user? (<div>Loading...</div>) :error ? (<div>{ error }</div>) :
      (<>
        <UserHeader currentUser={user}/>
        <Flex w={"full"} p={5}>
              <Flex flex={1} style={feedSection==="dialogues"?activeStyleObject : passiveStyleObject} h={"10"} onClick={()=>onClickHandler("dialogues")}>
                  <Text fontWeight={"bold"}>Dialogues</Text>
              </Flex>
              <Flex flex={1} style={feedSection==="replies"?activeStyleObject : passiveStyleObject} h={"10"} onClick={()=>onClickHandler("replies")}>
                  <Text fontWeight={"bold"}>Replies</Text>
              </Flex>
          </Flex>
        {(feedSection==="dialogues"?
          <UserPosts posts={posts}/> : <UserReplies repliesList = {replies}/>)
        }
      </>)}
    </>
  )
}

export default UserPage;