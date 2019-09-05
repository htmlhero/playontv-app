import {TemplateOptions} from 'cutejs-lib/cute-library';
import Popup from 'zb/layers/popup';


/**
 */
export default class CutePopup extends Popup {
	/**
	 * @override
	 */
	constructor() {
		super();

		/**
		 * @type {?function(Object, TemplateOptions): Object}
		 * @protected
		 */
		this._template = null;

		/**
		 * @type {Object}
		 * @protected
		 */
		this._templateIn = {};

		/**
		 * @type {TemplateOptions}
		 * @protected
		 */
		this._templateOptions = {
			afterAppendComponent: (widget, exportName) => this.appendWidget(widget, exportName)
		};

		/**
		 * @type {?Object}
		 * @protected
		 */
		this._templateOut = null;
	}

	/**
	 */
	render() {
		if (!this._template) {
			return;
		}

		this._templateOut = this._template(this._templateIn, this._templateOptions);
		this._container.appendChild(this._templateOut.root);

		this._onRender();
	}

	/**
	 * @protected
	 */
	_onRender() {
		// Do nothing. Method for overwrite
	}
}
