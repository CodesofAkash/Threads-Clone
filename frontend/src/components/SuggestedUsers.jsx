import { Box, Flex, Skeleton, SkeletonCircle, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import SuggestedUser from './SuggestedUser';
import useShowToast from '../hooks/useShowToast';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import apiRequest from '../utils/apiRequest';

const SuggestedUsers = () => {

    const [loading, setLoading] = useState(true);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const user = useRecoilValue(userAtom);

    const showToast = useShowToast();

    useEffect(() => {
        const getSuggestedUsers = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            
            setLoading(true);
            try {
                const res = await apiRequest('/api/users/suggested', {
                    method: "GET",
                });
                
                if (!res) return; // Handle unauthorized
                
                const data = await res.json();
                if(data.error) {
                    showToast("Error", data.error, "error");
                    setSuggestedUsers([]);
                } else {
                    // Ensure data is an array
                    setSuggestedUsers(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                showToast("Error", error.message, "error");
                setSuggestedUsers([]);
            } finally {
                setLoading(false);
            }
        };
        getSuggestedUsers();
    }, [showToast, user])

    const handleUserFollowed = (userId) => {
        // Remove the followed user from the suggested list
        setSuggestedUsers(prev => prev.filter(user => user._id !== userId));
    };

  return (
    <>
        <Text mb={4} fontWeight={"bold"}>
            Suggested Users
        </Text>
        <Flex direction='column' gap={4}>
            {loading && [1,2,3,4,5].map((_, i) => (
                <Flex key={i} gap={2} alignItems={"center"} p={1} borderRadius={"md"}>
                    <Box>
                        <SkeletonCircle size={"10"} />
                    </Box>
                    <Flex w={"full"} flexDirection={"column"} gap={2}>
                        <Skeleton h={"8px"} w={"80px"} />
                        <Skeleton h={"8px"} w={"90px"} />
                    </Flex>

                    <Flex>
                        <Skeleton h={"20px"} w={"60px"} />
                    </Flex>
                </Flex>
            ))}

            {!loading && Array.isArray(suggestedUsers) && suggestedUsers.length > 0 && suggestedUsers.map((user, i) => (
                <SuggestedUser key={user._id || i} user={user} onUserFollowed={handleUserFollowed} />
            ))}
            
            {!loading && (!Array.isArray(suggestedUsers) || suggestedUsers.length === 0) && (
                <Text textAlign="center" color="gray.500">
                    No suggested users found
                </Text>
            )}
        </Flex>
    </>
  )
}

export default SuggestedUsers
