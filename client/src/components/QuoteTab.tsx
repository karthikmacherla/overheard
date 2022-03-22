import {
  ChatIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  LinkIcon,
  PhoneIcon
} from '@chakra-ui/icons';
import {
  Avatar,
  Button,
  Divider,
  Flex, Grid, Text,
  GridItem, Heading, Icon, Image, useColorModeValue, VStack, MenuButton, Menu, IconButton, MenuItem, MenuList, useDisclosure, Input, InputGroup, InputLeftElement, InputRightElement
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  FiHeart, FiMoreVertical, FiTrash
} from 'react-icons/fi';
import { useQuery } from 'react-query';
import { get_group_quotes } from '../fetcher';

interface QProps {
  group_id: number
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
          <GridItem rowStart={2} rowEnd={11} colStart={1} colEnd={16}>
            <VStack overflow={'auto'} h={"100%"}>
              <Comment comment='To a first approximation, there is one compilation function for each nonterminal of the language syntax. The inputs to these functions are the static context and the piece of syntax (and its type) to be compiled. The output of such a function depends on which part of the program you are compiling: expressions evaluate to values, so their compilation function returns the code computing an operand; statements do not evaluate to values, but they do introduce new local variables, so their compilation function returns a new context and an instruction stream, etc. ' />
              <Comment comment='hi' />
              <Comment comment='hi' />
              <Comment comment='hi' />
              <Comment comment='hi' />
              <Comment comment='hi' />
              <Comment comment='hi' />
              <Comment comment='hi' />
              <Comment comment='hi' />
              <Comment comment='hi' />
              <Comment comment='hi' />
              <Comment comment='hi' />
            </VStack>
          </GridItem>
          <GridItem rowStart={11} rowEnd={12} colStart={1} colEnd={16}>
            <CommentBar />
          </GridItem>
        </Grid>
      </Flex>
    )
  }
}

function CommentBar() {

  return <>
    <InputGroup>
      <InputLeftElement
        pointerEvents='none'
        children={<Avatar name={"Steve"} src='#' size={'sm'} />}
      />
      <Input variant='filled' size={'lg'} type='tel' placeholder='insert comment here' />
      <InputRightElement children={<CheckIcon color='green.500' />} />
    </InputGroup>
  </>

}

function Comment(props: { comment: string }) {
  return (
    <>
      <Flex justifyContent={'space-between'}
        width={"100%"}
        _hover={{ bg: useColorModeValue('gray.100', 'gray.900') }}
        alignItems={'center'}
        rounded={'md'}>
        <Flex justifyContent={'flex-start'} alignItems={'flex-start'}>
          <Avatar name={"Steve"} src='#' m={3} size={'sm'} />
          <Text fontSize={'md'} fontWeight={'light'} m={2}>{props.comment}</Text>
        </Flex>
        < CommentMenu />
      </Flex >
    </>)
}


/* Options to manage current member */
const CommentMenu = (props: {}) => {
  // Create modal states
  const deleteState = useDisclosure();
  return (<Menu>
    <MenuButton
      m={1}
      mt={3}
      as={IconButton}
      aria-label='Options'
      icon={<Icon w={5} h={5} as={FiMoreVertical} />}
      variant='link'
    />
    <MenuList>
      <MenuItem icon={<FiTrash />} onClick={deleteState.onOpen}>Remove User</MenuItem>
    </MenuList>
  </Menu>
  )
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