import React from 'react';
import Typography from '@mui/material/Typography';

function TitleTypography({ text }) {
	return (
		<Typography
			component="h1"
			sx={{
				fontFamily: 'Open Sans',
				fontSize: '48px',
				color: '#010E11',
				lineHeight: '65.37px',
				fontWeight: 600,
			}}
		>
			{text}
		</Typography>
	);
}

export default TitleTypography;
