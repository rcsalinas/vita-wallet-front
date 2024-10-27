import React from 'react';
import Typography from '@mui/material/Typography';

function Caption1({ text }) {
	return (
		<Typography
			component="span"
			sx={{
				fontFamily: 'Open Sans',
				fontSize: '14px',
				color: '#010E11',
				lineHeight: '19.07px',
				fontWeight: 400,
			}}
		>
			{text}
		</Typography>
	);
}

export default Caption1;
