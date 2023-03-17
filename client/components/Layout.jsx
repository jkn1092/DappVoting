import { Flex, Text } from '@chakra-ui/react';
import Header from './Header.jsx';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <Flex justifyContent="space-between" alignItems="left" direction="column" height="100vh">
            <Header />
            {children}
            <Footer />
        </Flex>
    )
}

export default Layout;