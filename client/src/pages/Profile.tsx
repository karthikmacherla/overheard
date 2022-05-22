import { Box, Button, Flex, HStack, Stack, Wrap, WrapItem } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { NavBar } from "../components/Nav/NavBar";
import ProfileCard from "../components/Profile/ProfileCard";
import { QuoteGrid } from "../components/Profile/QuoteGrid";
import { ButtonWText } from "../components/Shared/Buttons";
import { get_user_complete } from "../fetcher";


function Profile() {
  const [accessToken, setAccessToken] = useState('');
  const handleSignOut = () => {
    setAccessToken('');
    sessionStorage.removeItem("access_token");
    // Try to redirect here
  }
  const { data: user } = useQuery(['user', accessToken],
    () => get_user_complete(accessToken),
    {
      retry: (count, err: Error) => err.message !== 'Bad access token'
    });

  useEffect(() => {
    if (!accessToken && sessionStorage.getItem("access_token") != null) {
      setAccessToken(sessionStorage.getItem("access_token") || accessToken);
    }
  }, [accessToken]);

  const profilePage = (
    <Flex flexDirection={'column'} minH={"100vh"} bg={'gray.300'}>
      <NavBar right={<>
        <Button variant={'link'} as={'a'} href="/">Home</Button>
        <ButtonWText onClick={handleSignOut}>Sign out</ButtonWText>
      </>} addBar={<></>} />

      <Stack direction='row' m={5} spacing={5}>
        <ProfileCard />
        <QuoteGrid />

      </Stack>

      <ReactQueryDevtools initialIsOpen={false} />
    </Flex>
  )

  return (user || accessToken) ? profilePage : <Box>404: User not logged in!</Box>
}

export default Profile;