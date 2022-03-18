import {
  Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Modal, ModalBody,
  ModalCloseButton, ModalContent,
  ModalHeader, ModalOverlay, useToast
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from 'react-query';
import { delete_group } from '../../fetcher';

type DeleteGroup = {
  group_id: number,
  access_token: string,
}

function DeleteGroupModal(props: {
  group_id: number,
  modalState: {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void
  },
  isOwner: boolean,
}) {
  const queryClient = useQueryClient();
  const deleteGroupToast = useToast();
  let access_token = sessionStorage.getItem("access_token") || '';
  const deleteGroupMutation = useMutation(
    (group: DeleteGroup) => delete_group(group.group_id, group.access_token),
    {

      onSuccess: () => {
        const message = props.isOwner ?
          'Successfully deleted group!' :
          'Successfully left group!';
        deleteGroupToast({
          title: message,
          status: 'info',
          duration: 9000,
          isClosable: true,
        });
        props.modalState.onClose();
      },
      onSettled: () => queryClient.invalidateQueries(['groups', access_token])
    })

  const onSubmit = async (e: any) => {
    e.preventDefault();
    let group_obj: DeleteGroup = {
      group_id: props.group_id,
      access_token: access_token
    }
    deleteGroupMutation.mutate(group_obj);
  }
  const err: any = deleteGroupMutation.error || {};

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={props.modalState.isOpen}
        onClose={props.modalState.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{props.isOwner ? "Delete" : "Leave"} Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={onSubmit}>
              <FormControl isInvalid={deleteGroupMutation.isError}>
                <FormLabel htmlFor='group-code'>Are you sure you want to {props.isOwner ? "delete" : "leave"} this group?</FormLabel>
                {props.isOwner ?
                  <FormHelperText>All overheard's in this group will also be deleted</FormHelperText> :
                  <></>
                }
                <FormErrorMessage>An error occurred: {err.message}</FormErrorMessage>
                <br />
                <Button type='submit' colorScheme='blue' mr={3} isLoading={deleteGroupMutation.isLoading}>
                  Confirm
                </Button>
                <Button onClick={props.modalState.onClose}>Cancel</Button>
              </FormControl>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DeleteGroupModal;