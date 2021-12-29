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

export default RoundButton;