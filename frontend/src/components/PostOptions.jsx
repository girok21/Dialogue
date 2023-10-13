import { Flex } from "@chakra-ui/react"
import { BiSolidImageAdd } from "react-icons/bi"
import { PiGifFill } from "react-icons/pi"
import {BiPoll} from "react-icons/bi"
import {MdScheduleSend} from "react-icons/md"
import { RiEmojiStickerFill } from "react-icons/ri"

const PostOptions = () => {
  return (
    <>
        <Flex gap={4} cursor={"pointer"}>
            <BiSolidImageAdd size={20}/>
            <PiGifFill size={20}/>
            <RiEmojiStickerFill size={20}/>
            <BiPoll size={20} />
            <MdScheduleSend size={20}/>
        </Flex>
    </>
  )
}

export default PostOptions