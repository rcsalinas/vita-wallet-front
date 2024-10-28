import React from 'react';
import { Box } from '@mui/material';
import wip from '../../../assets/images/wip.png';

function WipPage() {
	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
			}}
		>
			<img src={wip} alt="Work in progress" />
		</Box>
	);
}

export default WipPage;
