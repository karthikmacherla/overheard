import {
  Button, FormControl,
  FormLabel,
  Input, Modal, ModalBody,
  ModalCloseButton, ModalContent,
  ModalHeader, ModalOverlay, useDisclosure
} from '@chakra-ui/react';
import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import { User } from '../../models';
import { ButtonWText } from '../Shared/Buttons';


function SignupButton(props: { handleSignIn: (u: User, s: string) => void }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <ButtonWText onClick={onOpen}>Sign up!</ButtonWText>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign up!</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel htmlFor='email'>Email</FormLabel>
              <Input id='login-email' type='email' />
              <FormLabel htmlFor='login-password'>Password</FormLabel>
              <Input id='login-password' type='password' />
              {/* <FormLabel htmlFor='login-password-conf'>Confirm Password</FormLabel>
              <Input id='login-password-conf' type='password' /> */}
              <Button colorScheme={'blue'} my={5} leftIcon={<FaGoogle />}>Sign up with Google</Button>
              <br />
              <ButtonWText type='submit' mr={3}>
                Sign up!
              </ButtonWText>
              <Button onClick={onClose}>Cancel</Button>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SignupButton;