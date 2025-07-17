import { Flex, Box, Avatar, Text, Button } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import useFollow from '../hooks/useFollow';

const SuggestedUser = ({user, onUserFollowed}) => {

    const {followUser, updating, followed} = useFollow(user);

    const handleFollowClick = async () => {
        const result = await followUser();
        if (result && result.isFollowing && onUserFollowed) {
            // Remove user from suggested list when followed
            onUserFollowed(result.userId);
        }
    };

  return (
    <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
        <Flex gap={2} as={Link} to={`${user.username}`}>
            <Avatar src={user.profilePic} />
            <Box>
                <Text fontSize={"sm"} fontWeight={"bold"}>
                    {user.username}
                </Text>
                <Text color={"gray.light"} fontSize={"sm"}>
                    {user.name}
                </Text>
            </Box>
        </Flex>
        <Button
            size={"sm"}
            color={followed ? "black" : "white"}
            bg={followed ? "white" : "blue.400"}
            onClick={handleFollowClick}
            isLoading={updating}
            _hover={{
                color: followed ? "black" : "white",
                opacity: ".8",
            }}
        >
            {followed ? "Unfollow" : "Follow"}
        </Button>
    </Flex>
  )
}

export default SuggestedUser
