require('dotenv').config();

const path = require('path');
const revision = require('./scripts/get-revision')();

const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:8080';
console.log('API base URL:', apiBaseUrl);

/**
 * @return {Object}
 */
module.exports = () => ({
	project: {
		name: 'tv',
		entry: path.resolve(__dirname, 'app/application.js'),
		src: path.resolve(__dirname, 'app')
	},
	platforms: {
		samsung: {
			widget: {
				widgetname: 'PlayOnTV'
			}
		}
	},
	define: {
		api: {
			baseUrl: apiBaseUrl
		},
		git: {
			revision
		}
	},
	templates: [path.resolve(__dirname, 'app', 'templates')],
	skipVersionsCheck: true
});
