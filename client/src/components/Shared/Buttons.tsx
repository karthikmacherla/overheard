import { IconProps } from "@chakra-ui/icons";
import { Button, Icon } from "@chakra-ui/react";

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

interface ClearButtonProps extends IconProps {
  handle: () => void;
}

function ClearButton(props: any) {
  return (
    <Icon
      transition={'all .3s ease'}
      opacity={0}
      _groupHover={{ opacity: '100%' }}
      color={'red.400'}
      w={8}
      h={8}
      {...props} />
  )
}


function ButtonWText(props: any) {
  return (
    <Button
      display={{ md: 'inline-flex' }}
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

export { RoundButton, ButtonWText, ClearButton };
export type { ClearButtonProps };

