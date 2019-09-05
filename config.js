const path = require('path');
const revision = require('./scripts/get-revision')();

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
			baseUrl: 'http://localhost:8080'
		},
		git: {
			revision
		}
	},
	templates: [path.resolve(__dirname, 'app', 'templates')],
	skipVersionsCheck: true
});
