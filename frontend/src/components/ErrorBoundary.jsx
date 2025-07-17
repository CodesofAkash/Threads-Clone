import React from 'react';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={8} textAlign="center">
          <VStack spacing={4}>
            <Heading size="lg" color="red.500">
              Oops! Something went wrong
            </Heading>
            <Text>
              We encountered an error while loading this component.
            </Text>
            <Button 
              colorScheme="blue" 
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
