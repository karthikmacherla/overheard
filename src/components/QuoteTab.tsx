import React from 'react';
import {
  Icon,
  Button,
  Flex,
  Heading,
  Image,
  Grid,
  GridItem,
  Box
} from '@chakra-ui/react'

import {
  ChatIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LinkIcon,
} from '@chakra-ui/icons';

import {
  FiHeart
} from 'react-icons/fi';


interface QProps {
}

interface QState {
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
  time: Date
}

// list of quotes
// current index
// current font size vs function to get the current font size
class QuoteTab extends React.Component<QProps, QState> {

  constructor(props: QProps) {
    super(props);

    this.state = {
      showingQuote: true,
      quotes: QUOTES, // define typescript interface here
      idx: 0,
      fontSize: 5,
      comments_idx: []
    }

    this.handleArrowKeys = this.handleArrowKeys.bind(this);
    this.nextSlide = this.nextSlide.bind(this);
    this.prevSlide = this.prevSlide.bind(this);
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

  handleArrowKeys(event: KeyboardEvent) {
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

  render(): React.ReactNode {
    if (this.state.showingQuote) {
      // Show quote block 
      return (
        <Grid
          templateRows='repeat(11, 1fr)'
          templateColumns='repeat(15, 1fr)'
          m={5}
          role={'group'}
        >
          <GridItem><Image src={"quotemark.png"} /></GridItem>
          <GridItem
            colStart={15} rowStart={11}>
            <Image src={"quotemark.png"} transform={"rotate(180deg)"} />
          </GridItem>
          <GridItem colStart={3} colEnd={14} rowStart={3} rowEnd={10} >
            <Flex h="100%" flex={{ base: 1 }} justify={'center'} alignItems={'center'}>
              <Heading fontSize={"5vh"}>
                {this.state.quotes[this.state.idx].message}
              </Heading>
            </Flex>
          </GridItem>
          {/* Share buttons */}
          <GridItem colStart={15}><CommentButton /></GridItem>
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
      )
    } else {
      // Show comment block

      <></>
    }
  }
}


function CommentButton() {
  return (
    <Button
      transition={'all .3s ease'}
      opacity={0}
      _groupHover={{ opacity: '100%' }}
      rounded={'full'}
      bg={'red.400'}
      color={'white'}>
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

export default QuoteTab;