import {send} from 'zb/http/xhr';
import {Method} from 'zb/http/http';
import EventPublisher from 'zb/events/event-publisher';


/**
 */
export default class LongPolling extends EventPublisher {
	/**
	 * @override
	 * @param {string} url
	 * @param {?Object} data
	 */
	constructor(url, data) {
		super();

		/**
		 * @const {number}
		 */
		this.REQUEST_DELAY = 5 * 1000;

		/**
		 * @const {number}
		 */
		this.ABORT_TIMEOUT = 60 * 1000;

		/**
		 * Fired with: {?Object} data
		 * @const {string}
		 */
		this.EVENT_MESSAGE = 'message';

		/**
		 * @type {string}
		 * @private
		 */
		this._url = url;

		/**
		 * @type {?Object}
		 * @private
		 */
		this._data = data;
	}

	/**
	 */
	start() {
		this._doCycleRequest();
	}

	/**
	 * @return {Promise<XMLHttpRequest>}
	 * @private
	 */
	_doCycleRequest() {
		const timeBeforeRequest = Date.now();

		return this
			._doRequest()
			.then(this._handleResponse.bind(this), () => {
				// hiding rejects
			})
			.then(() => {
				const timeAfterRequest = Date.now();
				const diff = timeAfterRequest - timeBeforeRequest;

				if (diff < this.REQUEST_DELAY) {
					return new Promise((resolve) => {
						setTimeout(resolve, this.REQUEST_DELAY - diff);
					});
				}
			})
			.then(this._doCycleRequest.bind(this));
	}

	/**
	 * @return {Promise<XMLHttpRequest>}
	 * @private
	 */
	_doRequest() {
		return send(this._url, {
			method: Method.GET,
			query: this._data,
			timeout: this.ABORT_TIMEOUT
		});
	}

	/**
	 * @param {XMLHttpRequest} xhr
	 * @private
	 */
	_handleResponse(xhr) {
		const data = JSON.parse(xhr.responseText);

		if (data) {
			this._data = /** @type {Object} */ (data);
			this._fireEvent(this.EVENT_MESSAGE, this._data);
		}
	}
}
