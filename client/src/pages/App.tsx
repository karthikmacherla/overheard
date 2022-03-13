import React, { useEffect, useState } from 'react';
import { AddBar, SplashNav, LoggedInNav, NavBar } from '../components/Nav/NavBar'
import GroupTab from '../components/GroupTab';
import QuoteTab from '../components/QuoteTab';

import { Grid, GridItem, Flex } from '@chakra-ui/react'

import { getuser, get_user_complete, get_user_groups } from '../fetcher';

import type { User, Group } from '../models';
import { isError, useQuery, useQueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';


function App() {
  const queryClient = useQueryClient();
  const [accessToken, setAccessToken] = useState('')
  const [groupIdx, setGroupIdx] = useState<number>(-1)
  const { isError: isUserError, data: user, error: userError }: any = useQuery(['user', accessToken],
    () => get_user_complete(accessToken),
    {
      retry: (count, err: Error) => err.message !== 'Bad access token'
    });

  // Don't retry/enable if token is bad
  const isBadToken = isUserError && userError.message === 'Bad access token';
  const { isError: isGroupErr, data: groups, error: groupsError }: any = useQuery(['groups', accessToken],
    () => get_user_groups(accessToken), { enabled: !isBadToken })

  useEffect(() => {
    const fetchUserData = async (access_token: string, user?: User) => {
      if (!access_token && sessionStorage.getItem("access_token") != null) {
        access_token = sessionStorage.getItem("access_token")!;
      }
      setAccessToken(access_token);
    };

    fetchUserData(accessToken).catch((e) => { console.log(e); });
  }, [accessToken, user]);

  const handleSignIn = (currUser: User, access_token: string) => {
    sessionStorage.setItem("access_token", access_token);
    setAccessToken(access_token);
    setGroupIdx(0);
    // queryClient.invalidateQueries()
  }

  const handleSignOut = () => {
    setAccessToken('');
    sessionStorage.removeItem("access_token");
  }

  return (
    <Flex flexDirection={'column'} minH={"100vh"} bg={'gray.300'}>
      <NavBar right={user ?
        <LoggedInNav handleSignOut={handleSignOut} /> : <SplashNav handleSignIn={handleSignIn} />}
        addBar={user ?
          <AddBar /> : <></>
        } />
      <Grid
        templateColumns='repeat(7, 1fr)'
        gap={10}
        p={4}
        my={5}
        mx={5}
        bg={'blue.100'}
      >
        {user && groups ?
          <>
            <GridItem rounded={'lg'} boxShadow="2xl" bg={'white'} colSpan={2}>
              <GroupTab groups={groups} idx={groupIdx} />
            </GridItem>
            <GridItem
              colSpan={5} rounded={'lg'} boxShadow="2xl" bg={'white'}
              minW={'2xl'} minH={'lg'} maxH={'xl'}>
              <QuoteTab />
            </GridItem>
          </>
          :
          <>
            <GridItem
              colStart={2} colSpan={5} rounded={'lg'} boxShadow="2xl" bg={'white'}
              minW={'2xl'} minH={'lg'} maxH={'xl'}>
              <QuoteTab />
            </GridItem>
          </>
        }

      </Grid>
      <ReactQueryDevtools initialIsOpen={false} />
    </Flex>
  );
}

export default App;
