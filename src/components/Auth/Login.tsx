import {
  Button, FormControl,
  FormLabel,
  Input, Modal, ModalBody,
  ModalCloseButton, ModalContent,
  ModalHeader, ModalOverlay, useColorModeValue, useDisclosure
} from '@chakra-ui/react';
import { FaGoogle } from 'react-icons/fa';
import { ButtonWText } from '../Shared/Buttons';


function LoginButton() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button
        variant={'link'}
        p={2}
        onClick={onOpen}
        fontSize={'sm'}
        fontWeight={500}
        color={useColorModeValue('gray.600', 'gray.200')}
        _hover={{
          textDecoration: 'none',
          color: useColorModeValue('red.300', 'white'),
        }}>
        Sign In
      </Button>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign in</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel htmlFor='email'>Email</FormLabel>
              <Input id='login-email' type='email' />
              <FormLabel htmlFor='password'>Password</FormLabel>
              <Input id='login-password' type='password' />
              <Button colorScheme={'blue'} my={5} leftIcon={<FaGoogle />}>Sign in with Google</Button>
              <br />
              <ButtonWText type='submit' mr={3}>
                Log In
              </ButtonWText>
              <Button onClick={onClose}>Cancel</Button>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default LoginButton;