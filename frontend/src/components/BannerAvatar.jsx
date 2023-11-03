import { Avatar, Box, Button, Flex, IconButton, Image } from '@chakra-ui/react'

const BannerAvatar = ({bannerLink, avatarLink, avatarB64String,  isEdit}) => {
  return (
    <>
      <div style={{width:'100%', aspectRatio: '126/45'}}>
          <div style={{width: '100%', aspectRatio: '126/45', overflow:'hidden', background:'gray', borderRadius:'4px'}}>
              <Image w={'full'} src={bannerLink} overflow={'hidden'}/>
          </div>
          <div style={{position:'relative', top:'-60px', left:'10px', width:'fit-content'}}>
              <Avatar name='Bot Josh' 
                      src={avatarB64String || avatarLink} 
                      borderColor='gray.700' 
                      size={{base:'xl', md:'2xl'}} 
                      position={'absolute'}
                      style={{border:'4px solid', zIndex:'1'}}/>
          </div>
      </div>
    </> 
  )
}

export default BannerAvatar
