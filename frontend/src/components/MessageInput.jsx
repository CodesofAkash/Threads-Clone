import { Flex, Image, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, useDisclosure } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { IoSendSharp } from 'react-icons/io5'
import useShowToast from '../hooks/useShowToast';
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { BsFillImageFill } from 'react-icons/bs';
import usePreviewImg from '../hooks/usePreviewImg.js'
import { API_BASE_URL } from '../config/api'

const MessageInput = ({setMessages}) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom)

  const imageRef = useRef();
  const {onClose} = useDisclosure();

  const {handleImgChange, imgUrl, setImgUrl} = usePreviewImg();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() && !imgUrl) return;
    setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/messages/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({message, img: imgUrl, recipientId : selectedConversation.userId}),
        });

        const data = await res.json();
        if(data.error) {
          return showToast("Error", data.error, "error");
        }
        setMessages(prev => [...prev, data.newMessage]);
        setConversations(prevConvs => {
          const updatedConversations = prevConvs.map(conversation => {
            if(conversation._id === selectedConversation._id) {
              return {
                ...conversation,
                lastMessage: {
                  text: message,
                  sender: data.newMessage.sender
                },
                mock: false
              }
            }
            return conversation;
          })
          return updatedConversations;
        });
        setMessage("");
        setImgUrl("");
        onClose();
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
  }

  return (
    <Flex gap={2} alignItems={"center"}>
      <form onSubmit={handleSend} style={{flex: 95}} >
          <InputGroup>
              <Input w={"full"} placeholder='Type a message...' value={message} onChange={(e) => setMessage(e.target.value)} />
              <InputRightElement cursor="pointer" onClick={handleSend}>
                  {loading ? (
                    <Flex>
                    <Spinner size={"xs"} />
                  </Flex>
                  ) : (
                    <IoSendSharp />
                  )}
              </InputRightElement>
          </InputGroup>
      </form>

      <Flex flex={5} cursor={"pointer"}>
        <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
          <Input type={"file"} hidden ref={imageRef} onChange={handleImgChange} />
      </Flex>
      <Modal
      isOpen={imgUrl}
      onClose={() => {
        onClose();
        setImgUrl("");
      }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mt={5} w={"full"}>
              <Image src={imgUrl} />
            </Flex>
            <Flex justifyContent={"flex-end"} my={2}>
              {!loading ? (<IoSendSharp size={24} cursor={"pointer"} onClick={handleSend} />) : (<Spinner size={"md"} />)}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default MessageInput
