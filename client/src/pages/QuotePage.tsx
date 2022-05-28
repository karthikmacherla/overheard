import { Box, Center, Flex } from "@chakra-ui/react";
import { ReactQueryDevtools } from "react-query/devtools";
import { useParams } from "react-router-dom";
import { AddBar, LoggedInNav, NavBar, SplashNav } from "../components/Nav/NavBar";
import QuoteCardLarge from "../components/Quote/QuoteCardLarge";



export default function QuotePage() {
  const groupIdx = -1;
  const user = 0;
  const handleSignIn = () => { };
  const handleSignOut = handleSignIn;
  const { id } = useParams();
  const quote_id = Number(id);

  return (
    <Flex flexDirection={'column'} minH={"100vh"} bg={'gray.300'}>
      <NavBar right={user ?
        <LoggedInNav handleSignOut={handleSignOut} /> : <SplashNav handleSignIn={handleSignIn} />}
        addBar={user ?
          <AddBar groups={[]} group_idx={groupIdx} /> : <></>
        } />
      <Flex flexDirection={'column'} alignItems={'center'} flex={1} mt={5} mb={5}>
        <Center w={"95%"}>
          <QuoteCardLarge quote_id={quote_id} firstQuote={true} lastQuote={true} />
        </Center>
      </Flex>
      <ReactQueryDevtools initialIsOpen={false} />
    </Flex>
  );
}