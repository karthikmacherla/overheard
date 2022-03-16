import {
  ChatIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  LinkIcon
} from '@chakra-ui/icons';
import {
  Box, Button,
  Flex, Grid,
  GridItem, Heading, Icon, Image, Table, Tbody, Td, Tr
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
  FiHeart
} from 'react-icons/fi';
import { useQuery, useQueryClient } from 'react-query';
import { get_group_quotes } from '../fetcher';

import { Quote, Comment, User } from '../models'

interface QProps {
  group_id: number
}

function QuoteTab(props: QProps) {
  const queryClient = useQueryClient();
  const groupId = props.group_id;
  const accessToken = sessionStorage.getItem('access_token') || '';

  const [showQuote, setShowQuote] = useState(true);
  const [idx, setIdx] = useState(0);
  const [fontSize, setFontSize] = useState(5);

  const { isError: isQuoteErr, data: quotes, error: quoteErr } = useQuery(['quotes', accessToken, groupId],
    () => get_group_quotes(groupId, accessToken))

  function prevSlide() {
    if (idx > 0) {
      setIdx(idx - 1);
    }
  }

  function nextSlide() {
    if (idx < (quotes ? quotes.length - 1 : 0)) {
      setIdx(idx + 1);
    }
  }

  function handleClose() {
    setShowQuote(!showQuote)
  }

  function handleArrowKeys(event: KeyboardEvent) {
    //only works when displaying quote
    if (!showQuote) {
      return;
    }
    if (event.key === 'ArrowLeft') {
      prevSlide();
    } else if (event.key === 'ArrowRight') {
      nextSlide();
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleArrowKeys, false);
    return () => document.removeEventListener("keydown", handleArrowKeys, false);
  })

  // all handling functions
  if (showQuote) {
    // Show quote block 
    return (
      <Flex flexDir={'column'} alignItems={'center'} h={"100%"} justifyContent={"center"}>
        <Grid
          templateRows='repeat(11, 1fr)'
          templateColumns='repeat(15, 1fr)'
          m={5}
          role={'group'}
          h={"95%"}
          w={"95%"}
        >
          <GridItem><Image src={"quotemark.png"} h={"50px"} w={"50px"} /></GridItem>
          <GridItem
            colStart={15} rowStart={11}>
            <Image src={"quotemark.png"} h={"50px"} w={"50px"} transform={"rotate(180deg)"} />
          </GridItem>
          <GridItem colStart={3} colEnd={14} rowStart={3} rowEnd={10} >
            <Flex h="100%" flex={{ base: 1 }} justify={'center'} alignItems={'center'}>
              <Heading fontSize={"5vh"}>
                {quotes && idx < quotes.length ? quotes[idx].message : ''}
              </Heading>
            </Flex>
          </GridItem>
          {/* Share buttons */}
          <GridItem colStart={15}><CommentButton handle={handleClose} /></GridItem>
          <GridItem colStart={15} ><ShareButton /></GridItem>
          <GridItem colStart={15} ><LikeButton /></GridItem>

          {/* Left Right Buttons */}
          {idx <= 0 ? <></> :
            (<GridItem rowStart={6}>
              <LeftButton handle={prevSlide} />
            </GridItem>)
          }

          {idx >= (quotes ? quotes.length - 1 : 0) ? <></> :
            (<GridItem rowStart={6} colStart={15}>
              <RightButton handle={nextSlide} />
            </GridItem>)
          }
        </Grid >
      </Flex>
    )
  } else {
    // Show comment block
    return (
      <Grid
        templateRows='repeat(11, 1fr)'
        templateColumns='repeat(15, 1fr)'
        m={5}
        role={'group'}
      >
        {/* <GridItem rowStart={1} rowEnd={12} colStart={1} colEnd={16} >
          <Box overflow={'hidden'} overflowY={'scroll'} h={'lg'}>
            <Table variant='simple' size={'lg'}>
              <Tbody>
                {this.state.comments_idx.map((c, ind) => {
                  return (
                    <Tr>
                      <Td>{c.message}</Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </Box>
        </GridItem> */}
        <GridItem rowStart={1} colStart={15}><CloseButton handle={handleClose} /></GridItem>
      </Grid>
    )
  }
}

function CloseButton({ handle }: { handle: () => void }) {
  return (
    <Button
      rounded={'full'}
      bg={'red.400'}
      color={'white'}
      onClick={handle}>
      <CloseIcon />
    </Button>
  )
}

function CommentButton({ handle }: { handle: () => void }) {
  return (
    <Button
      transition={'all .3s ease'}
      opacity={0}
      _groupHover={{ opacity: '100%' }}
      rounded={'full'}
      bg={'red.400'}
      color={'white'}
      onClick={handle}>
      <ChatIcon />
    </Button>
  )
}

function ShareButton() {
  return (
    <Button
      transition={'all .3s ease'}
      opacity={0}
      _groupHover={{ opacity: '100%' }}
      rounded={'full'}
      bg={'red.400'}
      color={'white'}>
      <LinkIcon />
    </Button>
  )
}

function LikeButton() {
  return (
    <Button
      transition={'all .3s ease'}
      opacity={0}
      _groupHover={{ opacity: '100%' }}
      rounded={'full'}
      bg={'red.400'}
      color={'white'}>
      <Icon as={FiHeart} />
    </Button>
  )
}

function LeftButton({ handle }: { handle: () => void }) {
  return (
    <Icon
      transition={'all .3s ease'}
      opacity={0}
      _groupHover={{ opacity: '100%' }}
      color={'red.400'}
      w={8}
      h={8}
      onClick={handle}
      as={ChevronLeftIcon} />
  )
}

function RightButton({ handle }: { handle: () => void }) {
  return (
    <Icon
      transition={'all .3s ease'}
      opacity={0}
      _groupHover={{ opacity: '100%' }}
      color={'red.400'}
      w={8}
      h={8}
      onClick={handle}
      as={ChevronRightIcon} />
  )
}

const QUOTES: Array<Quote> = [
  {
    message: "This is a very cool way to talk to people anonymously"
  },
  {
    message: "Heyo"
  }
]

const COMMENTS: Array<Comment> = [
  {
    message: "This is a very cool way to talk to people anonymously. There is a lot of text to unpack so we can see what happens in this event."
  },
  {
    message: "Heyo"
  }
]

export default QuoteTab;