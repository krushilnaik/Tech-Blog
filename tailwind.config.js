module.exports = {
	mode: 'jit',
	purge: ['./src/views/**/*.handlebars', './src/public/css/**.css'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {}
	},
	plugins: []
};
