import {
  Button, FormControl, FormErrorMessage, FormLabel, Modal, ModalBody,
  ModalCloseButton, ModalContent,
  ModalHeader, ModalOverlay, useToast
} from '@chakra-ui/react';
import { useMutation, useQueryClient } from 'react-query';
import { delete_quote } from '../../fetcher';

function DeleteQuoteModal(props: {
  quote_id: number,
  modalState: {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void
  },
}) {
  const queryClient = useQueryClient();
  const deleteQuoteToast = useToast();
  let access_token = sessionStorage.getItem("access_token") || '';
  const deleteQuoteMutation = useMutation(
    (quote_id: number) => delete_quote(access_token, quote_id),
    {

      onSuccess: () => {
        const message = 'Successfully deleted quote!';
        deleteQuoteToast({
          title: message,
          status: 'info',
          duration: 9000,
          isClosable: true,
        });
        props.modalState.onClose();
      },
      onSettled: () => queryClient.invalidateQueries(['myQuotes', access_token])
    })

  const onSubmit = async (e: any) => {
    e.preventDefault();
    deleteQuoteMutation.mutate(props.quote_id);
  }
  const err: any = deleteQuoteMutation.error || {};

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={props.modalState.isOpen}
        onClose={props.modalState.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Quote</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={onSubmit}>
              <FormControl isInvalid={deleteQuoteMutation.isError}>
                <FormLabel htmlFor='quote-code'>Are you sure you want to delete this quote?</FormLabel>
                <FormErrorMessage>An error occurred: {err.message}</FormErrorMessage>
                <br />
                <Button type='submit' colorScheme='blue' mr={3} isLoading={deleteQuoteMutation.isLoading}>
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

export default DeleteQuoteModal;