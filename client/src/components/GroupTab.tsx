import React from 'react';
import {
  ChevronRightIcon
} from '@chakra-ui/icons';
import {
  Box, Flex,
  Heading, Icon, Link, Spacer, Stack, Text, useColorModeValue
} from '@chakra-ui/react';
import AddGroupModal from './AddGroupModal';
import { Group } from '../models';


interface GProps {
  groups: Array<Group>,
  idx: number,
  setIdx: React.Dispatch<React.SetStateAction<number>>
}

class GroupTab extends React.Component<GProps, any> {
  render() {
    return (
      <Flex p={3} h="100%" flex={{ base: 1 }} flexDirection={'column'} >
        <Flex alignItems={'center'} >
          <Heading mb={1}>Group</Heading>
          <Spacer />
          <AddGroupModal />
        </Flex>
        <Stack >
          {this.props.groups.map((item, i) => {
            return < GroupItemRow key={item.id} group={item} idx={item.id}
              onClick={() => this.props.setIdx(item.id)} />
          })}
        </Stack>
      </Flex >
    )
  }
}

const GroupItemRow = (props: { group: Group, idx: number, onClick: () => void }) => {
  return (
    <Link
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      onClick={props.onClick}
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'pink.400' }}
            fontWeight={500}>
            {props.group.group_name}
          </Text>
          <Text fontSize={'sm'}>{props.group.description}</Text>
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
  group: Group,
  loc: number
}


export default GroupTab;