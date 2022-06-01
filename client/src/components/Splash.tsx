// import Head from 'next/head';
import {
  Box, Container, Heading, Stack, Text
} from '@chakra-ui/react';
import LoginButton from './Auth/Login';
import SignupButton from './Auth/Signup';

export default function Splash(props: { handleSignIn: (access_token: string) => void }) {
  return (
    <>

      <Container maxW={'4xl'}>
        <Stack
          as={Box}
          textAlign={'center'}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}>
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}>
            Welcome to <br /> Over
            <Text as={'span'} color={'red.400'}>
              heard
            </Text>
          </Heading>
          <Text color={'gray.500'}>
            See what people are saying anonmyously around the
            world and in your local communities.
          </Text>
          <Stack
            direction={'column'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}>
            <SignupButton handleSignIn={props.handleSignIn} />
            <LoginButton handleSignIn={props.handleSignIn} />

          </Stack>
        </Stack>
      </Container>
    </>
  );
}