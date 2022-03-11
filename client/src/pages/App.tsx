import React from 'react';
import { AddBar, SplashNav, LoggedInNav, NavBar } from '../components/Nav/NavBar'
import GroupTab from '../components/GroupTab';
import QuoteTab from '../components/QuoteTab';

import { Grid, GridItem, Flex } from '@chakra-ui/react'
import { getuser, get_user_groups } from '../fetcher';
import type { User, Group, Quote } from '../models';

interface AppState {
  group_idx: number,
  groups: Array<Group>,
  user?: User,
  access_token?: string
}


class App extends React.Component<any, AppState> {

  constructor(props: any) {
    super(props)

    this.state = {
      groups: [],
      group_idx: 0,
    }


    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  async componentDidMount() {
    let access_token = this.state.access_token;
    let user = this.state.user;

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
      this.setState({ groups: groups, group_idx: 0 });
    }
    this.setState({ user: user, access_token: access_token });
  }

  render() {
    return (
      <Flex flexDirection={'column'} minH={"100vh"} bg={'gray.300'}>
        <NavBar right={this.state.user ?
          <LoggedInNav handleSignOut={this.handleSignOut} /> : <SplashNav handleSignIn={this.handleSignIn} />}
          addBar={this.state.user ?
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
          {this.state.user ?
            <>
              <GridItem rounded={'lg'} boxShadow="2xl" bg={'white'} colSpan={2}>
                <GroupTab groups={this.state.groups} idx={this.state.group_idx} />
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


  handleSignIn(user: User, access_token: string) {
    this.setState({ user, access_token });
    localStorage.setItem("access_token", access_token);
  }

  handleSignOut() {
    this.setState({ user: undefined, access_token: '', groups: [], group_idx: -1 });
    localStorage.removeItem("access_token");
  }
}

export default App;
