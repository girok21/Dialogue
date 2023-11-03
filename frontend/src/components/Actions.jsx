import { Avatar, Box, Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useDisclosure } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useCustomToast from "../hooks/useCustomToast";
import { useLikePostMutation, usePostPostCommentMutation } from "../slices/postApiSlice";


const Actions = ({post, authorName}) => {

  const [liked, setLiked] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [likesCount, setLikesCount] = useState(0);
  const {showToast} = useCustomToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ postPostComment ] = usePostPostCommentMutation();

  const [ likePost ] = useLikePostMutation();

  const navigate = useNavigate();
  const { userInfo } = useSelector((state)=>state.auth)

  useEffect(()=>{
    if(userInfo && post){
      const postLiked = post.likes.indexOf(userInfo._id) === -1? false : true;
      setLikesCount(postLiked? post.likes.length - 1 : post.likes.length);//we will negate 1 like, or else it will count current user's like twice
      setLiked(postLiked);
    }
  }, [userInfo, post])
  const handleLikeAndUnlike = async(e)=>{
    e.preventDefault();
    if(!userInfo){
      showToast('You must be logged in!', 'info');
    }else{
      try {
        const res = await likePost(post._id);
        if(res.data.message === 'liked')
          showToast("Post Liked", 'success');
        else
          showToast("Post Disliked", 'info');
        setLiked(!liked);
      } catch (error) {
          showToast(error.message, 'error');
      }     
    }
  }

  const onReplyTextChange = (e) => {
    setReplyText(e.target.value);
  }

  const postReplyClickHandler = async()=>{
    try {
      const res = await postPostComment({text: replyText, postId: post._id});
      showToast('Comment Posted!', 'success');
    } catch (error) {
      showToast('Oops! Something went wrong...', 'error');
    }
    onClose();
  }

  // const handleCommentClick = async(e)=>{
  //   e.preventDefault();
  //   setIsReplying(true);
  // }

  return (
    <Flex flexDirection={'column'}>
      <Flex gap={0} my={2} cursor={"pointer"}>
          <Box className="icon-container">
            <LikeSVG liked={liked} handleLikeAndUnlike={handleLikeAndUnlike}/>
          </Box>
          <Box className="icon-container" onClick={(e)=>{e.preventDefault(); onOpen();}}>
            <CommentSVG />
            <Modal w isCentered isOpen={isOpen} onClose={onClose} motionPreset='slideInBottom'>
              <ModalOverlay />
              <ModalContent minW={{base: 0, md: 500}}>
                <ModalHeader></ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                <Flex gap={1} w={'full'}>
                  <Avatar 
                    key={userInfo?._id}
                    name={userInfo?.firstName}
                    src={userInfo?.profilePicture || "/default-profile.jpg"}
                    size={{
                        base: 'md',
                        md: 'lg',
                    }}
                    border={'1px solid black'}
                  />
                  <Flex flexDirection={'column'} w={'full'}>
                    <Text fontSize={{base:'xs', md:'md'}} fontWeight={"bold"}>
                      @{userInfo?.username}
                    </Text>
                    <Textarea
                        fontSize={{base:'xs', md:'md'}}
                        ml={1}
                        w={'full'}
                        minH={15}
                        maxH={40}
                        placeholder={`Reply to ${authorName}...`}
                        variant={"unstyled"}
                        onChange={onReplyTextChange}
                    />
                  </Flex>
                </Flex>
                </ModalBody>

                <ModalFooter>
                  <Button borderRadius={"full"} colorScheme="gray" onClick={postReplyClickHandler}>Post</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
          <Box className="icon-container">
            <RepostSVG />
          </Box>
          <Box className="icon-container">
            <ShareSVG />
          </Box>
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize='sm'>{post?.comments.length || 0} replies</Text>
        <Box w={0.5} h={0.5} borderRadius={'full'} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize='sm'>{ liked? likesCount + 1 : likesCount } likes</Text>
      </Flex>
    </Flex>
  )
}

export default Actions

const LikeSVG = ({handleLikeAndUnlike, liked}) => {
  return (
    <svg aria-label="Like" color={liked? "rgb(237, 73, 86)": "currentColor"} fill={liked? "rgb(237, 73, 86)": "transparent"} height="19" role="img" viewBox="0 0 24 22" width="20" onClick={handleLikeAndUnlike}>
      <path d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z" stroke="currentColor" strokeWidth="2"></path>
    </svg>
  )
}

const ShareSVG = () => {
  return (
    <svg aria-label="Share" color="currentColor" fill="rgb(243, 245, 247)" height="20" role="img" viewBox="0 0 24 24" width="20"><title>Share</title><line fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" x1="22" x2="9.218" y1="3" y2="10.083"></line><polygon fill="none" points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></polygon></svg>          
  )
}

const CommentSVG = () => {
  return (
    <svg aria-label="Comment" color="currentColor" fill="rgb(243, 245, 247)" height="20" role="img" viewBox="0 0 24 24" width="20" >
      <title>Comment</title>
      <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
    </svg>          
  )
}

const RepostSVG = () => {
  return (
    <svg aria-label="Repost" color="currentColor" fill="rgb(243, 245, 247)" height="20" role="img" viewBox="0 0 24 24" width="20"><title>Repost</title><path d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z" fill="currentColor" stroke="currentColor" strokeLinejoin="round" strokeWidth="0.2"></path></svg>
  )
}