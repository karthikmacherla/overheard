import { Button } from "@chakra-ui/react";

function RoundButton(props: any) {
  // const color = useColorModeValue('white', 'white')
  return props.hoverable ?
    (<Button
      rounded={'full'}
      bg={'clear'}
      color={'red.400'}
      transition={'all .3s ease'}
      opacity={0}
      _groupHover={{ opacity: '100%' }}
      _hover={{ bg: 'red.400', color: 'white' }}
      {...props}
    >
      {props.children}
    </Button>) :
    (<Button
      rounded={'full'}
      bg={'clear'}
      color={'red.400'}
      _hover={{ bg: 'red.400', color: 'white' }}
      {...props}>
      {props.children}
    </Button>)
}


function ButtonWText(props: any) {
  return (
    <Button
      display={{ base: 'none', md: 'inline-flex' }}
      fontWeight={600}
      color={'white'}
      bg={'red.400'}
      _hover={{
        bg: 'red.300',
      }}
      {...props}
    >
      {props.children}
    </Button>
  )
}

export { RoundButton, ButtonWText };

