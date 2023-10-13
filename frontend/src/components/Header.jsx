import { Flex, Image, useColorMode } from "@chakra-ui/react"
const Header = () => {

    const{ colorMode, toggleColorMode } = useColorMode()
  return (
    <Flex justifyContent={"center"} mt={8} mb={12}>
        <Image 
            src={colorMode === 'dark' ? '/light-logo-large.svg' : '/dark-logo-large.svg'}
            onClick={toggleColorMode}           
        />
    </Flex>
  )
}

export default Header