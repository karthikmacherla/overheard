import React, { useEffect, useState } from 'react';
import { AddBar, SplashNav, LoggedInNav, NavBar } from '../components/Nav/NavBar'
import GroupTab from '../components/GroupTab';
import QuoteTab from '../components/QuoteTab';

import { Grid, GridItem, Flex } from '@chakra-ui/react'
import { getuser, get_user_groups } from '../fetcher';
import type { User, Group } from '../models';
import { useQueryClient } from 'react-query';

interface AppState {
  group_idx: number,
  groups: Array<Group>,
  user?: User,
  access_token?: string
}

// app as a function
// -- running subscription on everything going on
function App() {
  const [accessToken, setAccessToken] = useState('')
  const [user, setUser] = useState<User | undefined>(undefined)
  const [groups, setGroups] = useState<Array<Group>>([])
  const [groupIdx, setGroupIdx] = useState<number>(-1)

  useEffect(() => {
    const fetchUserData = async (access_token: string, user?: User) => {
      if (!access_token && localStorage.getItem("access_token") != null) {
        access_token = localStorage.getItem("access_token")!;
      }

      if (access_token && !user) {
        let res = await getuser(access_token).then(res => res.json());
        // bad/expired token
        if (!res.id) {
          access_token = '';
        } else {
          user = res;
        }
      }

      if (access_token && user) {
        let res = await get_user_groups(access_token);
        let groups = [];
        if (res.status === 200) {
          groups = await res.json();
        }
        setGroups(groups);
        setGroupIdx(0);
      }
      setAccessToken(access_token);
      setUser(user);
    };

    fetchUserData(accessToken, user).catch((e) => { console.log(e); });
  }, [accessToken, user]);

  const handleSignIn = (currUser: User, access_token: string) => {
    setAccessToken(access_token);
    setUser(currUser);
    localStorage.setItem("access_token", access_token);
  }

  const handleSignOut = () => {
    setUser(undefined);
    setAccessToken('');
    setGroups([]);
    setGroupIdx(-1);
    localStorage.removeItem("access_token");
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
        {user ?
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
    </Flex>
  );
}

export default App;
