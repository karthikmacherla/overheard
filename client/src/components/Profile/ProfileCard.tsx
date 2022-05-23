import { Avatar, Box, Stack, Text, Flex, Heading, Divider, Icon, HStack, Button } from "@chakra-ui/react"
import { IconType } from "react-icons"
import { FiBarChart2 } from 'react-icons/fi'
import { BiGroup } from 'react-icons/bi';
import { AiOutlineHeart } from 'react-icons/ai';
import { IoCalendarClearOutline } from 'react-icons/io5';
import { ButtonWText } from "../Shared/Buttons";
import { User } from "../../models";


function Stat(props: { icon: IconType, stat: any, description: string }) {
  return <HStack>
    <Icon as={props.icon} />
    <Text fontWeight={'bold'}>{props.stat}</Text>
    <Text fontWeight={'thin'}>{props.description}</Text>
  </HStack>
}


function ProfileCard(props: { user?: User, numQuotes: number, numLikes: number }) {
  return <Box>
    <Stack shadow='md' bg={'white'} borderRadius={'md'} maxW='xs' p={5} direction={'column'}>
      <Avatar name={props.user?.name} src={props.user?.profile_pic_url || ''} size={'lg'} />
      <Heading size='md'>{props.user?.name}</Heading>
      <Text size='sm'>{props.user?.email}</Text>
      <Divider pt={3}></Divider>
      {/* <Stat icon={BiGroup} stat={props.numGroups} description={'groups'} /> */}
      <Stat icon={FiBarChart2} stat={props.numQuotes} description={'quotes made'} />
      <Stat icon={AiOutlineHeart} stat={props.numLikes} description={'total likes'} />
      <Divider pt={3}></Divider>
      <Stat icon={IoCalendarClearOutline} stat={''} description={'Joined 6 months ago'} />
      <ButtonWText>Edit</ButtonWText>
    </Stack>
  </Box>
}

export default ProfileCard