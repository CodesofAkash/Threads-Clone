import { AddIcon } from '@chakra-ui/icons'
import { Button, CloseButton, Flex, FormControl, FormLabel, Image, Input, Text, Textarea, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from '../hooks/useShowToast'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react'
import  usePreviewImg from '../hooks/usePreviewImg'
import { BsFillImageFill } from 'react-icons/bs'
import postsAtom from '../atoms/postsAtom'
import { API_BASE_URL } from '../config/api'

const MAX_CHAR = 500;

const CreatePost = () => {
    const user = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const { handleImgChange, imgUrl, setImgUrl } = usePreviewImg();

    const [posts, setPosts] = useRecoilState(postsAtom);

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [postText, setpostText] = useState('');
    const imgRef = useRef();

    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);

    const textareaRef = useRef(null);

    const [loading, setLoading] = useState(false)

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [postText]);

    const handleTextChange = (e) => {
      const inputText = e.target.value;
      if(inputText.length > MAX_CHAR) {
        const truncatedText = inputText.slice(0, MAX_CHAR);
        setpostText(truncatedText);
        setRemainingChar(0);
      } else {
        setpostText(inputText);
        setRemainingChar(MAX_CHAR - inputText.length)
      }
    }

    const createPost = async () => {
        if (!user) {
            showToast('Error', 'To create a post, please login first!', 'error');
            return;
          }
      
          if (!postText.trim() && !imgUrl) {
            showToast('Validation', 'Please enter text or select an image!', 'warning');
            return;
          }
          if(loading) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/posts/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({text: postText, img: imgUrl})
            });
            const data = await res.json();
            if(data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            setPosts([data.post, ...posts]);
            showToast("Success", "Post created successfully", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
          setLoading(false);
          setpostText("");
          setImgUrl("");
          setRemainingChar(MAX_CHAR);
          onClose();
        }
    }

  return (
    <>
        <Button
        onClick={onOpen}
        position={"fixed"}
        bottom={"10"}
        right={"5"}
        bg={useColorModeValue("gray.300", "gray.dark")}
        size={{base: "sm", sm: "md", md: "lg"}}
        >
            <AddIcon />
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
          <FormControl mb={4}>
              <Textarea
                ref={textareaRef}
                placeholder="Post content goes here"
                value={postText}
                onChange={handleTextChange}
                resize="none"
                overflow="hidden"
                rows={1}
              />
              <Text fontSize={"xs"} fontWeight={"bold"} textAlign={"left"} margin={"1"} color={"gray.800"} >{`${remainingChar}/${MAX_CHAR}`}</Text>
              <Input type="file" hidden ref={imgRef} accept="image/*" onChange={handleImgChange} />
              <BsFillImageFill style={{marginLeft: "5px", cursor: "pointer"}} size={16} onClick={() => imgRef.current.click()} />
            </FormControl>

            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"} >
                <Image src={imgUrl} alt='Selected Img' />
                <CloseButton
                onClick={() => setImgUrl("")}
                bg={"gray.800"}
                position={"absolute"}
                top={2}
                right={2}
                />
              </Flex>
            )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost' onClick={createPost} isLoading={loading} >Create Post</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreatePost
