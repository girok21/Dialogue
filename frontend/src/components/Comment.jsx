import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { useState } from "react"
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { useGetPostCommentQuery } from "../slices/postApiSlice";

const Comment = ({commentId}) => {

    const { data, isLoading, error } = useGetPostCommentQuery(commentId);
    if(isLoading)
        return(
            <div>Loading...</div>    
        )
    if(error)
        return(
            <div>{error.message}</div>
        )
    return (
    <>
        <Flex gap={4} py={2} my={2} w={"full"}>
            <Avatar src={data?.profilePicture || "/default-profile.jpg"} size={{base:'sm', md:'md'}} zIndex={-2}/>
            <Flex gap={1} w={"full"} flexDirection={"column"}>
                <Flex justifyContent={"space-between"}>
                    <Text fontSize={"sm"} fontWeight={"bold"}>
                        {data?.firstName} {data?.lastName}
                    </Text>
                    <Flex alignItems={"center"} gap={2}>
                        <Text fontSize={"sm"} color={"gray.light"}>1d</Text>
                        <BsThreeDots />
                    </Flex>

                </Flex>
                <Text>{data?.text}</Text>
                {/* <Actions liked={liked} setLiked={setLiked} /> */}
                {/* <Text fontSize={"sm"} color={"gray.light"}>
                    {likes + (liked ? 1 : 0)} likes
                </Text> */}
            </Flex>
        </Flex>
    </>
  )
}

export default Comment