import { AddIcon } from '@chakra-ui/icons';
import {
  Badge, Button, FormControl, FormHelperText,
  FormLabel, Modal, ModalBody, ModalContent, ModalOverlay,
  Textarea, useDisclosure
} from '@chakra-ui/react';
import { useState } from 'react';


function AddBar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [quoteCode, setQuoteCode] = useState("");
  setQuoteCode("");

  return (
    <>
      <Button
        onClick={onOpen}
        display={'flex'}
        w={"500px"}
        mx={3}
        bg={'white'}
        alignItems={'center'}
        leftIcon={<AddIcon />}
        colorScheme='white'
        textColor={'gray.400'}
        rounded={'md'}
        boxShadow={'md'}
        variant='solid'>
        Add a new quote
      </Button>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel htmlFor='text'>Add a quote:</FormLabel>
              <Textarea h={"200px"}></Textarea>
              <br />
              <FormHelperText>Your unique organization name.</FormHelperText>
              <br />
              <div hidden={quoteCode === ""}>
                <Badge variant='subtle' colorScheme='green'>
                  Success! Your quote is live here: {quoteCode}
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

export default AddBar;