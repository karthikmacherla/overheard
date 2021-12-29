import React from 'react';
import {
  Box,
  Link,
  Stack,
  Icon,
  Flex,
  Heading,
  useColorModeValue,
  Text,
  Spacer
} from '@chakra-ui/react'

import {
  AddIcon,
  ChevronRightIcon, LinkIcon,
} from '@chakra-ui/icons';

import RoundButton from './Shared/RoundButton';
import AddGroupModal from './AddGroupModal';

function GroupTab() {
  return (
    <Flex p={3} h="100%" flex={{ base: 1 }} flexDirection={'column'}>
      <Flex alignItems={'center'} >
        <Heading mb={1}>Group</Heading>
        <Spacer />
        <AddGroupModal />
      </Flex>
      <Stack >
        {GROUP_ITEMS.map((item) => (
          <GroupItem key={item.label} {...item} />
        ))}
      </Stack>
    </Flex>
  )
}

const GroupItem = ({ label, href, subLabel }: GroupItem) => {
  return (
    <Link
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'pink.400' }}
            fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}>
          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

interface GroupItem {
  label: string;
  subLabel?: string;
  children?: Array<GroupItem>;
  href?: string;
}

const GROUP_ITEMS: Array<GroupItem> = [
  {
    label: 'Local',
    subLabel: "the local quote block for anonymous opinions right around you",
    href: '#',
  },
  {
    label: 'Penn Masti',
    subLabel: "A fusion dance team bleep bloop",
    href: '#',
  },
  {
    label: 'Penn Masti',
    subLabel: "A fusion dance team bleep bloop",
    href: '#',
  }
];



export default GroupTab;