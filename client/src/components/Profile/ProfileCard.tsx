import { Avatar, Box, Stack, Text, Flex, Heading, Divider, Icon, HStack, Button } from "@chakra-ui/react"
import { IconType } from "react-icons"
import { FiBarChart2 } from 'react-icons/fi'
import { BiGroup } from 'react-icons/bi';
import { AiOutlineHeart } from 'react-icons/ai';
import { IoCalendarClearOutline } from 'react-icons/io5';
import { ButtonWText } from "../Shared/Buttons";


function Stat(props: { icon: IconType, stat: any, description: string }) {
  return <HStack>
    <Icon as={props.icon} />
    <Text fontWeight={'bold'}>{props.stat}</Text>
    <Text fontWeight={'thin'}>{props.description}</Text>
  </HStack>
}


function ProfileCard() {
  return <Box>
    <Stack shadow='md' bg={'white'} borderRadius={'md'} maxW='xs' p={5} direction={'column'}>
      <Avatar name='Dan Abrahmov' src='https://bit.ly/dan-abramov' size={'lg'} />
      <Heading size='md'>Steve Jobs</Heading>
      <Text size='sm'>steve@seas.upenn.edu</Text>
      <Divider pt={3}></Divider>
      <Stat icon={BiGroup} stat={2} description={'groups'} />
      <Stat icon={FiBarChart2} stat={3} description={'quotes made'} />
      <Stat icon={AiOutlineHeart} stat={'16k'} description={'total likes'} />
      <Divider pt={3}></Divider>
      <Stat icon={IoCalendarClearOutline} stat={''} description={'Joined 6 months ago'} />
      <ButtonWText>Edit</ButtonWText>
    </Stack>
  </Box>
}

export default ProfileCard