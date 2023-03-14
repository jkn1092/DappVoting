import useEth from "../contexts/EthContext/useEth";
import {useEffect, useState} from "react";
import {Divider, List, ListItem, ListItemText} from "@mui/material";

function ListVoted() {
    const { state } = useEth();
    const [voted, setVoted] = useState();

    const ListVoted = () => {
        return voted.map( item => {
            let itemText = `${item.voter} voted for Proposal ${item.proposalId}`
            return(
                <ListItem key={item.voter}>
                    <ListItemText primary={itemText} />
                    <Divider/>
                </ListItem>
            )
        })
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
        <>
            {voted?.length > 0 ?
                <div>
                    <h4>List voted:</h4>
                    <List component="nav">
                        <ListVoted/>
                    </List>
                </div>
                :
                <></>
            }
        </>
    )
}

export default ListVoted;