import { Button } from "@chakra-ui/react";

function RoundButton(props: {
  handle?: () => void,
  children: React.ReactNode,
  hoverable?: boolean
}) {
  return props.hoverable ?
    (<Button
      h={10}
      w={10}
      transition={'all .3s ease'}
      opacity={0}
      _groupHover={{ opacity: '100%' }}
      rounded={'full'}
      bg={'red.400'}
      color={'white'}
      onClick={props.handle}>
      {props.children}
    </Button>) :
    (<Button
      h={10}
      w={10}
      rounded={'full'}
      bg={'red.400'}
      color={'white'}
      onClick={props.handle}>
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

