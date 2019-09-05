import {TemplateOptions} from 'cutejs-lib/cute-library';
import app from 'generated/app';
import * as template from 'generated/cutejs/tv/popups/simple/simple.jst';
import Base, {
	Status as BaseStatus,
	StatusHandler as BaseStatusHandler
} from 'tv/popups/base/base';
import Layer from 'zb/layers/layer';


/**
 */
export default class Simple extends Base {
	/**
	 * @override
	 */
	constructor(params) {
		super();

		/**
		 * @type {function(template.In, TemplateOptions): template.Out}
		 * @protected
		 */
		this._template = template.render;

		/**
		 * @type {template.In}
		 * @protected
		 */
		this._templateIn = params;

		/**
		 * @type {template.Out}
		 * @protected
		 */
		this._templateOut;
	}

	/**
	 * @override
	 */
	_onRender() {
		super._onRender();

		this._addContainerClass('p-simple');

		this._templateOut.buttons.forEach((button) => {
			button.on(button.EVENT_CLICK, (eventName, data) => this.close(data.status));
		});
	}

	/**
	 * @param {Input} params
	 * @param {Layer=} layer
	 * @return {Simple}
	 */
	static open(params, layer) {
		const popup = new Simple(params);
		popup.render();

		(layer || app).showChildLayerInstance(popup);

		return popup;
	}

	/**
	 * @param {Input} params
	 * @param {Layer=} layer
	 * @param {BaseStatusHandler=} statusHandler
	 * @return {Promise<BaseStatus>}
	 */
	static asPromise(params, layer, statusHandler) {
		const popup = Simple.open(params, layer);

		return /** @type {Promise<BaseStatus>} */ (popup.toPromise(statusHandler));
	}

	/**
	 * @param {Array<string>} title
	 * @param {string=} okTitle
	 * @param {Array<string>=} message
	 * @param {Layer=} layer
	 * @return {Promise<BaseStatus>}
	 */
	static alert(title, okTitle, message, layer) {
		/** @type {Input} */
		const params = {
			title: title,
			message: message,
			buttons: [{
				title: okTitle || 'OK',
				status: BaseStatus.SUCCEEDED
			}]
		};

		return Simple.asPromise(params, layer);
	}

	/**
	 * @param {Array<string>} title
	 * @param {string=} yesTitle
	 * @param {string=} noTitle
	 * @param {Array<string>=} message
	 * @param {Layer=} layer
	 * @return {Promise<BaseStatus>}
	 */
	static confirm(title, yesTitle, noTitle, message, layer) {
		/** @type {Input} */
		const params = {
			title: title,
			message: message,
			buttons: [{
				title: yesTitle || 'Yes',
				status: BaseStatus.SUCCEEDED
			}, {
				title: noTitle || 'No',
				status: BaseStatus.CANCELLED
			}]
		};

		return Simple.asPromise(params, layer);
	}
}


/**
 * @typedef {{
 *     title: string,
 *     status: BaseStatus
 * }}
 */
export let Button;


/**
 * @typedef {{
 *     title: Array<string>,
 *     message: (Array<string>|undefined),
 *     buttons: Array<Input>
 * }}
 */
export let Input;
