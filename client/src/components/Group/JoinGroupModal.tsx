import {
  Badge,
  Button, FormControl, FormErrorMessage, FormHelperText, FormLabel,
  Input, Modal, ModalBody,
  ModalCloseButton, ModalContent,
  ModalHeader, ModalOverlay, useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { join_group } from '../../fetcher';

type JoinGroup = {
  group_code: string,
  access_token: string
}

function JoinGroupModal(props: { isOpen: boolean, onOpen: () => void, onClose: () => void }) {
  const queryClient = useQueryClient();
  const joinGroupToast = useToast();
  let access_token = sessionStorage.getItem("access_token") || '';
  const joinGroupMutation = useMutation(
    (newGroup: JoinGroup) => join_group(newGroup.group_code, newGroup.access_token),
    {
      onSuccess: () => {
        joinGroupToast({
          title: 'Successfully joined group!',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        props.onClose();
      },
      onSettled: () => queryClient.invalidateQueries(['groups', access_token])
    })

  const onSubmit = async (e: any) => {
    e.preventDefault();
    let group_obj: JoinGroup = {
      group_code: e.target.groupcode.value,
      access_token: access_token
    }
    joinGroupMutation.mutate(group_obj);
  }
  const err: any = joinGroupMutation.error || {};

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Join an existing group</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={onSubmit}>
              <FormControl isInvalid={joinGroupMutation.isError}>
                <FormLabel htmlFor='group-code'>Group code</FormLabel>
                <Input id='group-code' type='text' name='groupcode' />
                <FormHelperText>Your unique group code</FormHelperText>
                <FormErrorMessage>An error occurred: {err.message}</FormErrorMessage>
                <br />
                <Button type='submit' colorScheme='blue' mr={3} isLoading={joinGroupMutation.isLoading}>
                  Join
                </Button>
                <Button onClick={props.onClose}>Cancel</Button>
              </FormControl>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default JoinGroupModal;