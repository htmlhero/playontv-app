import app from 'generated/app';
import {Common} from 'zb/device/aspect-ratio/proportion';
import {State} from 'zb/device/interfaces/i-video';
import IDevice from 'zb/device/interfaces/i-device';
import IViewPort from 'zb/device/interfaces/i-view-port';
import {AspectRatio, Transferring} from 'zb/device/aspect-ratio/aspect-ratio';
import Keys from 'zb/device/input/keys';
import Rect from 'zb/geometry/rect';
import AbstractVideo from './abstract-video';


/**
 */
export default class Video extends AbstractVideo {
	/**
	 * @param {IDevice} device
	 */
	constructor(device) {
		const rect = Rect.createByClientRect(app.getBody().getBoundingClientRect());
		const video = device.createVideo(rect);
		super(video);

		/**
		 * @type {IViewPort}
		 * @private
		 */
		this._viewport = video.getViewport();
		this._viewport.setFullScreen(true);

		/**
		 * @type {Array<AspectRatio>}
		 * @private
		 */
		this._aspectRatioList = this._createAspectRatioList();

		if (this._aspectRatioList.length) {
			this.on(this.EVENT_LOADED_META_DATA, () => {
				this._viewport.setAspectRatio(this._aspectRatioList[0]);
			});
		}
	}

	/**
	 * @param {boolean} isVisible
	 */
	setVisible(isVisible) {
		if (isVisible) {
			app.showVideo();
		} else {
			app.hideVideo();
		}
	}

	/**
	 */
	show() {
		this.setVisible(true);
	}

	/**
	 */
	hide() {
		this.setVisible(false);
	}

	/**
	 * @param {Keys} zbKey
	 * @return {boolean}
	 */
	processKey(zbKey) {
		const keys = Keys;

		switch (zbKey) {
			case keys.PLAY:
			case keys.PAUSE:
			case keys.PLAY_PAUSE:
				this.togglePlayPause();
				return true;
			case keys.VOLUME_DOWN:
				return this._volumeDown();
			case keys.VOLUME_UP:
				return this._volumeUp();
			case keys.MUTE:
				return this._toggleMuted();
			default:
				return false;
		}
	}

	/**
	 */
	togglePlayPause() {
		switch (this.getState()) {
			case State.PAUSED:
			case State.STOPPED:
				this.resume();
				break;
			case State.PLAYING:
			case State.SEEKING:
				this.pause();
				break;
		}
	}

	/**
	 */
	toggleAspectRatio() {
		if (this._viewport.hasAspectRatioFeature()) {
			this._viewport.toggleAspectRatio(this._aspectRatioList);
		}
	}

	/**
	 * @return {Array<AspectRatio>}
	 * @private
	 */
	_createAspectRatioList() {
		return [
			new AspectRatio(Common.AUTO, Transferring.LETTERBOX),
			new AspectRatio(Common.AUTO, Transferring.STRETCH),
			new AspectRatio(Common.X16X9, Transferring.LETTERBOX),
			new AspectRatio(Common.X4X3, Transferring.LETTERBOX)
		]
			.filter((ratio) => this._viewport.isAspectRatioSupported(ratio));
	}

	/**
	 * @return {boolean}
	 * @private
	 */
	_volumeDown() {
		if (app.isDeviceSamsung()) {
			return false;
		}

		this.volumeDown();
		return true;
	}

	/**
	 * @return {boolean}
	 * @private
	 */
	_volumeUp() {
		if (app.isDeviceSamsung()) {
			return false;
		}

		this.volumeUp();
		return true;
	}

	/**
	 * @return {boolean}
	 * @private
	 */
	_toggleMuted() {
		if (app.isDeviceSamsung()) {
			return false;
		}

		this.setMuted(!this.getMuted());
		return true;
	}
}
