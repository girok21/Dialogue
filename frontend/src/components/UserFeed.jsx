import Post from './Post'
import { useGetUserFeedQuery } from "../slices/userApiSlice";


const UserFeed = ({feedPosts}) => {
  return (
    <>
      {
        feedPosts.map((postObject) => <Post key={postObject._id} author_username={postObject.username} author_name={postObject.author_name} isShare={postObject.isShare} post={postObject.post}/>)
      }
    </>
  )
}

export default UserFeed
