import { Flex, Text } from '@chakra-ui/react';
import Header from './Header.jsx';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <Flex paddingLeft={5} paddingRight={5} justifyContent="space-between" alignItems="left" direction="column" height="80vh">
            <Header />
            {children}
            <Footer />
        </Flex>
    )
}

export default Layout;