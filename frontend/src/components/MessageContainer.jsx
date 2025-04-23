import { Avatar, Box, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import Message from './Message'
import MessageInput from './MessageInput'
import { useEffect, useRef, useState } from 'react'
import useShowToast from '../hooks/useShowToast'
import { useRecoilValue } from 'recoil'
import { selectedConversationAtom } from '../atoms/messagesAtom'
import userAtom from '../atoms/userAtom'

const MessageContainer = () => {

    const bottomRef = useRef();

    const [loading, setLoading] = useState(false);

    const showToast = useShowToast();

    const selectedConversation = useRecoilValue(selectedConversationAtom);    

    const [messages, setMessages] = useState([]);

    const user = useRecoilValue(userAtom);

    
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

    useEffect(() => {
          const getMessages = async () => {
            setLoading(true);
            setMessages([]);
            try {
              if(selectedConversation.mock) return;
              const res = await fetch(`/api/messages/${selectedConversation.userId}`);
              const data = await res.json();
              if(data.error) {
                return showToast("Error", data.error, "error");
              }
              setMessages(data.messages);
            } catch (error) {
              showToast("Error", error.message, "error");
            } finally {
              setLoading(false);
            }
          }

          getMessages();
    }, [selectedConversation.userId, selectedConversation.mock, showToast])


  return (
    <Flex flex={70} p={2} bg={useColorModeValue("gray.200", "gray.dark")} borderRadius={"md"} flexDirection={"column"} >
        <Flex w={"full"} h={12} alignItems={"center"} gap={2} >
            <Avatar src={selectedConversation.profilePic} size={"sm"} />
            <Text display={"flex"} alignItems={"center"} >{selectedConversation.username} <Image src='/verified.png' w={4} h={4} ml={1} /></Text>
        </Flex>

        <Divider />

        <Flex flexDir={"column"} gap={4} my={4} height={"400px"} overflowY={"auto"} p={2} >
            {loading ? (
                [...Array(5)].map((_, i) => (
                    <Flex key={i} gap={2} alignItems={"center"} p={1} borderRadius={"md"} alignSelf={i%2===0? 'flex-start' : 'flex-end'} >
                        {i % 2 === 0 && (
                            <SkeletonCircle size={7} />
                        )}
                        <Flex flexDir={"column"} gap={2}>
                            <Skeleton h={"8px"} w="250px" />
                            <Skeleton h={"8px"} w="250px" />
                            <Skeleton h={"8px"} w="250px" />
                        </Flex>
                        {i%2 !== 0 && (
                            <SkeletonCircle size={7} />
                        )}
                    </Flex>
                ))
            ) : (
            messages.map((message, i) => (
                <Message key={i} message={message} ownMessage={message?.sender === user._id} />
            ))
        )}

        <Box ref={bottomRef} />
        </Flex>

        <MessageInput setMessages={setMessages} />

    </Flex>
  )
}

export default MessageContainer
