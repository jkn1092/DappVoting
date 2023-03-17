import {useEffect, useState} from "react";
import {Card, CardBody, CardHeader, Divider, Heading} from "@chakra-ui/react";
import useEth from "../contexts/EthContext/useEth";

function ListProposals() {
    const { state } = useEth();
    const [proposals, setProposals] = useState();

    const ListProposals = () => {
        if( proposals?.length > 0 )
        {
            return proposals.map( item => {
                let itemText = `Proposal Id '${item.proposalId}' registered`
                return(
                    <li key={item.proposalId}>{itemText}</li>
                )
            })
        }
        else
        {
            return (
                <p>No proposal yet</p>
            )
        }
    }

    useEffect(() => {
        (async function () {

            let oldEvents = await state.contract.getPastEvents('ProposalRegistered', {
                fromBlock: 0,
                toBlock: 'latest'
            });
            let proposalEvents=[];
            oldEvents.forEach(event => {
                proposalEvents.push({'proposalId': event.returnValues.proposalId});
            });

            setProposals(proposalEvents);
        })();
    }, [state.contract])

    return(
        <Card w={300}>
            <CardHeader>
                <Heading>Proposals</Heading>
            </CardHeader>
            <Divider/>
            <CardBody>
                <ListProposals/>
            </CardBody>
        </Card>
    )
}

export default ListProposals;