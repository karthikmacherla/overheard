import React, { useState } from 'react';
import {
  Button, FormControl,
  FormErrorMessage,
  FormLabel,
  Input, Modal, ModalBody,
  ModalCloseButton, ModalContent,
  ModalHeader, ModalOverlay, useColorModeValue, useDisclosure
} from '@chakra-ui/react';
import { FaGoogle } from 'react-icons/fa';
import { ButtonWText } from '../Shared/Buttons';
import { google_sign_in, username_sign_in } from '../../fetcher';
import { useGoogleLogin } from '@react-oauth/google';


function LoginButton(props: { handleSignIn: (access_token: string) => void }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [error, setError] = useState('');

  const onSubmit = async (event: any) => {
    event.preventDefault();
    let user = event.target.email.value;
    let pass = event.target.password.value;
    try {
      let res = await username_sign_in(user, pass);
      if (res.error) {
        setError(res.error);
      } else {
        props.handleSignIn(res.access_token);
        handleExit();
      }
    } catch (err: any) {
      setError(err.message);
    }
  }

  const handleExit = () => {
    setError("");
    onClose();
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: tokenResponse => {
      const google_access_token = tokenResponse.access_token;
      google_sign_in(google_access_token)
        .then(res => props.handleSignIn(res.access_token))
        .catch(e => setError(e.message))
    },
  })

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
          <ModalCloseButton onClick={handleExit} />
          <ModalBody pb={6}>
            <form onSubmit={onSubmit} >
              <FormControl isRequired isInvalid={error !== ''} >
                <FormLabel htmlFor='email'>Email</FormLabel>
                <Input id='login-email' type='email' name='email' />
                <FormLabel htmlFor='password'>Password</FormLabel>
                <Input id='login-password' type='password' name='password' />
                <FormErrorMessage>{error}</FormErrorMessage>
                <Button colorScheme={'blue'} my={5} leftIcon={<FaGoogle />} onClick={() => handleGoogleLogin()}>Sign in with Google</Button>
                <br />
                <ButtonWText type='submit' mr={3}>Log In</ButtonWText>
                <Button onClick={handleExit}>Cancel</Button>
              </FormControl>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}






export default LoginButton;