import {
  ChatIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  EmailIcon,
  LinkIcon,
  PhoneIcon
} from '@chakra-ui/icons';
import {
  Avatar,
  Button,
  Divider,
  Flex, Grid, Text,
  GridItem, Heading, Icon, Image, useColorModeValue, VStack, MenuButton, Menu, IconButton, MenuItem, MenuList, useDisclosure, Input, InputGroup, InputLeftElement, InputRightElement, Box
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  FiHeart, FiMoreVertical, FiSend, FiTrash
} from 'react-icons/fi';
import { useQuery } from 'react-query';
import { get_group_quotes } from '../fetcher';
import { CommentBar, Comments } from './Comment/Comments';

interface QProps {
  group_id: number,
}

function QuoteTab(props: QProps) {
  const groupId = props.group_id;
  const accessToken = sessionStorage.getItem('access_token') || '';

  const [showQuote, setShowQuote] = useState(true);
  const [idx, setIdx] = useState(0);

  const { data: quotes } = useQuery(['quotes', accessToken, groupId],
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
            <Image src={"quotemark.png"} h={"50px"} w={"50px"} ratio={1} transform={"rotate(180deg)"} />
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
      <Flex flexDir={'column'} alignItems={'center'} h={"100%"} justifyContent={"center"}>
        <Grid
          templateRows='repeat(11, 1fr)'
          templateColumns='repeat(15, 1fr)'
          mt={5}
          role={'group'}
          h={"100%"}
          w={"100%"}
        >
          <GridItem rowStart={1} colStart={15}><CloseButton handle={handleClose} /></GridItem>
          <GridItem rowStart={2} rowEnd={3} colStart={1} colEnd={16}> <Divider /> </GridItem>
          {quotes && idx < quotes.length ? <>
            <GridItem rowStart={2} rowEnd={11} colStart={1} colEnd={16}>
              <Comments quote_id={quotes[idx].id} />
            </GridItem>
            <GridItem rowStart={11} rowEnd={12} colStart={1} colEnd={16}> <Divider /> </GridItem>
            <GridItem rowStart={11} rowEnd={12} colStart={1} colEnd={16}>
              <CommentBar quote_id={quotes[idx].id} />
            </GridItem>
          </>
            : <></>}
        </Grid>
      </Flex>
    )
  }
}


function CloseButton({ handle }: { handle: () => void }) {
  return (
    <Button
      rounded={'full'}
      bg={'red.400'}
      color={'white'}
      // h={"50px"} w={"50px"}
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

export default QuoteTab;