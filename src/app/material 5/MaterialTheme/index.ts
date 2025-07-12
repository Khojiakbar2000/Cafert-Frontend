import { createTheme } from '@mui/material/styles';
import { common } from '@mui/material/colors';
import shadow from './shadow';
import typography from './typography';
import { maxWidth } from '@mui/system';

/**
 * LIGHT THEME (DEFAULT)
 */
const light = {
	palette: {
		type: 'light',
		background: {
			default: '#f8f8ff',
			paper: common.white,
		},
		primary: {
			contrastText: '#d7b586',
			main: '#343434',
		},
		secondary: {
			contrastText: '#343434',
			main: '#d7b586',
		},
		text: {
			primary: '#343434',
			secondary: '#d7b586',
			dark: common.black,
		},
	},
	components: {
		MuiContainer: {
			styleOverrides: {
				root: {
					height: '100%',
				},
			},
		},
		MuiCssBaseline: {
			styleOverrides: {
				html: { height: '100%' },
				body: { background: '#f4f6f8', height: '100%', minHeight: '100%' },
			},
		},
	},
	shadow,
	typography,
};

// A custom theme for this app
const theme = createTheme({
	...light,
	components: {
		...light.components,
		MuiContainer: {
			styleOverrides: {
				...light.components?.MuiContainer?.styleOverrides,
				maxWidthLg: {
					'@media (min-width:1200px)': {
						maxWidth: '1300px',
					},
				},
			},
		},
	},
});

export default theme;
