import {
  Button, FormControl,
  FormErrorMessage,
  FormLabel,
  Input, Modal, ModalBody,
  ModalCloseButton, ModalContent,
  ModalHeader, ModalOverlay, useDisclosure
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { getuser, signup } from '../../fetcher';
import { User } from '../../models';
import { ButtonWText } from '../Shared/Buttons';


function SignupButton(props: { handleSignIn: (u: User, s: string) => void }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [error, setError] = useState('');

  const onSubmit = async (event: any) => {
    event.preventDefault();
    let user = event.target.email.value;
    let name = event.target.name.value;
    let pass = event.target.password.value;
    let confpass = event.target.confpassword.value;

    if (pass !== confpass) {
      setError("Passwords do not match!");
    }

    let res = await signup(user, name, pass).then(res => res.json());
    if (res.detail) {
      setError("Cannot create account with the following username and password");
    } else {
      let user = await getuser(res.access_token).then(res => res.json());
      props.handleSignIn(user, res.access_token);
      handleExit();
    }
  }

  const handleExit = () => {
    setError("");
    onClose();
  }

  return (
    <>
      <ButtonWText onClick={onOpen}>Sign up!</ButtonWText>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign up!</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={onSubmit}>
              <FormControl isRequired isInvalid={error !== ''}>
                <FormLabel htmlFor='email'>Email</FormLabel>
                <Input id='login-email' type='email' name='email' />
                <FormLabel htmlFor='name'>Name</FormLabel>
                <Input id='name' type='text' name='name' />
                <FormLabel htmlFor='login-password'>Password</FormLabel>
                <Input id='login-password' type='password' name='password' />
                <FormLabel htmlFor='login-password-conf'>Confirm Password</FormLabel>
                <Input id='login-password-conf' type='password' name='confpassword' />
                <FormErrorMessage>{error}</FormErrorMessage>
                <Button colorScheme={'blue'} my={5} leftIcon={<FaGoogle />}>Sign up with Google</Button>
                <br />
                <ButtonWText type='submit' mr={3}>
                  Sign up!
                </ButtonWText>
                <Button onClick={handleExit}>Cancel</Button>
              </FormControl>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SignupButton;