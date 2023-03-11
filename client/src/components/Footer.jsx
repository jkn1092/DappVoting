import {Box, Grid, Link, Typography} from "@mui/material";

function Footer() {
  return (
      <Grid container spacing={1}>
          <Grid item xs={12}>
              <Box
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  width={1}
                  flexDirection={{ xs: 'column', sm: 'row' }}
              >
                  <Typography fontWeight={700} >Team Hela/Jeremy</Typography>
                  <Box display={'flex'} alignItems={'center'}>
                      <Typography fontWeight={700} >More resources : </Typography>
                      <Box><Link href={"https://trufflesuite.com"}> Truffle </Link></Box>
                      <Box><Link href={"https://reactjs.org"}> React </Link></Box>
                      <Box><Link href={"https://soliditylang.org"}> Solidity </Link></Box>
                      <Box><Link href={"https://ethereum.org"}> Ethereum </Link></Box>
                  </Box>
              </Box>
          </Grid>
    </Grid>
  );
}

export default Footer;
