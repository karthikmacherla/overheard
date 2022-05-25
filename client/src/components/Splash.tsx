// import Head from 'next/head';
import {
  Box,
  Heading,
  Container,
  Text,
  Stack,
} from '@chakra-ui/react';
import { User } from '../models';
import LoginButton from './Auth/Login';
import SignupButton from './Auth/Signup';

export default function Splash(props: { handleSignIn: (user: User, access_token: string) => void }) {
  return (
    <>
      {/* <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap"
          rel="stylesheet"
        />
      </Head> */}

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