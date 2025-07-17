import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import {SearchIcon} from '@chakra-ui/icons'
import React, { useEffect, useState } from 'react'
import Conversation from '../components/Conversation'
import {GiConversation} from 'react-icons/gi'
import MessageContainer from '../components/MessageContainer'
import useShowToast from '../hooks/useShowToast'
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { API_BASE_URL } from '../config/api'
import { useSocket } from '../context/SocketContext'

const ChatPage = () => {

  const showToast = useShowToast();

  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);

  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [loading, setLoading] = useState(false);
  const [convoLoading, setConvoLoading] = useState(false);

  const [searchText, setSearchText] = useState("");

  const user = useRecoilValue(userAtom);

  const {socket, onlineUsers} = useSocket();

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/messages/conversations`, {
          credentials: "include",
        });
        const data = await res.json();
        if(data.error) {
         showToast("Error", data.error, "error");
         return;
        }
        setConversations(data.conversations);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    }
    getConversations();
  }, [showToast, setConversations]);

  useEffect(() => {
    socket?.on("messagesSeen", ({conversationId}) => {
      setConversations(prev => {
        const updatedConversations = prev.map(convo => {
          if(convo._id === conversationId) {
            return {
              ...convo,
              lastMessage: {
                ...convo.lastMessage,
                seen: true
              }
            }
          }
          return convo;
        });
        return updatedConversations;
      })
    })
  }, [socket, setConversations])

  const handleConversationSearch = async (e) => {
    e?.preventDefault();
    setConvoLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/profile/${searchText}`, {
          credentials: "include",
        });
        const data = await res.json();
        if(data.error) {
          showToast("Error", data.error, "error");
          setSearchText("");
        }
        const searchedUser = data.user.user;

        const messagingYourself = searchedUser._id === user._id;
        if(messagingYourself) {
          showToast("Error", "You cannot message yourself", "error");
          setSearchText("");
          return;
        }

        const conversationAlreadyExists = conversations.find(conversation => conversation.participants[0]._id === searchedUser._id);
        if(conversationAlreadyExists) {
          setSelectedConversation({
            _id: conversationAlreadyExists._id,
            userId: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic
          });
          setSearchText("");
          return;
        }

        const mockConversation = {
          mock: true,
          lastMessage: {
            text: "",
            sender: ""
          },
          _id: Date.now(),
          participants: [
            {
              _id: searchedUser._id,
              username: searchedUser.username,
              profilePic: searchedUser.profilePic
            }
          ]
        }

        setConversations((prev) => [mockConversation, ...prev]);
        setSelectedConversation({
          _id: mockConversation._id,
          userId: mockConversation.participants[0]._id,
          username: mockConversation.participants[0].username,
          profilePic: mockConversation.participants[0].profilePic,
          mock: mockConversation.mock
        })

        setSearchText("");
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setConvoLoading(false);
      }
  }

  return (
    <Box position={"absolute"} left={"50%"} transform={"translateX(-50%)"} w={{
      base: "100%", md: "%", lg: "750px"
    }} p={4}>
        <Flex gap={5} flexDirection={{
          base: "column", md: "row"
        }} maxW={{sm: "400px", md: "full"}} mx={"auto"}>
          <Flex flex={30} gap={2} flexDirection={"column"} maxW={{
            sm: "250px", md: "full"
          }} mx={"auto"}>
            <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
              Your Conversations
            </Text>
            <form onSubmit={handleConversationSearch}>
              <Flex alignItems={"center"} gap={2}>
                <Input placeholder='Search for a user' onChange={(e) => setSearchText(e.target.value)} value={searchText}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConversationSearch(e);
                }}
                />
                <Button onClick={handleConversationSearch} isLoading={convoLoading} size={"sm"}><SearchIcon /></Button>
              </Flex>
            </form>

            {loading && (
              [0,1,2,3,4,].map((_, i) => 
                <Flex key={i} gap={4} alignItems={"center"} p={1} borderRadius={"md"}>
                  <Box>
                    <SkeletonCircle size={"10"} />
                  </Box>
                  <Flex w={"full"} flexDirection={"column"} gap={3}>
                    <Skeleton h={"10px"} w={"80px"} />
                    <Skeleton h={"8px"} w={"90%"} />
                  </Flex>
                </Flex>
              ))
            }

            {!loading && 
              conversations?.map((conversation, i) => (
                <Conversation key={i} isOnline={onlineUsers.includes(conversation.participants[0]._id)} conversation={conversation} />
              ))
            }

          </Flex>
          
          {!selectedConversation._id && (
            <Flex flex={70} borderRadius={"md"} p={2} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} h={"400px"} >
              <GiConversation size={100} />
              <Text fontSize={20}>Select a conversation to start messaging</Text>
            </Flex>
        )}

          {selectedConversation._id && <Flex flex={70}><MessageContainer /></Flex>}

        </Flex>
    </Box>
  )
}

export default ChatPage
