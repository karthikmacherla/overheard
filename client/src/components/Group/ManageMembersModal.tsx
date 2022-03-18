import { Icon } from '@chakra-ui/icons';
import {
  Avatar, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text, useColorModeValue, useDisclosure, useToast, VStack
} from '@chakra-ui/react';
import { FiMoreVertical, FiTrash } from 'react-icons/fi';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { get_users_in_group, remove_user_from_group } from '../../fetcher';
import { User } from '../../models';
import ConfirmModal from '../Shared/ConfirmModal';

function ManageMembersModal(props: {
  group_id: number,
  modalState: { isOpen: boolean, onOpen: () => void, onClose: () => void }
}) {
  const access_token = sessionStorage.getItem("access_token") || '';
  const modal = props.modalState;
  // query to load members
  const membersQuery = useQuery(['members', props.group_id, access_token],
    () => get_users_in_group(props.group_id, access_token),
    {
      retry: (count, err: Error) => err.message !== 'Bad access token'
    });
  const members = membersQuery.data || [];

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={modal.isOpen} onClose={modal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage Members</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={0}>
              {
                members.map((item, i) =>
                  < MemberRow key={item.id} user={item} group_id={props.group_id} />
                )
              }
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}


function MemberRow(props: { user: User, group_id: number }) {
  const access_token = sessionStorage.getItem("access_token") || '';
  const queryClient = useQueryClient();
  const currOwner = queryClient.getQueryData<User>(['user', access_token]);

  return (
    <>
      <Flex justifyContent={'space-between'}
        width={"100%"}
        _hover={{ bg: useColorModeValue('gray.100', 'gray.900') }}
        alignItems={'center'}
        rounded={'md'}>
        <Flex justifyContent={'flex-start'} alignItems={'center'}>
          <Avatar name={props.user.name} src='#' m={2} mr={3} />
          <Text fontSize={'md'} fontWeight='bold'>{props.user.name}</Text>
        </Flex>
        {
          props.user.id === currOwner?.id ? <></> :
            < MemberMenu user={props.user} group_id={props.group_id} />
        }
      </Flex >
    </>)
}

/* Options to manage current member */
const MemberMenu = (props: { user: User, group_id: number }) => {
  // Create modal states
  const deleteState = useDisclosure();
  return (<Menu>
    <MenuButton
      as={IconButton}
      aria-label='Options'
      icon={<Icon w={5} h={5} as={FiMoreVertical} />}
      variant='link'
    />
    <MenuList>
      <MenuItem icon={<FiTrash />} onClick={deleteState.onOpen}>Remove User</MenuItem>
    </MenuList>
    <DeleteUserModal modalState={deleteState} user_id={props.user.id} group_id={props.group_id} />
  </Menu>
  )
}


/*
  Uses the abstracted away Confirm Modal to generate the UI for 
  confirming a mutation. 
  All of data/server handling is done outside (i.e. here) 
 */
const DeleteUserModal = function (props: {
  modalState: {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void
  },
  user_id: number,
  group_id: number,
}) {
  const deleteGroupToast = useToast();
  const queryClient = useQueryClient();
  const access_token = sessionStorage.getItem("access_token") || '';

  const deleteUserMutation = useMutation(
    (user: { id: number, group_id: number }) =>
      remove_user_from_group(user.id, user.group_id, access_token),
    {

      onSuccess: () => {
        const message = `Successfully removed user from group!"`
        deleteGroupToast({
          title: message,
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        props.modalState.onClose();
      },
      onSettled: () => queryClient.invalidateQueries(['members', props.group_id])
    })

  const data = { id: props.user_id, group_id: props.group_id }

  return <ConfirmModal
    modalState={props.modalState}
    title={'Remove user from group?'}
    description={'remove this user'}
    mutation={deleteUserMutation}
    data={data} ></ConfirmModal >
}

export default ManageMembersModal;