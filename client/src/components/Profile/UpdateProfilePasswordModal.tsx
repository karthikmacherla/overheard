import {
  Button, FormControl, FormErrorMessage, FormLabel,
  Input, Modal, ModalBody,
  ModalCloseButton, ModalContent,
  ModalHeader, ModalOverlay, useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { update_user_password } from '../../fetcher';
import { User } from '../../models';

interface UserPassword {
  old: string,
  new: string
}


function UpdateProfileModal(props: { isOpen: boolean, onOpen: () => void, onClose: () => void, user?: User }) {
  const changePasswordToast = useToast();
  let access_token = sessionStorage.getItem("access_token") || '';
  const [errMessage, setErr] = useState('');

  const updateUserPassMutation = useMutation(
    (pwd: UserPassword) => update_user_password(access_token, pwd.old, pwd.new),
    {
      onSuccess: () => {
        changePasswordToast({
          title: 'Successfully updated password!',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        props.onClose();
      },
      onError: (e: any) => setErr(e.message)
    })

  const onSubmit = async (e: any) => {
    e.preventDefault();
    let oldPass = e.target.oldpassword.value;
    let newPass = e.target.newpassword.value;
    let newPassConf = e.target.newpasswordconf.value;

    if (newPass !== newPassConf) {
      setErr("new passwords do not match");
      return;
    }
    setErr('');
    updateUserPassMutation.mutate({ old: oldPass, new: newPass });
  }

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={onSubmit}>
              <FormControl isInvalid={updateUserPassMutation.isError || errMessage !== ''} isRequired>
                <FormLabel htmlFor='oldpassword'>Old Password</FormLabel>
                <Input id='oldpassword' type='password' name='oldpassword' />
              </FormControl>
              <br />
              <FormControl isInvalid={updateUserPassMutation.isError || errMessage !== ''} isRequired>
                <FormLabel htmlFor='newpassword'>New Password</FormLabel>
                <Input id='newpassword' type='password' name='newpassword' />
              </FormControl>
              <br />
              <FormControl isInvalid={updateUserPassMutation.isError || errMessage !== ''} isRequired>
                <FormLabel htmlFor='newpasswordconf'>Confirm Password</FormLabel>
                <Input id='newpasswordconf' type='password' name='newpasswordconf' />
              </FormControl>
              <br />
              <FormControl isInvalid={updateUserPassMutation.isError || errMessage !== ''}>
                <Button type='submit' colorScheme='blue' mr={3} isLoading={updateUserPassMutation.isLoading}>
                  Update!
                </Button>
                <Button onClick={() => {
                  props.onClose()
                }}>Cancel</Button>
                <FormErrorMessage>An error occurred: {errMessage || ''}</FormErrorMessage>
              </FormControl>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateProfileModal;