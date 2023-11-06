import { RiEmojiStickerFill } from "react-icons/ri";
import { useState } from "react";
import emojiData from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Flex, useColorMode } from "@chakra-ui/react";

const EmojiPickerIcon = ({handleEmojiSelect}) => {
  const [isEmojiPickerActive, setIsEmojiPickerActive] = useState(false)
  const{ colorMode } = useColorMode();

  return (
    <>
      <RiEmojiStickerFill
        cursor={'pointer'}
        size={20} onClick={()=>{
        setIsEmojiPickerActive(!isEmojiPickerActive)}
      }/>
      { isEmojiPickerActive && 
          <>
          <Flex position={'absolute'} zIndex={3}>
              <Flex position={'absolute'} top={'6'}>
                  <Picker 
                      data={emojiData}
                      onEmojiSelect={handleEmojiSelect}
                      theme={colorMode}
                  />
              </Flex>
          </Flex>
      </>
      }
    </>
  );
};

export default EmojiPickerIcon;