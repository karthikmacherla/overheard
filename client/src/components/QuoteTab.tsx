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
import React from 'react';
import {
  FiHeart
} from 'react-icons/fi';


interface QProps {
  group_id?: string
}

interface QState {
  group_id?: string,
  showingQuote: boolean,
  quotes: Array<Quote>;
  idx: number,
  fontSize: number,
  comments_idx: Array<Comment>
}

interface Quote {
  message: string,
  share_link?: URL | string,
}

interface Comment {
  message: string,
  time?: Date
}

// list of quotes
// current index
// current font size vs function to get the current font size
class QuoteTab extends React.Component<QProps, QState> {

  constructor(props: QProps) {
    super(props);

    this.state = {
      group_id: props.group_id,
      showingQuote: true,
      quotes: QUOTES, // define typescript interface here
      idx: 0,
      fontSize: 5,
      comments_idx: COMMENTS
    }

    this.handleArrowKeys = this.handleArrowKeys.bind(this);
    this.nextSlide = this.nextSlide.bind(this);
    this.prevSlide = this.prevSlide.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  prevSlide() {
    if (this.state.idx > 0) {
      this.setState({ idx: this.state.idx - 1 });
    }
  }

  nextSlide() {
    if (this.state.idx < this.state.quotes.length - 1) {
      this.setState({ idx: this.state.idx + 1 });
    }
  }

  handleClose() {
    this.setState({ showingQuote: !this.state.showingQuote })
  }

  handleArrowKeys(event: KeyboardEvent) {
    if (!this.state.showingQuote) {
      //only works when displaying quote
      return;
    }
    if (event.key === 'ArrowLeft') {
      this.prevSlide();
    } else if (event.key === 'ArrowRight') {
      this.nextSlide();
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleArrowKeys, false);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleArrowKeys, false);
  }

  componentDidUpdate(prevProps: QProps, prevState: QState) {
    //group id has been changed?
    if (this.state.group_id === prevState.group_id) {
      return;
    }

    //requery and update state here
  }

  render(): React.ReactNode {
    if (this.state.showingQuote) {
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
            bg={'pink.200'}
          >
            <GridItem><Image src={"quotemark.png"} h={"50px"} w={"50px"} /></GridItem>
            <GridItem
              colStart={15} rowStart={11}>
              <Image src={"quotemark.png"} h={"50px"} w={"50px"} transform={"rotate(180deg)"} />
            </GridItem>
            <GridItem colStart={3} colEnd={14} rowStart={3} rowEnd={10} >
              <Flex h="100%" flex={{ base: 1 }} justify={'center'} alignItems={'center'}>
                <Heading fontSize={"5vh"}>
                  {this.state.quotes[this.state.idx].message}
                </Heading>
              </Flex>
            </GridItem>
            {/* Share buttons */}
            <GridItem colStart={15}><CommentButton handle={this.handleClose} /></GridItem>
            <GridItem colStart={15} ><ShareButton /></GridItem>
            <GridItem colStart={15} ><LikeButton /></GridItem>

            {/* Left Right Buttons */}
            {this.state.idx <= 0 ? <></> :
              (<GridItem rowStart={6}>
                <LeftButton handle={this.prevSlide} />
              </GridItem>)
            }

            {this.state.idx >= (this.state.quotes.length - 1) ? <></> :
              (<GridItem rowStart={6} colStart={15}>
                <RightButton handle={this.nextSlide} />
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
          <GridItem rowStart={1} rowEnd={12} colStart={1} colEnd={16} >
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
          </GridItem>
          <GridItem rowStart={1} colStart={15}><CloseButton handle={this.handleClose} /></GridItem>
        </Grid>
      )
    }
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


const QUOTES2: Array<Quote> = [
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