import app from 'generated/app';
import * as template from 'generated/cutejs/tv/widgets/player-progress/player-progress.jst';
import Keys from 'zb/device/input/keys';
import {debounce} from 'ui/limit';
import UIPlayerProgress from 'ui/widgets/player-progress/player-progress';


/**
 */
export default class PlayerProgress extends UIPlayerProgress {
	/**
	 * @override
	 */
	constructor() {
		super();

		/**
		 * @const {number}
		 */
		this.SET_POSITION_DEBOUNCE = 1000;

		/**
		 * @const {number}
		 */
		this.SEEK_STEP = 30 * 1000;

		/**
		 * @type {template.Out}
		 * @protected
		 */
		this._exported;

		/**
		 * @type {number}
		 * @private
		 */
		this._areaWidth = NaN;

		/**
		 * @type {number}
		 * @private
		 */
		this._areaLeft = NaN;

		/**
		 * @type {number}
		 * @private
		 */
		this._inputBlockId = NaN;

		/**
		 * @type {number} in percents
		 * @private
		 */
		this._dragProgress = NaN;

		/**
		 * @type {number}
		 * @private
		 */
		this._seekPosition = NaN;

		this._setPositionDebounced = debounce(
			this._setPositionDebounced.bind(this),
			this.SET_POSITION_DEBOUNCE
		);

		this._onMouseClick = this._onMouseClick.bind(this);
		this._onMouseDown = this._onMouseDown.bind(this);
		this._onMouseUp = this._onMouseUp.bind(this);
		this._onMouseMove = this._onMouseMove.bind(this);

		this.on(this.EVENT_FOCUS, this._bindDOMEvents.bind(this));
		this.on(this.EVENT_BLUR, this._unbindDOMEvents.bind(this));
	}

	/**
	 * @override
	 */
	afterDOMShow() {
		super.afterDOMShow();

		this._calculateSize();
	}

	/**
	 * @override
	 */
	isFocusable() {
		return this._enabled && this._visible && Boolean(this._player) && this._isValidDuration(this._getDuration());
	}

	/**
	 * @return {boolean}
	 */
	seekForward() {
		let position = !isNaN(this._seekPosition) ? this._seekPosition : this._getPosition();
		const duration = this._getDuration();
		const max = duration - 1000;

		position = position + this.SEEK_STEP;

		if (position > max) {
			position = max;
		}

		const fakeProgress = position * 100 / duration;
		this._setProgress(fakeProgress);

		this._seekPosition = position;
		this._setPositionDebounced(position);

		return true;
	}

	/**
	 * @return {boolean}
	 */
	seekBackward() {
		let position = !isNaN(this._seekPosition) ? this._seekPosition : this._getPosition();
		const duration = this._getDuration();
		const min = 0;

		position = position - this.SEEK_STEP;

		if (position < min) {
			position = min;
		}

		const fakeProgress = position * 100 / duration;
		this._setProgress(fakeProgress);

		this._seekPosition = position;
		this._setPositionDebounced(position);

		return true;
	}

	/**
	 * @override
	 */
	_processKey(zbKey, event) {
		let isHandled = false;
		const keys = Keys;

		switch (zbKey) {
			case keys.LEFT:
				isHandled = this.seekBackward();
				break;
			case keys.RIGHT:
				isHandled = this.seekForward();
				break;
		}

		return isHandled || super._processKey(zbKey, event);
	}

	/**
	 * @override
	 */
	_renderTemplate() {
		return template.render(
			this._getTemplateData(),
			this._getTemplateOptions()
		);
	}

	/**
	 * @override
	 */
	_onTimeUpdate() {
		if (this._isInputBlocked() || !isNaN(this._seekPosition)) {
			return;
		}

		super._onTimeUpdate();
	}

	/**
	 * @override
	 */
	_setDuration(duration) {
		let fixedDuration = duration;

		if (!this._isValidDuration(duration)) {
			fixedDuration = 0;
		}

		super._setDuration(fixedDuration);
	}

	/**
	 * @override
	 */
	_setProgress(progress) {
		let fixedProgress = progress;

		if (progress < 0) {
			fixedProgress = 0;
		} else if (progress > 100) {
			fixedProgress = 100;
		}

		super._setProgress(fixedProgress);
	}

	/**
	 * @private
	 */
	_bindDOMEvents() {
		this._exported.area.addEventListener('click', this._onMouseClick, false);
		this._exported.thumb.addEventListener('mousedown', this._onMouseDown, false);
		document.addEventListener('mouseup', this._onMouseUp, false);
		document.addEventListener('mousemove', this._onMouseMove, false);
	}

	/**
	 * @private
	 */
	_unbindDOMEvents() {
		this._exported.area.removeEventListener('click', this._onMouseClick, false);
		this._exported.thumb.removeEventListener('mousedown', this._onMouseDown, false);
		document.removeEventListener('mouseup', this._onMouseUp, false);
		document.removeEventListener('mousemove', this._onMouseMove, false);
	}

	/**
	 * @private
	 */
	_blockInput() {
		this._inputBlockId = app.device.input.block();
	}

	/**
	 * @private
	 */
	_unblockInput() {
		if (this._isInputBlocked()) {
			app.device.input.unblock(this._inputBlockId);
			this._inputBlockId = NaN;
		}
	}

	/**
	 * @return {boolean}
	 * @private
	 */
	_isInputBlocked() {
		return !isNaN(this._inputBlockId);
	}

	/**
	 * @param {number} duration
	 * @return {boolean}
	 * @private
	 */
	_isValidDuration(duration) {
		return !(isNaN(duration) || duration === 0 || duration === Infinity);
	}

	/**
	 * @private
	 */
	_calculateSize() {
		this._areaWidth = this._exported.area.offsetWidth;
		this._areaLeft = this._exported.area.getBoundingClientRect().left;
	}

	/**
	 * @param {number} position in milliseconds
	 * @private
	 */
	_setPositionDebounced(position) {
		if (!isNaN(this._seekPosition)) {
			this._setPosition(position);
			this._seekPosition = NaN;
		}
	}

	/**
	 * @param {number} position in milliseconds
	 * @private
	 */
	_setPosition(position) {
		this._player.setPosition(position);
	}

	/**
	 * @param {Event} e
	 * @private
	 */
	_onMouseClick(e) {
		const position = (e.clientX - this._areaLeft) * this._getDuration() / this._areaWidth;
		this._setPosition(position);
	}

	/**
	 * @private
	 */
	_onMouseDown() {
		this._blockInput();
	}

	/**
	 * @private
	 */
	_onMouseUp() {
		if (!this._isInputBlocked()) {
			return;
		}

		this._unblockInput();

		const position = this._dragProgress * this._getDuration() / 100;
		this._setPosition(position);

		this._dragProgress = NaN;
	}

	/**
	 * @param {Event} e
	 * @private
	 */
	_onMouseMove(e) {
		if (!this._isInputBlocked()) {
			return;
		}

		let progress = (e.clientX - this._areaLeft) * 100 / this._areaWidth;
		if (progress < 0) {
			progress = 0;
		} else if (progress > 100) {
			progress = 100;
		}

		this._setProgress(progress);
		this._dragProgress = progress;
	}
}
