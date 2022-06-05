import { AddIcon } from '@chakra-ui/icons';
import {
  Badge, Button, FormControl, FormHelperText,
  FormLabel, Modal, ModalBody, ModalContent, ModalOverlay,
  Textarea, useDisclosure
} from '@chakra-ui/react';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { create_quote } from '../../fetcher';
import { Group, Quote } from '../../models';

type CreateQuote = {
  quote: string,
  group_id: number,
  access_token: string
}

function AddBar(props: { groups: Array<Group>, group_idx: number }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const queryClient = useQueryClient();
  const [quoteCode] = useState("");

  const currGroup = props.groups.reduce(
    (prev, curr) => curr.id === props.group_idx ? curr : prev)

  const addQuoteMutation = useMutation(
    (newQuote: CreateQuote) => create_quote(newQuote.quote, newQuote.group_id, newQuote.access_token),
    {
      onMutate: async (newQuote: CreateQuote) => {
        await queryClient.cancelQueries('groups')
        const previousQuotes = queryClient.getQueryData<Array<Quote>>(['quotes', newQuote.access_token])

        if (previousQuotes) {
          queryClient.setQueryData<Array<Quote>>(['quotes', newQuote.access_token],
            [
              ...previousQuotes,
              {
                message: newQuote.quote,
                time: Date.now().toString(),
                likes: 0,
                id: Math.random(),
              },
            ]
          )
        }
        return { previousQuotes }
      },
      onError: (err, variables, context) => {
        if (context?.previousQuotes) {
          queryClient.setQueryData<Array<Quote>>('quotes', context.previousQuotes)
        }
      },
      onSettled: (data, err, variables) => {
        queryClient.invalidateQueries(['quotes', variables?.access_token])
      },
    })

  const onSubmit = async (e: any) => {
    e.preventDefault()
    let quote = e.target.quoteblock.value;
    let access_token = sessionStorage.getItem('access_token') || '';
    let create_quote = {
      quote: quote,
      group_id: props.group_idx,
      access_token: access_token
    }
    addQuoteMutation.mutate(create_quote)
    onClose();
  }

  return (
    <>
      <Button
        onClick={onOpen}
        display={'flex'}
        flexGrow={{ base: 1, lg: 0 }}
        w={{ lg: "500px" }}
        ml={3}
        bg={'white'}
        alignItems={'center'}
        justifyContent={'left'}
        leftIcon={<AddIcon />}
        colorScheme='white'
        textColor={'gray.400'}
        rounded={'md'}
        boxShadow={'md'}
        variant='solid'
        overflow={'hidden'} textOverflow='ellipsis'
      >
        Add a new quote to {currGroup.group_name}
      </Button>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody pb={6}>
            <form onSubmit={onSubmit}>
              <FormControl>
                <FormLabel htmlFor='quoteblock'>Add a quote:</FormLabel>
                <Textarea h={"200px"} name={'quoteblock'}></Textarea>
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
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddBar;