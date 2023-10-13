import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"
const UserPage = () => {
  return (
    <>
      <UserHeader />
      <UserPost likes={1200} replies={481} postImg="/a96dd-16964938314592-1920.avif" postTitle="Just picked up this sick AWP"/>
      <UserPost likes={400} replies={200} postImg="/hq720.jpg" postTitle="Vibin with my urus knife!"/>
      <UserPost likes={150} replies={50} postTitle="I'm all ready to be deployed to a new map."/>
    </>
  )
}

export default UserPage