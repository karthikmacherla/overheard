import {
  Button, FormControl,
  FormErrorMessage,
  FormLabel,
  Input, Modal, ModalBody,
  ModalCloseButton, ModalContent,
  ModalHeader, ModalOverlay, useDisclosure
} from '@chakra-ui/react';
import { useGoogleLogin } from '@react-oauth/google';
import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { google_sign_in, signup } from '../../fetcher';
import { ButtonWText } from '../Shared/Buttons';


function SignupButton(props: { handleSignIn: (access_token: string) => void }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [error, setError] = useState('');

  const onSubmit = async (event: any) => {
    event.preventDefault();
    let email = event.target.email.value;
    let name = event.target.name.value;
    let pass = event.target.password.value;
    let confpass = event.target.confpassword.value;

    if (pass !== confpass) {
      setError("Passwords do not match!");
      return;
    }

    try {
      let res = await signup(email, name, pass).then(res => res.json());
      props.handleSignIn(res.access_token);
      handleExit();
    } catch (error: any) {
      setError(error.message);
    }
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: tokenResponse => {
      const google_access_token = tokenResponse.access_token;
      google_sign_in(google_access_token)
        .then(res => props.handleSignIn(res.access_token))
        .catch(e => setError(e.message))
    },
  })

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
                <Button colorScheme={'blue'} my={5} leftIcon={<FaGoogle />} onClick={() => handleGoogleLogin()}>Sign up with Google</Button>
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