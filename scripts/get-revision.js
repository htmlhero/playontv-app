const childProcess = require('child_process');

module.exports = () => {
	try {
		return childProcess
			.execSync('git rev-parse --short HEAD')
			.toString()
			.trim();
	} catch (e) {
		return 'unknown';
	}
};
