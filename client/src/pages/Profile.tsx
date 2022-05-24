import { Box, Button, Flex, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { NavBar } from "../components/Nav/NavBar";
import ProfileCard from "../components/Profile/ProfileCard";
import { QuoteGrid } from "../components/Profile/QuoteGrid";
import { ButtonWText } from "../components/Shared/Buttons";
import { get_user_complete, get_user_quotes } from "../fetcher";


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
      retry: (count, err: Error) => err.message !== 'Bad access token',
    });

  const { data: myQuotes } = useQuery(['myQuotes', accessToken],
    () => get_user_quotes(accessToken),
    {
      retry: (count, err: Error) => err.message !== 'Bad access token'
    });

  useEffect(() => {
    if (!accessToken && sessionStorage.getItem("access_token") != null) {
      setAccessToken(sessionStorage.getItem("access_token") || accessToken);
    }
  }, [accessToken]);

  let numQuotes = myQuotes?.length || 0;
  let numLikes = myQuotes?.map((v) => v.likes || 0).reduce((acc, val) => acc + val, 0) || 0;



  const profilePage = (
    <Flex flexDirection={'column'} minH={"100vh"} bg={'gray.300'}>
      <NavBar right={<>
        <Button variant={'link'} as={'a'} href="/">Home</Button>
        <ButtonWText onClick={handleSignOut}>Sign out</ButtonWText>
      </>} addBar={<></>} />

      <Stack direction='row' m={5} spacing={5}>
        <ProfileCard user={user} numQuotes={numQuotes} numLikes={numLikes} />
        <QuoteGrid myQuotes={myQuotes || []} savedQuotes={[]} />

      </Stack>

      <ReactQueryDevtools initialIsOpen={false} />
    </Flex>
  )

  return (user || accessToken) ? profilePage : <Box>404: User not logged in!</Box>
}

export default Profile;