import React from "react";
import {ChakraProvider, extendTheme} from '@chakra-ui/react'
import {EthProvider} from "../contexts/EthContext";


const theme = extendTheme({
    styles: {
        global: (props) => ({
            body: {
                bg: 'gray.100'
            }
        })
    }
})

export default function App({Component, pageProps}) {
    return (
        <EthProvider>
            <ChakraProvider theme={theme}>
                <Component {...pageProps}/>
            </ChakraProvider>
        </EthProvider>
    )
}