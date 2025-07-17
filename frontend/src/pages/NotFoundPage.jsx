import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box 
      minH="60vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      textAlign="center"
    >
      <VStack spacing={6}>
        <Heading size="2xl" color="gray.600">
          404
        </Heading>
        <Heading size="lg">
          Page Not Found
        </Heading>
        <Text color="gray.500" fontSize="lg">
          The page you're looking for doesn't exist.
        </Text>
        <VStack spacing={3}>
          <Button 
            colorScheme="blue" 
            onClick={() => navigate('/')}
            size="lg"
          >
            Go Home
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            size="md"
          >
            Go Back
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default NotFoundPage;
