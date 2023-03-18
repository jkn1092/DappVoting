import {Button, Card, CardBody, CardFooter, CardHeader, Heading, Input, useToast} from "@chakra-ui/react";
import useEth from "../contexts/EthContext/useEth";
import React, {useEffect, useState} from "react";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'
import {DataTable} from "../components/DataTable";
import { createColumnHelper } from "@tanstack/react-table";

function Voter() {
    const toast = useToast();
    const {state} = useEth();
    const [newProposition, setNewProposition] = useState();
    const [proposalsEvents, setProposalsEvents] = useState();

    const addProposition = async () => {
        let t = await state.contract.methods.getOneProposal(1).call({from: state.accounts[0]});
        console.log(t.description);
        try {
            console.log(state);
            await state.contract.methods.addProposal(newProposition).send({from: state.accounts[0]});
            toast({
                title: 'Congratulations',
                description: "Proposition added",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        } catch (err) {
            console.log(err);
            toast({
                title: 'Error',
                description: "An error was occurred" + err,
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }
    useEffect(() => {
        (
            async () => {
                if (state.contract) {
                    let oldPropositions = await state.contract.getPastEvents('ProposalRegistered', {
                        fromBlock: 0,
                        toBlock: 'latest'
                    });
                    let propositions = [];
                    oldPropositions.forEach(event => {
                        propositions.push(event.returnValues.proposalId);
                    });
                    setProposalsEvents(propositions)
                }
            })();
    }, [state.contract])

    const getDescription = async (item) => {
        const d = await state.contract.methods.getOneProposal(item).call({from: state.accounts[0]});
        return d;
    }
    const UnitConversion = {
        fromUni,
        toUnit,
        factor,
    };

    const data = [
        {
            fromUnit: "inches",
            toUnit: "millimetres (mm)",
            factor: 25.4
        },
        {
            fromUnit: "feet",
            toUnit: "centimetres (cm)",
            factor: 30.48
        },
        {
            fromUnit: "yards",
            toUnit: "metres (m)",
            factor: 0.91444
        }
    ];

    const columnHelper = createColumnHelper<UnitConversion>();

    const columns = [
        columnHelper.accessor("fromUnit", {
            cell: (info) => info.getValue(),
            header: "To convert"
        }),
        columnHelper.accessor("toUnit", {
            cell: (info) => info.getValue(),
            header: "Into"
        }),
        columnHelper.accessor("factor", {
            cell: (info) => info.getValue(),
            header: "Multiply by",
            meta: {
                isNumeric: true
            }
        })
    ];

    return (
        <div>
            <TableContainer>
                <Table size='sm'>
                    <TableCaption>Propositions to be voted</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>code</Th>
                            <Th>value</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {proposalsEvents ? proposalsEvents.map(item => {
                            getDescription(item).then(data => {
                                console.log(data.description)
                                    return (
                                        <tr key={item}>
                                            <td>{item}</td>
                                            <td>gggg</td>
                                            <td>{data.description}</td>
                                        </tr>
                                    )
                                }
                            )
                        }) : <tr><td>ffff</td></tr>
                        }
                    </Tbody>
                </Table>
            </TableContainer>
            <DataTable columns={columns} data={data} />
            {(state.workFlowStatus === '1') ?
                <Card w={350}>
                    <CardHeader>
                        <Heading>Add Proposition</Heading>
                    </CardHeader>
                    <CardBody>
                        <Input
                            value={newProposition}
                            focusBorderColor='pink.400'
                            placeholder='Please add your proposition here..'
                            onChange={(e) => setNewProposition(e.target.value)}
                            autoFocus
                        />
                    </CardBody>
                    <CardFooter>
                        <Button isDisabled={!newProposition} size='lg' onClick={() => addProposition()}>Add
                            Proposition</Button>
                    </CardFooter>
                </Card> : <div></div>}
        </div>
    )
}

export default Voter;
