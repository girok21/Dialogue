import { Flex, Text } from "@chakra-ui/react"

const NavBar = () => {
  return (
    <>
        <Flex
            h={"full"}
            position={"absolute"}
            left={0}
            top={0}
            mx={10}
            cursor={"pointer"}
        >
            <Text>Home</Text>
        </Flex>
    </>
  )
}

export default NavBar