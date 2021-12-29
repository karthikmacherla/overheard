import { Button } from "@chakra-ui/react";


function LoggedInNav() {
  return (
    <Button
      display={{ base: 'none', md: 'inline-flex' }}
      fontSize={'sm'}
      fontWeight={600}
      color={'white'}
      bg={'red.400'}
      href={'#'}
      _hover={{
        bg: 'red.300',
      }}>
      Sign Out
    </Button>
  )
}

export default LoggedInNav;