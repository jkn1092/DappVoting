import {Flex, Spacer} from '@chakra-ui/react';
import Header from './Header.jsx';
import Footer from './Footer';

const Layout = ({children}) => {
    return (
        <Flex paddingLeft={5} paddingRight={5} height={'100%'} bg={"gray.300"} marginLeft="300" marginRight="300"
              direction="column"
              position={'fixed'} top={0} left={0}>
            <Header/>
            <br/>
            <br/>
            <br/>
            {
                children
            }
            <br/>
            <br/>  <br/>

            <Footer/>
        </Flex>
    )
}
export default Layout;