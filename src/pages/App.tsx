import React from 'react';
import { AddBar, SplashNav, LoggedInNav, NavBar } from '../components/Nav/NavBar'
import GroupTab from '../components/GroupTab';
import QuoteTab from '../components/QuoteTab';

import { Grid, GridItem, Flex } from '@chakra-ui/react'

interface AppState {
  group_id?: string,
  user?: User
}

interface User {
  user_id: String,
  name: String
}


class App extends React.Component<any, AppState> {

  constructor(props: any) {
    super(props)

    this.state = {
      user: {
        user_id: "username",
        name: "Karthik Macherla"
      }
    }
  }

  render() {
    return (
      <Flex flexDirection={'column'} minH={"100vh"} bg={'gray.300'}>
        <NavBar right={this.state.user ?
          <LoggedInNav /> : <SplashNav />}
          addBar={this.state.user ?
            <AddBar /> : <></>
          } />
        <Grid
          templateColumns='repeat(3, 1fr)'
          gap={10}
          p={4}
          my={5}
          mx={5}
        >
          <GridItem rounded={'lg'} boxShadow="2xl" bg={'white'}>
            <GroupTab />
          </GridItem>
          <GridItem
            colSpan={2} rounded={'lg'} boxShadow="2xl" bg={'white'}
            minW={'2xl'} minH={'lg'} maxH={'xl'}>
            <QuoteTab />
          </GridItem>
        </Grid>
      </Flex>
    );
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
