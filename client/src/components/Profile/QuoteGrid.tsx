import { ChatIcon, LinkIcon } from "@chakra-ui/icons";
import { Box, Heading, Wrap, WrapItem, Text, Icon, HStack, Flex, VStack, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { FiEdit, FiHeart } from "react-icons/fi";
import { RoundButton } from "../Shared/Buttons";

function QuoteCard(props: { quote: string, group: string }) {
  const CommentButton = () => <RoundButton><ChatIcon /><Text fontSize={'xs'} ml={2}>33</Text></RoundButton>;
  const ShareButton = () => <RoundButton><LinkIcon /></RoundButton>;
  const LikeButton = () => <RoundButton ><Icon as={FiHeart} /><Text fontSize={'xs'} ml={2}>3k</Text></RoundButton>;
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

function QuoteGrid(props: any) {

  const SampleQuotes = () => <Wrap spacing={5}>
    <WrapItem>
      <QuoteCard quote="Heyoo, is swe less than trading trading?" group="CIS120" />
    </WrapItem>
    <WrapItem>
      <QuoteCard quote="damn, pop off" group="overheard" />
    </WrapItem>
    <WrapItem>
      <QuoteCard quote="swag swag swag swag swag swag swag swag swag swag swag swag 
swag swag swag swag swag swag swag swag swag swag swag swag swag swag swag swag swag " group="sldkjdslkjdl" />
    </WrapItem>
    <WrapItem>
      <QuoteCard quote="short quote long group"
        group="heyo this is a long group name and i think it's important to address edge cases" />
    </WrapItem>
  </Wrap>;

  return <Box {...props} p={3} pt={0}>
    <Tabs variant={'soft-rounded'}>
      <TabList>
        <Tab>My quotes</Tab>
        <Tab>Saved</Tab>
      </TabList>
      <TabPanels>
        <TabPanel><SampleQuotes /></TabPanel>
        <TabPanel><SampleQuotes /></TabPanel>
      </TabPanels>
    </Tabs>
  </Box>
}



export {
  QuoteCard,
  QuoteGrid
}