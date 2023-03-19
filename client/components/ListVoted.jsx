import useEth from "../contexts/EthContext/useEth";
import {useEffect, useState} from "react";
import {Card, CardBody, CardHeader, Divider, Heading} from "@chakra-ui/react";

function ListVoted() {
    const { state } = useEth();
    const [voted, setVoted] = useState();

    const ListVoted = () => {
        if( voted?.length > 0 )
        {
            return voted.map( item => {
                let itemText = `${item.voter} voted for Proposal ID '${item.proposalId}'`
                return(
                    <li key={item.voter}>{itemText}</li>
                )
            })
        }
        else
        {
            return (
                <p>No vote yet</p>
            )
        }
    }

    useEffect(() => {
        (async function () {

            let oldVotedEvents = await state.contract.getPastEvents('Voted', {
                fromBlock: 0,
                toBlock: 'latest'
            });
            let votedEvents=[];
            oldVotedEvents.forEach(event => {
                votedEvents.push({'voter':event.returnValues.voter, 'proposalId': event.returnValues.proposalId});
            });

            setVoted(votedEvents);
        })();
    }, [state.contract])

    return(
        <Card w={500}>
            <CardHeader>
                <Heading color={"gray.600"} >Voted List</Heading>
            </CardHeader>
            <Divider/>
            <CardBody>
                <ListVoted/>
            </CardBody>
        </Card>
    )
}

export default ListVoted;