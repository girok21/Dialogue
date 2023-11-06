import { Divider } from '@chakra-ui/react'
import React from 'react'
import Comment from './Comment'

const PostComments = ({comments}) => {

    if(comments.length === 0){
        return (
            <div>No comments</div>
        )
    }

    return (
        <>
            {comments.map((comment)=>(
                <React.Fragment key={comment._id}>
                    <Divider/>
                    <Comment key={comment._id} commentId={comment._id}/>
                </React.Fragment>
            ))}
        </>
    )
}

export default PostComments