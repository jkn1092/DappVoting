import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Grid,
    GridItem,
    Heading,
    Input,
    Radio,
    RadioGroup,
    Stack,
    Table,
    TableContainer,
    Tbody,
    Th,
    Thead,
    Tr,
    useToast
} from "@chakra-ui/react";
import useEth from "../contexts/EthContext/useEth";
import {useEffect, useState} from "react";


function Voter() {

    const toast = useToast();
    const {state} = useEth();
    const [newProposition, setNewProposition] = useState();
    const [proposalsEvents, setProposalsEvents] = useState([]);
    const [voteValue, setVoteValue] = useState('1');
    const [voteEvents, setVoteEvents] = useState([]);


    const addProposition = async () => {
        try {
            await state.contract.methods.addProposal(newProposition).send({from: state.accounts[0]});
            toast({
                title: 'Congratulations',
                description: "Proposition added",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        } catch (err) {
            toast({
                title: 'Error',
                description: "An error was occurred",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        }
    }

    const vote = async () => {
        try {
            await state.contract.methods.setVote(voteValue).send({from: state.accounts[0]});
            toast({
                title: 'Congratulations',
                description: "Vote add",
                status: 'success',
                duration: 5000,
                isClosable: true,
            })
        } catch (err) {
            toast({
                title: 'Error',
                description: "An error was occurred",
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
                    for (const proposition of oldPropositions) {
                        const value = await state.contract.methods.getOneProposal(proposition.returnValues.proposalId).call({from: state.accounts[0]});
                        propositions.push({code: proposition.returnValues.proposalId, value: value.description});
                    }
                    setProposalsEvents(propositions)
                }
                if (state.contract) {
                    let oldVotes = await state.contract.getPastEvents('Voted', {
                        fromBlock: 0,
                        toBlock: 'latest'
                    });
                    let voters = [];
                    oldVotes.forEach(event => {
                        voters.push(event.returnValues);
                    });
                    setVoteEvents(voters)
                }
            })();
    }, [state.contract])

    return (
        <div>
            <Grid templateColumns='repeat(3, 1fr)' gap={3}>
                <GridItem maxW='75%' h='15' hidden={state.workFlowStatus !== '1'}>
                    <Card w={350}>
                        <CardHeader>
                            <Heading>Add Proposition</Heading>
                        </CardHeader>
                        <CardBody>
                            <Input
                                value={newProposition}
                                focusBorderColor='pink.400'
                                placeholder='Please add your proposition here..'
                                onChange={(e) => {
                                    setNewProposition(e.target.value);
                                }}
                            />
                        </CardBody>
                        <CardFooter>
                            <Button isDisabled={!newProposition} size='lg' onClick={() => addProposition()}>Add
                                Proposition</Button>
                        </CardFooter>
                    </Card>
                </GridItem>
                <GridItem w='100%' h='15' hidden={proposalsEvents.length === 0}>
                    <Card w={350}>
                        <CardHeader>
                            <Heading>Propositions list</Heading>
                        </CardHeader>
                        <CardBody>
                            <TableContainer>
                                <Table alignItems={"center"} alignSelf={"center"} variant='striped' colorScheme='gray'
                                       size='sm'>
                                    <Thead>
                                        <Tr>
                                            <Th>Code</Th>
                                            <Th>Description</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody alignItems={"center"}>
                                        {proposalsEvents ? proposalsEvents.map((item) => {
                                            return (<tr key={item.code}>
                                                <td>{item.code}</td>
                                                <td>{item.value}</td>
                                            </tr>)
                                        }) : <div/>}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem w='100%' h='15'
                          hidden={state.workFlowStatus !== '3' || proposalsEvents.length === 0 || voteEvents.find(v => v.voter == state.accounts[0])}>
                    <Card w={350}>
                        <CardHeader>
                            <Heading>Vote session</Heading>
                        </CardHeader>
                        <CardBody>
                            <RadioGroup onChange={setVoteValue} value={voteValue}>
                                <Stack direction='column'>
                                    {proposalsEvents.map(item => {
                                        return (<Radio value={item.code}>{item.code} {item.value}</Radio>)
                                    })}
                                </Stack>
                            </RadioGroup>
                        </CardBody>
                        <CardFooter>
                            <Button size='lg' onClick={() => vote()}>
                                Vote</Button>
                        </CardFooter>
                    </Card>
                </GridItem>
                <GridItem w='100%' h='15' hidden={!voteEvents.find(v => v.voter == state.accounts[0])}>
                    <Card w={350}>
                        <CardHeader>
                            <Heading>Your vote</Heading>
                        </CardHeader>
                        <CardBody>
                            {voteEvents.find(v => v.voter == state.accounts[0])?.proposalId}
                            : {proposalsEvents.find(v => v.code == voteEvents.find(v => v.voter == state.accounts[0])?.proposalId)?.value}
                        </CardBody>
                    </Card>
                </GridItem>
            </Grid>
        </div>
    )
}

export default Voter;