import {
  Button, FormControl, FormErrorMessage, FormLabel,
  Input, Modal, ModalBody,
  ModalCloseButton, ModalContent,
  ModalHeader, ModalOverlay, Textarea, useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { BsTrash } from 'react-icons/bs';
import { useMutation, useQueryClient } from 'react-query';
import { update_quote } from '../../fetcher';
import { User } from '../../models';

interface EditQuoteInfo {
  quote_id: number
  message: string,
}


function EditQuoteModal(props: { isOpen: boolean, onOpen: () => void, onClose: () => void, quote_id: number, curr_message: string }) {
  const editQuoteToast = useToast();
  const queryClient = useQueryClient();
  let access_token = sessionStorage.getItem("access_token") || '';
  let quote_id = props.quote_id;

  const editQuoteMutation = useMutation(
    (message: string) => update_quote(access_token, message, quote_id),
    {
      onSuccess: () => {
        editQuoteToast({
          title: 'Successfully updated quote!',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        props.onClose();
        queryClient.invalidateQueries(['quote', access_token, quote_id])
      }
    })

  const onSubmit = async (e: any) => {
    e.preventDefault();
    let message = e.target.message.value;
    editQuoteMutation.mutate(message);
  }

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Quote</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={onSubmit}>
              <FormControl isRequired>
                <FormLabel htmlFor='message'>Message</FormLabel>
                <Textarea h={"200px"} name={'message'} defaultValue={props.curr_message}></Textarea>
              </FormControl>
              <br />
              <FormControl isInvalid={editQuoteMutation.isError}>
                <Button type='submit' colorScheme='blue' mr={3} isLoading={editQuoteMutation.isLoading}>
                  Update!
                </Button>
                <Button colorScheme='red' mr={3} leftIcon={<BsTrash />} isLoading={editQuoteMutation.isLoading}>
                  Delete
                </Button>
                <Button onClick={() => {
                  props.onClose()
                }}>Cancel</Button>
                <FormErrorMessage>An error occurred</FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditQuoteModal;