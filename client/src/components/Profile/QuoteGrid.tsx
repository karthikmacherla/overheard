import { ChatIcon, LinkIcon } from "@chakra-ui/icons";
import { Box, Wrap, WrapItem, Text, Icon, HStack, Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { FiEdit, FiHeart } from "react-icons/fi";
import { Quote } from "../../models";
import { RoundButton } from "../Shared/Buttons";

function QuoteCard(props: { quote: string, group: string, likes: number }) {
  const CommentButton = () => <RoundButton><ChatIcon /><Text fontSize={'xs'} ml={2}>33</Text></RoundButton>;
  const ShareButton = () => <RoundButton><LinkIcon /></RoundButton>;
  const LikeButton = () => <RoundButton ><Icon as={FiHeart} /><Text fontSize={'xs'} ml={2}>{props.likes}</Text></RoundButton>;
  const EditButton = () => <RoundButton ><Icon as={FiEdit} /></RoundButton>;

  return <Flex flexDirection={'column'} shadow='md' bg={'white'} borderRadius={'lg'} p={5} h={250} maxW={'md'}>
    <Box>
      <Text>"{props.quote}"</Text>
      <Text fontWeight={"thin"}>- {props.group}</Text>
    </Box>
    <HStack marginTop={'auto'}>
      <ShareButton />
      <CommentButton />
      <LikeButton />
      <EditButton />
    </HStack>
  </Flex>
}

function QuoteGrid(props: { myQuotes: Array<Quote>, savedQuotes: Array<Quote> }) {

  const MyQuotes = () => <Wrap spacing={5}>
    {props.myQuotes.map((quote, idx) => {
      return <WrapItem><QuoteCard quote={quote.message} group={quote.message} likes={quote.likes || 0} /> </WrapItem>
    })}
  </Wrap>;

  const SavedQuotes = () => <Wrap spacing={5}>
    {props.savedQuotes.map((quote, idx) => {
      return <WrapItem><QuoteCard quote={quote.message} group={quote.message} likes={quote.likes || 0} /> </WrapItem>
    })}
  </Wrap>;

  return <Box p={3} pt={0}>
    <Tabs variant={'soft-rounded'}>
      <TabList>
        <Tab>My quotes</Tab>
        <Tab>Saved</Tab>
      </TabList>
      <TabPanels>
        <TabPanel><MyQuotes /></TabPanel>
        <TabPanel><SavedQuotes /></TabPanel>
      </TabPanels>
    </Tabs>
  </Box>
}



export {
  QuoteCard,
  QuoteGrid
}