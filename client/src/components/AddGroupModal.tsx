
import { AddIcon } from '@chakra-ui/icons';
import {
  Button, FormControl, FormHelperText, FormLabel,
  Input, Modal, ModalBody,
  ModalCloseButton, ModalContent,
  ModalHeader, ModalOverlay, useDisclosure
} from '@chakra-ui/react';
import { create_group } from '../fetcher';
import { RoundButton } from './Shared/Buttons';

function AddGroupModal() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onSubmit = async (e: any) => {
    let access_token = localStorage.getItem("access_token");
    let name = e.target.name.value;
    let description = e.target.description.value;
    await create_group(name, description, access_token).then(res => res.json());

    //todo
  }
  // Support group code TODO!
  // const [groupCode, setGroupCode] = useState(""); 
  return (
    <>
      <RoundButton handle={onOpen}><AddIcon /></RoundButton>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new group</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={onSubmit}>
              <FormControl>
                <FormLabel htmlFor='group-name'>Group name</FormLabel>
                <Input id='group-name' type='text' name='name' />
                <FormHelperText>Your unique organization name.</FormHelperText>
                <FormLabel htmlFor='group-name'>Group description</FormLabel>
                <Input id='group-desc' type='text' name='description' />
                <br />
                {/* <div hidden={groupCode === ""}>
                  <Badge variant='subtle' colorScheme='green'>
                    Success! Your group code is: {groupCode}
                  </Badge>
                  <br />
                  <br />
                </div> */}
                <Button type='submit' colorScheme='blue' mr={3}>
                  Create!
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </FormControl>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddGroupModal;