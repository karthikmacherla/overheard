import React from 'react';
import { AddBar, SplashNav, LoggedInNav, NavBar } from '../components/Nav/NavBar'
import GroupTab from '../components/GroupTab';
import QuoteTab from '../components/QuoteTab';

import { Grid, GridItem, Flex } from '@chakra-ui/react'
import { get_user_groups } from '../fetcher';
import type { User, Group, Quote } from '../models';

interface AppState {
  group_idx: number,
  groups: Array<Group>,
  user?: User,
  access_token?: String
}


class App extends React.Component<any, AppState> {

  constructor(props: any) {
    super(props)

    this.state = {
      groups: [],
      group_idx: 0,
    }
  }

  async componentDidMount() {
    if (this.state.user && this.state.access_token) {
      let res = await get_user_groups(this.state.access_token);
      let groups = [];
      if (res.status === 200) {
        groups = await res.json();
      }
      this.setState({ groups: groups, group_idx: 0 });
    }
  }

  render() {
    return (
      <Flex flexDirection={'column'} minH={"100vh"} bg={'gray.300'}>
        <NavBar right={this.state.user ?
          <LoggedInNav /> : <SplashNav handleSignIn={this.handleSignIn} />}
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
  }
}

/* 
Data:
- group 
- quotes
- current quote
- comments for a quote
- like/unlike
- user-id if logged in
*/

export default App;
