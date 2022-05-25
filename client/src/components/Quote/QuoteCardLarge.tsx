import { ChatIcon, LinkIcon, CloseIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Icon, Box, VStack, Flex, Heading, Divider, Image, Text, Center } from "@chakra-ui/react";
import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { useQuery } from "react-query";
import { get_quote } from "../../fetcher";
import { Quote } from "../../models";
import { Comments, CommentBar } from "../Comment/Comments";
import { ClearButton, RoundButton } from "../Shared/Buttons";

function QuoteCardLarge(props: { quote_id: number, quote?: Quote, firstQuote: boolean, lastQuote: boolean }) {
  const quoteId = props.quote_id;
  const accessToken = sessionStorage.getItem('access_token') || '';

  const [showingQuote, setShowQuote] = useState(true);

  const { data: quote, error: err }: { data: Quote | undefined, error: Error | null } = useQuery(['quote', accessToken, quoteId],
    () => get_quote(accessToken, quoteId),
    {
      retry: (count, err: Error) => false,
      enabled: props.quote == null,
      initialData: props.quote,
    });

  console.log(err);

  const toggleQuote = () => setShowQuote(!showingQuote);

  const CommentButton = () => <RoundButton onClick={toggleQuote}><ChatIcon /><Text fontSize={'xs'} ml={1}>33</Text></RoundButton>;
  const ShareButton = () => <RoundButton><LinkIcon /><Text fontSize={'xs'} ml={1}>33</Text></RoundButton>;
  const LikeButton = () => <RoundButton ><Icon as={FiHeart} /><Text fontSize={'xs'} ml={1}>{0}</Text></RoundButton>;
  const CloseButton = () => <RoundButton m={2} onClick={toggleQuote}><CloseIcon /></RoundButton>;

  const LeftButton = () => <ClearButton onClick={() => { }} as={ChevronLeftIcon}></ClearButton>
  const RightButton = () => <ClearButton onClick={() => { }} as={ChevronRightIcon}></ClearButton>

  const errMessage = <Box maxW={'lg'}>
    <Center>
      <Heading as={'h3'}>Unable to fetch quote</Heading><br /></Center>
    <Center><Text textAlign={'center'}>Sorry! You don't have permission to view this card. {err ? err.message : ''} </Text></Center>

  </Box>

  const quoteCard = (<Box shadow='md' bg={'white'} borderRadius={'md'} p={5} h={1} minH={'xl'} maxH={'95%'} w={'3xl'} maxW={'95%'} position={'relative'} role={'group'}>
    <Image src={"/quotemark.png"} w={'7%'} h={'auto'} display={'block'} position={'absolute'} />
    <Image src={"/quotemark.png"} w={'7%'} h={'auto'} display={'block'} position={'absolute'} bottom={3} right={5} transform={"rotate(180deg)"} />
    <VStack position={'absolute'} right={3}>
      <CommentButton />
      <ShareButton />
      <LikeButton />
    </VStack>
    <Flex w={'full'} h={'full'} alignItems={'center'}>
      {props.firstQuote ? <></> : < LeftButton />}
      <Flex flexDirection={'column'} flexGrow={1} alignItems={'center'}>
        <Heading fontSize={"4vh"} w={"86%"} overflow={'hidden'} textOverflow='ellipsis' textAlign={'center'}>
          {quote?.message}
        </Heading>
      </Flex>
      {props.lastQuote ? <></> : <Flex alignItems={'flex-end'} ><RightButton /></Flex>}
    </Flex>
  </Box >);

  const commentCard = <Box shadow='md' bg={'white'} borderRadius={'md'} h={1} minH={'xl'} maxH={'95%'} w={'3xl'} maxW={'95%'} position={'relative'}>
    <Flex flexDirection={'column'} w={'full'} h={'full'}>
      <Flex justifyContent={'flex-end'} w={'full'}><CloseButton /></Flex>
      <Box flex={"1 1 auto"} h={'full'} ><Comments quote_id={1} /></Box>
      <Box>
        <Divider />
        <CommentBar quote_id={3} />
      </Box>
    </Flex >
  </Box >

  return err ? errMessage : (showingQuote ? quoteCard : commentCard);
}

export default QuoteCardLarge;