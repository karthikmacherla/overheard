import { ChatIcon, LinkIcon } from "@chakra-ui/icons";
import { Box, Wrap, WrapItem, Text, Icon, HStack, Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { FiEdit, FiHeart } from "react-icons/fi";
import { useQuery } from "react-query";
import { get_quote, get_user_quotes } from "../../fetcher";
import { Quote } from "../../models";
import { RoundButton } from "../Shared/Buttons";

function QuoteCard(props: { quote: Quote }) {
  const accessToken = sessionStorage.getItem('access_token') || '';
  const { data: quote }: { data: Quote | undefined, error: Error | null } = useQuery(['quote', accessToken, props.quote.id],
    () => get_quote(accessToken, props.quote.id),
    {
      retry: (count, err: Error) => false,
      initialData: props.quote,
    });

  const CommentButton = () => <RoundButton><ChatIcon /><Text fontSize={'xs'} ml={2}>{quote?.comment_count}</Text></RoundButton>;
  const ShareButton = () => <RoundButton><LinkIcon /></RoundButton>;
  const LikeButton = () => <RoundButton ><Icon as={FiHeart} /><Text fontSize={'xs'} ml={2}>{quote?.likes}</Text></RoundButton>;
  const EditButton = () => <RoundButton ><Icon as={FiEdit} /></RoundButton>;

  return <Flex flexDirection={'column'} shadow='md' bg={'white'} borderRadius={'lg'} p={5} h={250} maxW={'md'}>
    <Box>
      <Text>"{quote?.message}"</Text>
      <Text fontWeight={"thin"}>- {quote?.group?.group_name}</Text>
    </Box>
    <HStack marginTop={'auto'}>
      <ShareButton />
      <CommentButton />
      <LikeButton />
      <EditButton />
    </HStack>
  </Flex>
}

function QuoteGrid() {
  const [accessToken, setAccessToken] = useState('');
  useEffect(() => {
    if (!accessToken && sessionStorage.getItem("access_token") != null) {
      setAccessToken(sessionStorage.getItem("access_token") || accessToken);
    }
  }, [accessToken]);

  const { data: myQuotes } = useQuery(['myQuotes', accessToken],
    () => get_user_quotes(accessToken),
    {
      retry: (count, err: Error) => err.message !== 'Bad access token',
    });

  const savedQuotes: Quote[] = [];

  const MyQuotes = () => <Wrap spacing={5}>
    {(myQuotes || []).map((quote, idx) => {
      return <WrapItem><QuoteCard quote={quote} /> </WrapItem>
    })}
  </Wrap>;

  const SavedQuotes = () => <Wrap spacing={5}>
    {savedQuotes.map((quote, idx) => {
      return <WrapItem><QuoteCard quote={quote} /> </WrapItem>
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