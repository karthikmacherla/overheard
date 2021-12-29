
import { AddIcon } from '@chakra-ui/icons';
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Text,
  Badge
} from '@chakra-ui/react';
import { useState } from 'react';
import RoundButton from './Shared/RoundButton';


function AddGroupModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupCode, setGroupCode] = useState("");

  return (
    <>
      <RoundButton handle={onOpen}><AddIcon /></RoundButton>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new group</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel htmlFor='text'>Group name</FormLabel>
              <Input id='group-name' type='email' />
              <FormHelperText>Your unique organization name.</FormHelperText>
              <br />
              <div hidden={groupCode === ""}>
                <Badge variant='subtle' colorScheme='green'>
                  Success! Your group code is: {groupCode}
                </Badge>
                <br />
                <br />
              </div>
              <Button type='submit' colorScheme='blue' mr={3}>
                Create!
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddGroupModal;