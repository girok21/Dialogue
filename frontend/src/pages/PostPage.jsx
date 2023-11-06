import { useParams } from "react-router-dom";
import { useGetPostByIdQuery } from "../slices/postApiSlice";
import Post from "../components/Post";
import PostComments from "../components/PostComments";
import { Flex } from "@chakra-ui/react";

const PostPage = () => {
  const {postId} = useParams();
  const { data, isLoading, error } = useGetPostByIdQuery(postId);
  if(isLoading){
    return(
      <div>Loading...</div>
    )
  }
  if(error){
    return(
      <div>{error?.message}</div>
    )
  }
  return (
    <Flex
      gap={2}
      flexDirection={'column'}
    >
      <Post post={data.post} isShare={false} isPostPage/>
      <PostComments comments={data.post.comments}/>
    </Flex>
  )
}

export default PostPage