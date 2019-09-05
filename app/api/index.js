import * as define from 'generated/define';
import LongPolling from 'tv/api/long-polling';
import EventPublisher from 'zb/events/event-publisher';


/**
 */
export default class Api extends EventPublisher {
	/**
	 * @override
	 */
	constructor() {
		super();

		/**
		 * Fired with: {Data} data
		 * @const {string}
		 */
		this.EVENT_VIDEO_UPDATE = 'video-update';

		/**
		 * @type {?VideoUpdateData}
		 * @private
		 */
		this._data = null;

		const url = define.api.baseUrl + '/getVideoUpdate';

		const transport = new LongPolling(url, null);
		transport.on(transport.EVENT_MESSAGE, this._onMessage.bind(this));
		transport.start();
	}

	/**
	 * @return {?VideoUpdateData}
	 */
	getData() {
		return this._data;
	}

	/**
	 * @param {string} eventName
	 * @param {Object} rawData
	 * @private
	 */
	_onMessage(eventName, rawData) {
		/** @type {VideoUpdateData} */
		const data = {
			title: rawData['title'],
			url: rawData['url']
		};

		this._data = data;
		this._fireEvent(this.EVENT_VIDEO_UPDATE, data);
	}
}


/**
 * @typedef {{
 *     title: string,
 *     url: string
 * }}
 */
export let VideoUpdateData;
