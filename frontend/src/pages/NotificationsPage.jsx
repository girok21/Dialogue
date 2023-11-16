import { useEffect, useState } from 'react'
import {useGetNotificationsQuery} from '../slices/userApiSlice.js';
import Notification from '../components/Notification.jsx';

const NotificationsPage = () => {

  const { data, isLoading, error } = useGetNotificationsQuery();
  const [ notifications, setNotifications ] = useState(null)

  useEffect(()=>{
    if(data?.notifications){
      setNotifications(data?.notifications);
    }
  },[data])

  if(isLoading){
    return <div>Loading...</div>
  }
  if(error){
    if(error.message)
      return <div>{error.message}</div>
    else{
      return <div>Internal Server Wrong</div>
    }
  }
  if(notifications?.length === 0){
    return <div>No notifications</div>
  }
  return (
    <>
      {!isLoading && notifications?.map((notification)=>(
        <Notification key={notification._id} notification={notification}/>
      ))}
    </>
  )
}

export default NotificationsPage