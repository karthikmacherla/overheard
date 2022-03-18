
import {
  Badge,
  Button, FormControl, FormErrorMessage, FormLabel,
  Input, Modal, ModalBody,
  ModalCloseButton, ModalContent,
  ModalHeader, ModalOverlay
} from '@chakra-ui/react';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { create_group } from '../../fetcher';
import { Group, User } from '../../models';


type CreateGroup = {
  group_name: string,
  description: string,
  access_token: string
}

function AddGroupModal(props: { isOpen: boolean, onOpen: () => void, onClose: () => void }) {
  // const { isOpen, onOpen, onClose } = useDisclosure()
  const queryClient = useQueryClient();
  const [groupCode, setGroupCode] = useState("");

  const addGroupMutation = useMutation(
    (newGroup) => create_group(newGroup.group_name, newGroup.description, newGroup.access_token),
    {
      // When mutate is called:
      onMutate: async (newGroup: CreateGroup) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries('groups')
        const previousGroups = queryClient.getQueryData<Array<Group>>(['groups', newGroup.access_token])
        const currOwner = queryClient.getQueryData<User>(['user', newGroup.access_token])

        // Optimistically update to the new value
        if (previousGroups) {
          queryClient.setQueryData<Array<Group>>(['groups', newGroup.access_token],
            [
              ...previousGroups,
              {
                id: Math.random() * 1000,
                group_name: newGroup.group_name,
                group_code: "DUMMY_CODE",
                description: newGroup.description,
                owner_id: Math.random() * 1000,
                owner: currOwner!
              },
            ]
          )
        }
        return { previousGroups }
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, variables, context) => {
        if (context?.previousGroups) {
          queryClient.setQueryData<Array<Group>>('groups', context.previousGroups)
        }
      },
      // Always refetch after error or success:
      onSettled: (data, err, variables) => {
        if (data && data.id) {
          setGroupCode(data.group_code);
        }
        queryClient.invalidateQueries(['groups', variables?.access_token])
      },
    })

  const onSubmit = async (e: any) => {
    e.preventDefault();
    let access_token = sessionStorage.getItem("access_token");
    access_token = access_token ? access_token : '';

    let group_obj: CreateGroup = {
      group_name: e.target.name.value,
      description: e.target.description.value,
      access_token: access_token
    }
    addGroupMutation.mutate(group_obj);
    // props.onClose();
  }

  const error: any = addGroupMutation.error || {};

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new group</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={onSubmit}>
              <FormControl isInvalid={addGroupMutation.isError}>
                <FormLabel htmlFor='group-name'>Group name</FormLabel>
                <Input id='group-name' type='text' name='name' />
                <FormLabel htmlFor='group-name'>Group description</FormLabel>
                <Input id='group-desc' type='text' name='description' />
                <br />
                <br />
                <FormErrorMessage>{error.message}</FormErrorMessage>
                <div hidden={groupCode === ""}>
                  <Badge variant='subtle' colorScheme='green'>
                    Success! Your group code is: {groupCode}
                  </Badge>
                  <br />
                  <br />
                </div>
                <Button type='submit' colorScheme='blue' mr={3} isLoading={addGroupMutation.isLoading}
                  hidden={addGroupMutation.isSuccess}>
                  Create!
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

export default AddGroupModal;