import React from 'react';
import WelcomeNavBar from '../components/WelcomeNavBar'
import GroupTab from '../components/GroupTab';
import QuoteTab from '../components/QuoteTab';
import { Grid, GridItem, Flex } from '@chakra-ui/react'

function App() {
  return (
    <Flex flexDirection={'column'} minH={"100vh"} bg={'gray.300'}>
      <WelcomeNavBar />
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
        <GridItem colSpan={2} rounded={'lg'} boxShadow="2xl" bg={'white'} minW={'2xl'} minH={'lg'}>
          <QuoteTab />
        </GridItem>
      </Grid>
    </Flex>
  );
}

export default App;
