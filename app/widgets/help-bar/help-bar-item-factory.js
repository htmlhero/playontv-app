import app from 'generated/app';
import Keys from 'zb/device/input/keys';
import HelpBarItem, {Options as HelpBarItemOptions} from 'ui/widgets/help-bar/help-bar-item';


/**
 * @param {HelpBarItemOptions} options
 * @param {function()=} callback
 * @return {HelpBarItem}
 */
export const item = (options, callback) => {
	const item = new HelpBarItem(options);

	if (typeof callback === 'function') {
		item.on(item.EVENT_CLICK, callback);
	}

	return item;
};


/**
 * @param {string} label
 * @param {function()=} callback
 * @return {HelpBarItem}
 */
export const red = (label, callback) => {
	const options = {
		cssClass: '_red',
		label: label,
		keys: [Keys.RED]
	};

	return item(options, callback);
};


/**
 * @param {string} label
 * @param {function()=} callback
 * @return {HelpBarItem}
 */
export const green = (label, callback) => {
	const options = {
		cssClass: '_green',
		label: label,
		keys: [Keys.GREEN]
	};

	return item(options, callback);
};


/**
 * @param {string} label
 * @param {function()=} callback
 * @return {HelpBarItem}
 */
export const yellow = (label, callback) => {
	const options = {
		cssClass: '_yellow',
		label: label,
		keys: [Keys.YELLOW]
	};

	return item(options, callback);
};


/**
 * @param {string} label
 * @param {function()=} callback
 * @return {HelpBarItem}
 */
export const blue = (label, callback) => {
	const options = {
		cssClass: '_blue',
		label: label,
		keys: [Keys.BLUE]
	};

	return item(options, callback);
};


/**
 * @param {string} label
 * @param {function()=} callback
 * @return {HelpBarItem}
 */
export const play = (label, callback) => {
	const options = {
		cssClass: '_play',
		label: label,
		keys: [Keys.PLAY]
	};

	return item(options, callback);
};


/**
 * @param {string} label
 * @param {function()=} callback
 * @return {HelpBarItem}
 */
export const pause = (label, callback) => {
	const options = {
		cssClass: '_pause',
		label: label,
		keys: [Keys.PAUSE]
	};

	return item(options, callback);
};


/**
 * @param {string} label
 * @param {function()=} callback
 * @return {HelpBarItem}
 */
export const back = (label, callback) => {
	const options = {
		cssClass: '_back',
		label: label,
		keys: [Keys.BACK, Keys.EXIT]
	};

	return item(options, callback || app.back.bind(app));
};
