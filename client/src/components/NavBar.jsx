import useEth from "../contexts/EthContext/useEth";
import {AppBar, Box, Toolbar, Typography} from "@mui/material";
import AdbIcon from '@mui/icons-material/Adb';
import {workflowStatusArray} from "./Utils";

function NavBar () {
    const { state } = useEth();

    const VisitorStatus = () => {
        if( state.web3 )
        {
            if( state.owner === state.accounts[0] ) {
                return `Admin : ${state.accounts[0]}`;
            }
            else {
                return `Voter : ${state.accounts[0]}`;
            }
        }
        else
        {
            return "Visitor";
        }
    }

    return(
        <Box
            display={'flex'}
            width={1}
            paddingBottom={2}
        >
            <AppBar position="static"
                    sx={{
                        top: 0
                    }}
            >
                <Toolbar>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        DApp Voting
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <VisitorStatus/>
                    </Typography>
                    <Typography>Current workflow status : {workflowStatusArray[state.workFlowStatus]}</Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default NavBar;