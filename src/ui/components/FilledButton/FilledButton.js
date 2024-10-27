import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';

function FilledButton({ type = '', text, disabled = false, loading = false }) {
	return (
		<LoadingButton
			type={type}
			loading={loading}
			loadingPosition="start"
			disabled={disabled}
			variant="contained"
			sx={{
				background: 'linear-gradient(90deg, #05BCB9 0%, #167287 100%)',
				color: 'white',
				height: '50px',
				'&.Mui-disabled': {
					background: '#DEE0E0',
					color: '#F9F9FA',
				},
			}}
		>
			{text}
		</LoadingButton>
	);
}

export default FilledButton;
