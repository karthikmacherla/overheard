import React from 'react';
import {
  Icon,
  Button,
  Flex,
  Heading,
  Image,
  Grid,
  GridItem
} from '@chakra-ui/react'

import {
  ChatIcon,
  LinkIcon,
} from '@chakra-ui/icons';

import {
  FiHeart
} from 'react-icons/fi';

function QuoteTab() {

  return (
    <Grid
      templateRows='repeat(11, 1fr)'
      templateColumns='repeat(15, 1fr)'
      m={5}
    >
      <GridItem>
        <Image src={"quotemark.png"} />
      </GridItem>
      <GridItem
        colStart={15} rowStart={11}>
        <Image src={"quotemark.png"} transform={"rotate(180deg)"} />
      </GridItem>
      <GridItem colStart={3} colEnd={14} rowStart={3} rowEnd={10} >
        <Flex h="100%" flex={{ base: 1 }} justify={'center'} alignItems={'center'}>
          <Heading fontSize={"5vh"}>
            There's a lot of content to fit on this slide.
            There's a lot of content to fit on this slide.
            There's a lot of content to fit on this slide.
            There's a lot of content to fit on this slide.
            There's a lot of content to fit on this slide.
          </Heading>
        </Flex>
      </GridItem>
      {/* Share buttons */}
      <GridItem colStart={15}>
        <Button
          rounded={'full'}
          bg={'red.400'}
          color={'white'}>
          <ChatIcon />
        </Button>
      </GridItem>
      <GridItem colStart={15} >
        <Button
          rounded={'full'}
          bg={'red.400'}
          color={'white'}>
          <LinkIcon />
        </Button>
      </GridItem>
      <GridItem colStart={15} >
        <Button
          rounded={'full'}
          bg={'red.400'}
          color={'white'}>
          <Icon as={FiHeart} />
        </Button>
      </GridItem>
    </Grid >
  )
}

export default QuoteTab;