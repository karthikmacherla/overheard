import { Center, Flex } from "@chakra-ui/react";
import { useQueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useParams } from "react-router-dom";
import CommentCard from "../components/Comment/CommentCard";
import { AddBar, LoggedInNav, NavBar, SplashNav } from "../components/Nav/NavBar";
import QuoteCardLarge from "../components/Quote/QuoteCardLarge";
import { User } from "../models";



export default function QuotePage() {
  const groupIdx = -1;
  const user = 0;
  const handleSignIn = () => { };
  const handleSignOut = handleSignIn;
  const { id } = useParams();
  const quote_id = Number(id);

  const accessToken = sessionStorage.getItem('access_token') || '';
  const queryClient = useQueryClient();
  const currUser = queryClient.getQueryData<User>(['user', accessToken]);

  const commentCard = <CommentCard
    quoteId={quote_id}
    prof_name={currUser?.name}
    prof_pic_src={currUser?.profile_pic_url}
  />

  return (
    <Flex flexDirection={'column'} minH={"100vh"} bg={'gray.300'}>
      <NavBar right={user ?
        <LoggedInNav handleSignOut={handleSignOut} /> : <SplashNav handleSignIn={handleSignIn} />}
        addBar={user ?
          <AddBar groups={[]} group_idx={groupIdx} /> : <></>
        } />
      <Flex flexDirection={'column'} alignItems={'center'} flex={1} mt={5} mb={5}>
        <Center w={"95%"}>
          <QuoteCardLarge quote_id={quote_id} firstQuote={true} lastQuote={true}
            commentCard={commentCard} />
        </Center>
      </Flex>
      <ReactQueryDevtools initialIsOpen={false} />
    </Flex>
  );
}