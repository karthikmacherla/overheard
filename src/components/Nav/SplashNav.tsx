import { Button, useColorModeValue } from '@chakra-ui/react';

function SplashNav() {
  return (
    <>
      <Button
        variant={'link'}
        p={2}
        href={'/signin'}
        fontSize={'sm'}
        fontWeight={500}
        color={useColorModeValue('gray.600', 'gray.200')}
        _hover={{
          textDecoration: 'none',
          color: useColorModeValue('red.300', 'white'),
        }}>
        Sign In
      </Button>
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
        Sign Up
      </Button>
    </>
  )
}

export default SplashNav;