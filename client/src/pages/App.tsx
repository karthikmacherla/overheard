import { Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import CommentCard from '../components/Comment/CommentCard';
import GroupButton from '../components/Group/GroupButton';
import GroupTab from '../components/GroupTab';
import { AddBar, LoggedInNav, NavBar, SplashNav } from '../components/Nav/NavBar';
import QuoteCardLarge from '../components/Quote/QuoteCardLarge';
import Splash from '../components/Splash';
import { get_group_quotes, get_user_complete, get_user_groups } from '../fetcher';

function App() {
  const [accessToken, setAccessToken] = useState('')
  const [groupId, setGroupId] = useState<number>(-1);
  const { data: user, isLoading: isLoadingUser } = useQuery(['user', accessToken],
    () => get_user_complete(accessToken),
    {
      retry: false
    });

  // Don't retry/enable if token is bad
  const validUser = user !== undefined;
  const { data: groups, isLoading: isLoadingGroup } = useQuery(['groups', accessToken],
    () => get_user_groups(accessToken),
    {
      enabled: validUser,
      onSuccess: (data) => {
        if (data.length > 0 && groupId === -1)
          setGroupId(data[0].id)
      },
    })

  const [quoteIdx, setQuoteIdx] = useState(0);
  const { data: quotes } = useQuery(['quotes', accessToken, groupId],
    () => get_group_quotes(groupId, accessToken),
    {
      enabled: groups && groupId !== -1,
      refetchInterval: 1000
    })

  useEffect(() => {
    if (!accessToken && sessionStorage.getItem("access_token") != null) {
      setAccessToken(sessionStorage.getItem("access_token") || accessToken);
    }
  }, [accessToken]);

  const handleSignIn = (access_token: string) => {
    sessionStorage.setItem("access_token", access_token);
    setAccessToken(access_token);
  }

  const handleSignOut = () => {
    setAccessToken('');
    sessionStorage.removeItem("access_token");
  }
  const prevQuoteSlide = () => {
    if (quoteIdx > 0) {
      setQuoteIdx(quoteIdx - 1);
    }
  }

  const nextQuoteSlide = () => {
    if (quoteIdx < (quotes ? quotes.length - 1 : 0)) {
      setQuoteIdx(quoteIdx + 1);
    }
  }

  const quoteId = quotes && quoteIdx < quotes.length ? quotes[quoteIdx].id : -1;
  const commentCard = <CommentCard quoteId={quoteId}
    prof_name={user?.name}
    prof_pic_src={user?.profile_pic_url} />


  // App has three components
  // 1. Group, Quote, Splash
  const probsUser = sessionStorage.getItem("access_token") !== null;

  const splash = <Splash handleSignIn={handleSignIn} />;
  const loading = <Flex flexDirection={'column'} minH={"100vh"} bg={'gray.300'}>
    <NavBar right={<LoggedInNav handleSignOut={() => { }} />}
      addBar={<></>} />
    <Flex flexDirection={'row'} alignItems={'center'} justifyContent={'center'} flex={1} m={5} >
      <Flex justifyContent={'center'} display={{ base: 'none', lg: 'flex' }} mr={5} >
        <GroupTab groups={[]} idx={-1} setIdx={() => { }} ></GroupTab>
      </Flex>
      <Flex flex={"1 1 auto"} justifyContent={'center'} maxW={'100%'}>
        <QuoteCardLarge quote_id={0} firstQuote={true} lastQuote={true} commentCard={<></>} />
      </Flex>
    </Flex>
    <ReactQueryDevtools initialIsOpen={false} />
  </Flex >

  const main = <Flex flexDirection={'column'} minH={"100vh"} bg={'gray.300'}>
    <NavBar right={user ?
      <LoggedInNav handleSignOut={handleSignOut} /> : <SplashNav handleSignIn={handleSignIn} />}
      addBar={user && groups && groups.length > 0 ?
        <AddBar groups={groups || []} group_idx={groupId} /> : <></>
      } />
    <Flex mr={5} ml={5} mt={5} display={{ base: 'flex', lg: 'none' }}>
      <GroupButton groups={groups || []} id={groupId} setId={setGroupId} ></GroupButton>
      <AddBar groups={groups || []} group_idx={groupId} />
    </Flex>
    <Flex flexDirection={'row'} alignItems={'center'} justifyContent={'center'} flex={1} m={5} mt={0} >
      <Flex justifyContent={'center'} display={{ base: 'none', lg: 'flex' }} mr={5} zIndex={1} position={'relative'}>
        <GroupTab groups={groups || []} idx={groupId} setIdx={setGroupId} ></GroupTab>
      </Flex>
      <Flex flex={"1 1 auto"} justifyContent={'center'} maxW={'100%'} >
        <QuoteCardLarge
          quote_id={quotes && quoteIdx < quotes.length ? quotes[quoteIdx].id : -1}
          quote={quotes ? quotes[quoteIdx] : undefined}
          prev={prevQuoteSlide}
          next={nextQuoteSlide}
          firstQuote={quoteIdx <= 0}
          lastQuote={quotes === undefined || quoteIdx >= quotes.length - 1}
          commentCard={commentCard} />
      </Flex>
    </Flex>
    <ReactQueryDevtools initialIsOpen={false} />
  </Flex >;

  if (!probsUser)
    return splash;

  return isLoadingUser || isLoadingGroup ? loading :
    user && groups ? main : splash;
}

export default App;
