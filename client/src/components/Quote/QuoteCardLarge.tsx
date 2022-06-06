import { ChatIcon, LinkIcon, CloseIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Icon, Box, VStack, Flex, Heading, Image, Text, Center, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { useQuery } from "react-query";
import { get_quote, toggleLikeQuote } from "../../fetcher";
import { Quote } from "../../models";
import { ClearButton, RoundButton } from "../Shared/Buttons";


const Shell = (props: any) =>
  <Box shadow='md' bg={'white'} borderRadius={'md'}
    h={'xl'} minH={'xl'} maxH={'95%'}
    w={'100%'} minW={{ base: '100%', lg: '2xl', xl: '3xl' }} maxW={'100%'}
    position={'relative'} role={'group'} {...props}>
    {props.children}
  </Box>

function QuoteCardLarge(props: {
  quote_id: number,
  quote?: Quote,
  firstQuote: boolean,
  lastQuote: boolean,
  prev?: () => void,
  next?: () => void,
  commentCard: JSX.Element
}) {
  const quoteId = props.quote_id;

  const [showingQuote, setShowQuote] = useState(true);

  const accessToken = sessionStorage.getItem('access_token') || '';
  const { data: quote, error: err }: { data: Quote | undefined, error: Error | null } = useQuery(['quote', accessToken, quoteId],
    () => get_quote(accessToken, quoteId),
    {
      retry: (count, err: Error) => false,
      enabled: quoteId !== -1,
      initialData: props.quote,
    });
  const toggleQuote = () => setShowQuote(!showingQuote);

  const copyShareToast = useToast()
  const copyShareLink = () => {
    const host = process.env.REACT_APP_CLIENT_HOST;
    const shareLink = `${host}/quote/${quote?.id}`;

    navigator.clipboard.writeText(shareLink);
    copyShareToast({
      title: 'Copied to clipboard!',
      description: `Share link: ${shareLink}`,
      status: 'success',
      duration: 1000,
      isClosable: true,
    })
  }

  const toggleLike = () => {
    if (quote) {
      const toggle = quote?.liked_by_user ? false : true;
      toggleLikeQuote(accessToken, quote.id, toggle);
    }
  }

  const CommentButton = () => <RoundButton onClick={toggleQuote}><ChatIcon /><Text fontSize={'xs'} ml={1}>{quote?.comment_count ? quote?.comment_count : 0}</Text></RoundButton>;
  const ShareButton = () => <RoundButton onClick={copyShareLink}><LinkIcon /><Text fontSize={'xs'} ml={1}></Text></RoundButton>;
  const LikeButton = () => <RoundButton onClick={toggleLike} ><Icon as={FiHeart} /><Text fontSize={'xs'} ml={1}>{quote?.likes ? quote?.likes : 0}</Text></RoundButton>;
  const CloseButton = () => <RoundButton m={2} onClick={toggleQuote}><CloseIcon /></RoundButton>;

  const LeftButton = () => <ClearButton onClick={props.prev} as={ChevronLeftIcon}></ClearButton>
  const RightButton = () => <ClearButton onClick={props.next} as={ChevronRightIcon}></ClearButton>

  const handleArrowKeys = (event: KeyboardEvent) => {
    if (!showingQuote)
      return;
    if (event.key === 'ArrowLeft' && props.prev) {
      props.prev();
    } else if (event.key === 'ArrowRight' && props.next) {
      props.next();
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleArrowKeys, false);
    return () => document.removeEventListener("keydown", handleArrowKeys, false);
  })

  const errMessage = <Box maxW={'lg'}>
    <Center>
      <Heading as={'h3'}>Unable to fetch quote</Heading><br /></Center>
    <Center><Text textAlign={'center'}>Sorry! You don't have permission to view this card. {err ? err.message : ''} </Text></Center>

  </Box>

  const quoteCard = (<Shell p={5}>
    <Image src={"/quotemark.png"} w={'7%'} maxW={'50px'} h={'auto'} display={'block'} position={'absolute'} />
    <Image src={"/quotemark.png"} w={'7%'} maxW={'50px'} h={'auto'} display={'block'} position={'absolute'} bottom={3} right={5} transform={"rotate(180deg)"} />
    <VStack position={'absolute'} right={3}>
      <CommentButton />
      <LikeButton />
      <ShareButton />
    </VStack>
    <Flex w={'full'} h={'full'} alignItems={'center'}>
      {props.firstQuote ? <></> : < LeftButton />}
      <Flex flexDirection={'column'} flexGrow={1} alignItems={'center'}>
        <Heading fontSize={"5vh"} w={"86%"} overflow={'hidden'} textOverflow='ellipsis' textAlign={'center'}>
          {quote?.message}
        </Heading>
      </Flex>
      {props.lastQuote ? <></> : <Flex alignItems={'flex-end'} ><RightButton /></Flex>}
    </Flex>
  </Shell>);

  const commentCard = <Shell>
    <Flex flexDirection={'column'} w={'full'} h={'full'}>
      <Flex justifyContent={'flex-end'} w={'full'}><CloseButton /></Flex>
      {props.commentCard}
    </Flex >
  </Shell>

  return err ? errMessage : (showingQuote ? quoteCard : commentCard);
}

export default QuoteCardLarge;