import { Flex, Text } from '@chakra-ui/react';

const Footer = () => {
    return (
        <Flex justifyContent="center" alignItems="center" width="100%"  p="2rem">
            <Text>&copy; Alyra Voting Project {new Date().getFullYear()}</Text>
        </Flex>
    )
}

export default Footer;