import {
  AddIcon, CopyIcon, HamburgerIcon, LinkIcon, StarIcon
} from '@chakra-ui/icons';
import {
  Box, Flex, Heading, Icon, IconButton, Link, Menu,
  MenuButton, MenuItem, MenuList, Spacer, Stack, Text, useColorModeValue, useDisclosure, useToast
} from '@chakra-ui/react';
import React from 'react';
import { FiMoreVertical, FiTrash, FiUsers } from 'react-icons/fi';
import { useQueryClient } from 'react-query';
import { Group, User } from '../models';
import AddGroupModal from './Group/AddGroupModal';
import DeleteGroupModal from './Group/DeleteGroupModal';
import JoinGroupModal from './Group/JoinGroupModal';
import ManageMembersModal from './Group/ManageMembersModal';


interface GProps {
  groups: Array<Group>,
  idx: number,
  setIdx: React.Dispatch<React.SetStateAction<number>>
}

class GroupTab extends React.Component<GProps, any> {
  render() {
    return (
      <Flex bg={'white'} p={3} h="100%" minH={'xl'} shadow='md' borderRadius={'md'}
        flexDirection={'column'} w='100%' minW={{ lg: '2xs', xl: 'xs' }} maxW={'xs'} >
        <Flex alignItems={'center'} >
          <Heading mb={1}>Group</Heading>
          <Spacer />
          <GroupMenu />
        </Flex>
        <Stack>
          {this.props.groups.map((item, i) => {
            return < GroupItemRow key={item.id} group={item} idx={item.id}
              onClick={() => this.props.setIdx(item.id)} />
          })}
        </Stack>
      </Flex >
    )
  }
}

const GroupMenu = () => {
  // Create modal states
  const { isOpen: isCreate, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isJoin, onOpen: onJoinOpen, onClose: onJoinClose } = useDisclosure();

  return (<Menu>
    <MenuButton
      as={IconButton}
      aria-label='Options'
      icon={<HamburgerIcon />}
      variant='outline'
    />
    <MenuList>
      <MenuItem icon={<AddIcon />} command='⌘T' onClick={onCreateOpen} >New Group</MenuItem>
      <MenuItem icon={<CopyIcon />} onClick={onJoinOpen}>Join Group</MenuItem>
    </MenuList>
    <AddGroupModal isOpen={isCreate} onOpen={onCreateOpen} onClose={onCreateClose} />
    <JoinGroupModal isOpen={isJoin} onOpen={onJoinOpen} onClose={onJoinClose} />
  </Menu>)
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
          <GroupItemMenu group={props.group}></GroupItemMenu>
        </Flex>
      </Stack>
    </Link>
  );
};


const GroupItemMenu = (props: { group: Group }) => {
  // Create modal states
  const memberState = useDisclosure();
  const deleteState = useDisclosure();
  const queryClient = useQueryClient();

  const access_token = sessionStorage.getItem("access_token") || '';
  const currOwner = queryClient.getQueryData<User>(['user', access_token]);
  const isOwner = props.group.owner_id === currOwner?.id;
  const copyPasteToast = useToast()

  const copyShareLink = () => {
    navigator.clipboard.writeText(props.group.group_code)
    copyPasteToast({
      title: 'Copied to clipboard!',
      description: `Group code: ${props.group.group_code}`,
      status: 'success',
      duration: 9000,
      isClosable: true,
    })
  }

  return (<Menu >
    <MenuButton
      as={IconButton}
      aria-label='Options'
      icon={<Icon color={'pink.400'} w={5} h={5} as={FiMoreVertical} />}
      variant='link'
    />
    <MenuList>
      <MenuItem icon={<StarIcon />} onClick={deleteState.onOpen} >My quotes</MenuItem>
      <MenuItem icon={<LinkIcon />} command='⌘C' onClick={copyShareLink} >Copy Group Code</MenuItem>
      {
        isOwner ?
          <><MenuItem icon={<FiUsers />} onClick={memberState.onOpen}>Manage Members</MenuItem>
            <MenuItem icon={<FiTrash />} onClick={deleteState.onOpen}>Delete Group</MenuItem></>
          : <MenuItem icon={<FiTrash />} onClick={deleteState.onOpen}>Leave Group</MenuItem>
      }
    </MenuList>
    <ManageMembersModal modalState={memberState} group_id={props.group.id} />
    <DeleteGroupModal group_id={props.group.id} modalState={deleteState} isOwner={isOwner} />
  </Menu>
  )
}

export default GroupTab;