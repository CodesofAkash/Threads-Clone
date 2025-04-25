import { VStack, Box, Flex, Avatar, Text, MenuButton, Menu, Link, Portal, MenuList, MenuItem, Button } from "@chakra-ui/react"
import { BsInstagram } from "react-icons/bs"
import { CgMoreO } from "react-icons/cg"
import {useRecoilValue} from 'recoil'
import userAtom from '../atoms/userAtom.js'
import { useState } from "react"
import useShowToast from "../hooks/useShowToast.js"
import { Link as RouterLink } from "react-router-dom"
import useFollow from "../hooks/useFollow.js"

const UserHeader = ({user}) => {

    const {name, username, bio, profilePic, followers, following} = user;

    const currentUser = useRecoilValue(userAtom);

    const {followUser, updating, followed} = useFollow(user);
    const showToast = useShowToast();

    const shouldTruncate = bio.length > 150;
    const [showMore, setShowMore] = useState(false);
    const toggleBio = () => setShowMore(!showMore)

    const copyUrl = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            showToast("Link copied to clipboard", currentUrl, "success");
        }).catch(err => {
            showToast("Error", err.message, "error");
        })
    }

  return (
    <VStack gap={4} alignItems={"start"}>
        <Flex justifyContent={"space-between"} w={"full"}>
            <Box>
                <Text fontSize={"2xl"} fontWeight={"bold"}>
                    {name}
                </Text>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"sm"}>{username}</Text>
                    <Text fontSize={
                        {base: "xs", md: "sm", lg: "md"}
                    } bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
                    threads.net
                    </Text>
                </Flex>
            </Box>
            <Box>
                <Avatar name={name} src={profilePic} size={
                    {base: "md", md: "xl" }
                } />
            </Box>
        </Flex>

        <Flex flexDir={"column"} justifyContent={"center"} alignItems={"start"}>
            <Text>
                {shouldTruncate && !showMore ? `${bio.substring(0,150)}...` : bio}
            </Text>

            {shouldTruncate && (
            <Button
            variant="link"
            color="blue.500"
            size="sm"
            onClick={toggleBio}
            mt={1}
            >
            {showMore ? "Show less" : "Show more"}
            </Button>
            )}
       </Flex>

        { currentUser?._id === user._id ? (
            <Link as={RouterLink} to="/update">
                <Button size="sm">Update Profile</Button>
            </Link>
        ) : (
            <Button size={"sm"} onClick={followUser} isLoading={updating}>{followed? 'Unfollow' : 'Follow'}</Button>
        )}

        <Flex w={"full"} justifyContent={"space-between"}>
            <Flex gap={2} alignItems={"center"}>
                <Text color={"gray.light"}>{followers.length} followers</Text>
                <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                <Text color={"gray.light"}>{following.length} following</Text>
                <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                <Link color={"gray.light"} to={"https://www.instagram.com"} target="_blank">instagram.com</Link>
            </Flex>
            <Flex>
                <Box className="icon-container">
                    <BsInstagram size={24} cursor={"pointer"} />
                </Box>
                <Box className="icon-container">
                    <Menu>
                        <MenuButton>
                            <CgMoreO size={24} cursor={"pointer"} />
                        </MenuButton>
                        <Portal>
                            <MenuList bg={"gray.dark"}>
                                <MenuItem bg={"gray.dark"} onClick={copyUrl}>Copy link</MenuItem>
                            </MenuList>
                        </Portal>
                    </Menu>
                </Box>
            </Flex>
        </Flex>

        <Flex w={"full"} >
            <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb={3} cursor={"pointer"}>
                <Text fontWeight={"bold"}>Threads</Text>
            </Flex>
            <Flex flex={1} borderBottom={"1px solid gray"} color={"gray.light"} justifyContent={"center"} pb={3} cursor={"pointer"}>
                <Text fontWeight={"bold"}>Replies</Text>
            </Flex>
        </Flex>
    </VStack>
  )
}

export default UserHeader
