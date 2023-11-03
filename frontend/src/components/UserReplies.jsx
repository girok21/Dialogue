import { useEffect, useState } from 'react'
import axios from 'axios';

const UserReplies = ({UserReplies}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  return (
    <div>UserReplies</div>
  )
}

export default UserReplies