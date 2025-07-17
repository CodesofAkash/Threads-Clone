import React from 'react';
import { Box, Spinner, VStack, Text } from '@chakra-ui/react';

const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <Box 
      position="fixed" 
      top="0" 
      left="0" 
      right="0" 
      bottom="0" 
      bg="rgba(0, 0, 0, 0.5)" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      zIndex={9999}
    >
      <VStack spacing={4} bg="white" p={8} rounded="lg" shadow="lg">
        <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
        <Text fontSize="lg" fontWeight="medium">
          {text}
        </Text>
      </VStack>
    </Box>
  );
};

export default LoadingSpinner;
