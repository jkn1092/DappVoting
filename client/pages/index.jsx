import React from "react";
import {Button, extendTheme, Stack} from '@chakra-ui/react'
import Layout from '../components/Layout'
import Link from "next/link";


const theme = extendTheme({
    styles: {
        global: (props) => ({
            body: {
                bg: 'gray.300'
            }
        })
    }
})

export default function Home() {
    return (
        <div>
            <Layout>
                <Stack spacing='6' direction='row' align='center'>
                    <Link href="/Admin">
                        <Button colorScheme='blue' size='lg'>Admin </Button>
                    </Link>
                    <Link href="/Voter">
                        <Button colorScheme='blue' size='lg'>Voter </Button>
                    </Link>
                </Stack>
            </Layout>
        </div>
    )
}