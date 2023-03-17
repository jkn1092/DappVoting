import useEth from "../contexts/EthContext/useEth";
import {useEffect, useState} from "react";

function ListVoted() {
    const { state } = useEth();
    const [voted, setVoted] = useState();

    const ListVoted = () => {
        return voted.map( item => {
            return(
                <p key={item.voter}>{item.voter} voted for Proposal {item.proposalId}</p>
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
                    <ListVoted/>
                </div>
                :
                <></>
            }
        </>
    )
}

export default ListVoted;