import {
  Avatar,
  Button, FormControl, FormErrorMessage, FormHelperText, FormLabel,
  Input, Modal, ModalBody,
  ModalCloseButton, ModalContent,
  ModalHeader, ModalOverlay, useToast,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { update_user_details } from '../../fetcher';
import { User } from '../../models';

type UserDetails = {
  file: any,
  name: string
}

function UpdateProfileModal(props: { isOpen: boolean, onOpen: () => void, onClose: () => void, user?: User }) {
  const queryClient = useQueryClient();
  const joinGroupToast = useToast();
  let access_token = sessionStorage.getItem("access_token") || '';
  const updateUserMutation = useMutation(
    (details: UserDetails) => update_user_details(access_token, details.file, details.name),
    {
      onSuccess: () => {
        joinGroupToast({
          title: 'Successfully updated profile!',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        props.onClose();
      },
      onSettled: () => queryClient.invalidateQueries(['user', access_token])
    })

  const [file, setFile] = useState(null);
  const inputFileRef = useRef<any>();
  const [imagePreviewUrl, setImagePreviewUrl] = useState(props.user?.profile_pic_url || '');
  const handleImageUpload = (e: any) => {
    const [file] = e.target.files;
    if (file) {
      setFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      console.log(file);
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    let userDetails = {
      file: file,
      name: e.target.name.value,
    }

    updateUserMutation.mutate(userDetails);
  }
  const err: any = updateUserMutation.error || {};

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={onSubmit}>
              <FormControl isInvalid={updateUserMutation.isError}>
                <FormLabel htmlFor='avatar'>Avatar</FormLabel>
                <Avatar size={'lg'} src={imagePreviewUrl} name={props.user?.name} onClick={() => inputFileRef.current.click()} cursor={'pointer'} ></Avatar>
                <Input id='avatar' type='file' name='name' accept='image/*' multiple={false} onChange={handleImageUpload}
                  ref={inputFileRef} display={'none'} />
                <FormHelperText>Click to update picture (jpg/png) </FormHelperText>
                <FormErrorMessage>An error occurred: {err.message}</FormErrorMessage>
                <br />
                <FormLabel htmlFor='name'>Name</FormLabel>
                <Input id='name' type='text' name='name' placeholder={props.user?.name} />
                <FormHelperText>Your full name</FormHelperText>
                <FormErrorMessage>An error occurred: {err.message}</FormErrorMessage>
                <br />
                <Button type='submit' colorScheme='blue' mr={3} isLoading={updateUserMutation.isLoading}>
                  Update!
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

export default UpdateProfileModal;