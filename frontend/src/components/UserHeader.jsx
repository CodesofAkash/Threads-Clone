import { VStack, Box, Flex, Avatar, Text, MenuButton, Menu, Link, Portal, MenuList, MenuItem, Button } from "@chakra-ui/react"
import { BsInstagram } from "react-icons/bs"
import { CgMoreO } from "react-icons/cg"
import {useRecoilValue} from 'recoil'
import userAtom from '../atoms/userAtom.js'
import { useEffect, useState } from "react"
import useShowToast from "../hooks/useShowToast.js"
import { Link as RouterLink } from "react-router-dom"

const UserHeader = ({user}) => {
    const currentUser = useRecoilValue(userAtom);

    const showToast = useShowToast()

    const {name, username, bio, profilePic, followers, following} = user;

    const [followed, setFollowed] = useState(false);
    const [loadingFollowStatus, setLoadingFollowStatus] = useState(true);

    useEffect(() => {
        const checkFollowStatus = async () => {
            try {
                const res = await fetch(`/api/users/follow-status/${user._id}`);
                const data = await res.json();
                setFollowed(data.followed);
            } catch (err) {
                console.error("Failed to check follow status", err);
            } finally {
                setLoadingFollowStatus(false);
            }
        };

        if (user && user._id !== currentUser._id) {
            checkFollowStatus();
        }
    }, [user, user._id, currentUser._id]);


    const [updating, setUpdating] = useState(false);

    const copyUrl = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            showToast("Link copied to clipboard", currentUrl, "success");
        }).catch(err => {
            showToast("Error", err.message, "error");
        });
    }

    
    const followUser = async () => {
        if(!currentUser) {
            showToast("Error", "Please login to follow", "error");
            return;
        }
        if(updating) return;
        setUpdating(true);
        try {
            const res = await fetch(`/api/users/follow/${user._id}`);
            const data = await res.json();
            if(data.error) {
                showToast("Error", data.error, "error");
                return;
            }

            //simulating adding and removing followers, it only affects client side
            if(followed) {
                showToast("Success", `Unfollowed ${user.name}`, "success");
                user.followers.pop();
            } else {
                showToast("Success", `Followed ${user.name}`, "success");
                user.followers.push(currentUser._id);
            }

            setFollowed(!followed);
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setUpdating(false);
        }    
    };


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

        <Text>{bio}</Text>

        {currentUser._id === user._id ? (
            <Link as={RouterLink} to="/update">
                <Button size="sm">Update Profile</Button>
            </Link>
        ) : (
            <Button onClick={followUser} isLoading={updating || loadingFollowStatus}>{followed? 'Unfollow' : 'Follow'}</Button>
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
