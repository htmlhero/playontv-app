import {updateClassName} from 'zb/html';
import InputKeys from 'zb/device/input/keys';
import IVideo, {State as IVideoState} from 'zb/device/interfaces/i-video';
import UIHelpBarItem, {Options as UIHelpBarItemOptions} from 'ui/widgets/help-bar/help-bar-item';


/**
 */
export default class HelpBarItemPlayPause extends UIHelpBarItem {
	/**
	 * @override
	 * @param {Options} options
	 */
	constructor(options) {
		const baseOptions = /** @type {UIHelpBarItemOptions} */ ({
			label: '',
			keys: options.keys,
			cssClass: ''
		});

		super(baseOptions);

		/**
		 * @type {Options}
		 * @private
		 */
		this._options = options;

		/**
		 * @type {?IVideo}
		 * @private
		 */
		this._video;

		this.setVideo(null);

		this._onPause = this._onPause.bind(this);
		this._onPlay = this._onPlay.bind(this);
		this._onEnded = this._onEnded.bind(this);
		this._onStop = this._onStop.bind(this);
		this._onRateChange = this._onRateChange.bind(this);

		this.on(this.EVENT_CLICK, this._onClick.bind(this));
	}

	/**
	 * @param {?IVideo} video
	 */
	setVideo(video) {
		if (this._video) {
			this._unbindEvents();
		}

		this._video = video;
		this.updateView();

		if (this._video) {
			this._bindEvents();
		}
	}

	/**
	 */
	updateView() {
		if (this._video) {
			switch (this._video.getState()) {
				case IVideoState.INITED:
				case IVideoState.PAUSED:
				case IVideoState.STOPPED:
				case IVideoState.SEEKING:
					this._setPaused(true);
					break;
				default:
					this._setPaused(false);
			}
		} else {
			this._setPaused(true);
		}
	}

	/**
	 * @private
	 */
	_bindEvents() {
		this._video.on(this._video.EVENT_PLAY, this._onPlay);
		this._video.on(this._video.EVENT_PAUSE, this._onPause);
		this._video.on(this._video.EVENT_ENDED, this._onEnded);
		this._video.on(this._video.EVENT_STOP, this._onStop);
		this._video.on(this._video.EVENT_RATE_CHANGE, this._onRateChange);
	}

	/**
	 * @private
	 */
	_unbindEvents() {
		this._video.off(this._video.EVENT_PLAY, this._onPlay);
		this._video.off(this._video.EVENT_PAUSE, this._onPause);
		this._video.off(this._video.EVENT_ENDED, this._onEnded);
		this._video.off(this._video.EVENT_STOP, this._onStop);
		this._video.off(this._video.EVENT_RATE_CHANGE, this._onRateChange);
	}

	/**
	 * @private
	 */
	_onPlay() {
		this._setPaused(false);
	}

	/**
	 * @private
	 */
	_onPause() {
		this._setPaused(true);
	}

	/**
	 * @private
	 */
	_onEnded() {
		this._setPaused(true);
	}

	/**
	 * @private
	 */
	_onStop() {
		this._setPaused(true);
	}

	/**
	 * @private
	 */
	_onRateChange() {
		this._setPaused(this._video.getPlaybackRate() !== 1);
	}

	/**
	 * @private
	 */
	_onClick() {
		if (this._video) {
			this._video.togglePause();
		}
	}

	/**
	 * @param {boolean} isPaused
	 * @private
	 */
	_setPaused(isPaused) {
		updateClassName(this._container, this._options.playCssClass, isPaused);
		updateClassName(this._container, this._options.pauseCssClass, !isPaused);

		this.setLabel(isPaused ? this._options.playLabel : this._options.pauseLabel);
	}
}


/**
 * @typedef {{
 *     playLabel: string,
 *     playCssClass: string,
 *     pauseLabel: string,
 *     pauseCssClass: string,
 *     keys: Array<InputKeys>
 * }}
 */
export let Options;
