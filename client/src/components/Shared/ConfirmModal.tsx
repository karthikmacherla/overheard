import {
  Button, FormControl, FormErrorMessage, FormHelperText, FormLabel, Modal, ModalBody,
  ModalCloseButton, ModalContent,
  ModalHeader, ModalOverlay
} from '@chakra-ui/react';
import { UseMutationResult } from 'react-query';

function ConfirmModal(props: {
  modalState: {
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void
  },
  title: string,
  description: string,
  helper_text?: string,
  toast_message?: string,
  mutation: UseMutationResult<any, any, any, any>
  data: any,
}) {
  const mutation = props.mutation
  const onSubmit = async (e: any) => {
    e.preventDefault();
    mutation.mutate(props.data);
  }
  const err: any = mutation.error || {};
  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={props.modalState.isOpen}
        onClose={props.modalState.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{props.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={onSubmit}>
              <FormControl isInvalid={mutation.isError}>
                <FormLabel htmlFor='group-code'>Are you sure you want to {props.description}?</FormLabel>
                {props.helper_text ?
                  <FormHelperText>props.helper_text</FormHelperText> :
                  <></>
                }
                <FormErrorMessage>An error occurred: {err.message}</FormErrorMessage>
                <br />
                <Button type='submit' colorScheme='blue' mr={3} isLoading={mutation.isLoading}>
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

export default ConfirmModal;