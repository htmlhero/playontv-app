import app from 'generated/app';
import * as template from 'generated/cutejs/tv/scenes/player/player.jst';
import Simple from 'tv/popups/simple/simple';
import VideoService from 'tv/services/video';
import {back, blue, red, playPause} from 'tv/widgets/help-bar/help-bar-item-factory';
import AbstractScene from 'cutejs/layers/abstract-scene';
import Keys from 'zb/device/input/keys';
import {State as IVideoState} from 'zb/device/interfaces/i-video';
import {text} from 'zb/html';
import {throttle} from 'ui/limit';
import HelpBarItem from 'ui/widgets/help-bar/help-bar-item';
import HelpBarItemPlayPause from 'tv/widgets/help-bar/help-bar-item-play-pause';
import {PlayerOsd, State as PlayerOsdState} from './player-osd';


/**
 */
export default class Player extends AbstractScene {
	/**
	 * @override
	 */
	constructor() {
		super();

		/**
		 * @const {number}
		 */
		this.MOVE_OR_CLICK_DELAY = 1 * 1000;

		/**
		 * @type {template.Out}
		 * @protected
		 */
		this._exported;

		/**
		 * @type {?VideoService}
		 * @private
		 */
		this._video = null;

		/**
		 * @type {PlayerOsd}
		 * @private
		 */
		this._osd = this._createOsd();

		/**
		 * @type {?string}
		 * @private
		 */
		this._url = null;

		/**
		 * @type {?function()}
		 * @private
		 */
		this._bufferingPromiseResolve;

		/**
		 * @type {function(Event)}
		 * @private
		 */
		this._onMoveOrClickTrottled;

		/**
		 * @type {HelpBarItemPlayPause}
		 * @private
		 */
		this._helpBarItemPlayPause;

		/**
		 * @type {HelpBarItem}
		 * @private
		 */
		this._helpBarItemAspectRatio;

		this._addContainerClass('s-player');

		this._initHelpBar();

		this._onStateChange = this._onStateChange.bind(this);
		this._onBuffering = this._onBuffering.bind(this);
		this._bufferingPromiseResolve = null;

		this._onError = this._onError.bind(this);

		this._onMoveOrClick = this._onMoveOrClick.bind(this);
		this._onMoveOrClickTrottled = throttle(this._onMoveOrClick, this.MOVE_OR_CLICK_DELAY);
	}

	/**
	 * @override
	 */
	beforeDOMShow() {
		super.beforeDOMShow();

		this.activateWidget(this._exported.progress);

		this._setVideo(app.services.video);

		this._osd.beforeDOMShow();

		document.addEventListener('click', this._onMoveOrClick, false);
		document.addEventListener('mousemove', this._onMoveOrClickTrottled, false);
	}

	/**
	 * @override
	 */
	afterDOMHide() {
		super.afterDOMHide();

		this._osd.afterDOMHide();

		this._setVideo(null);

		document.removeEventListener('click', this._onMoveOrClick, false);
		document.removeEventListener('mousemove', this._onMoveOrClickTrottled, false);
	}

	/**
	 * @override
	 */
	processKey(zbKey, e) {
		if (app.services.video.processKey(zbKey)) {
			return true;
		}

		const isHelpBarKey = this._exported.helpBar.hasKey(zbKey);
		if (!isHelpBarKey && this._osd.processKey(zbKey)) {
			return true;
		}

		if (this._exported.helpBar.processHelpBarKey(zbKey, e)) {
			return true;
		}

		return super.processKey(zbKey, e);
	}

	/**
	 * @param {string} title
	 * @param {string} url
	 */
	setData(title, url) {
		text(this._exported.title, title);

		this._url = url;
		this._video.play(url);
	}

	/**
	 * @override
	 */
	_renderTemplate() {
		return template.render(this._getTemplateData(), this._getTemplateOptions());
	}

	/**
	 * @override
	 */
	_processKey(zbKey, event) {
		let isHandled = false;
		const keys = Keys;

		switch (zbKey) {
			case keys.REW:
				isHandled = this._exported.progress.seekBackward();
				break;
			case keys.FWD:
				isHandled = this._exported.progress.seekForward();
				break;
		}

		return isHandled || super._processKey(zbKey, event);
	}

	/**
	 * @private
	 */
	_initHelpBar() {
		this._exported.helpBar.setOrder([
			Keys.PLAY,
			Keys.PAUSE,
			Keys.RED,
			Keys.GREEN,
			Keys.YELLOW,
			Keys.BLUE,
			Keys.BACK
		]);

		this._helpBarItemPlayPause = playPause('Play', 'Pause');

		this._helpBarItemAspectRatio = red('Aspect ratio', () => {
			this._video.toggleAspectRatio();
		});

		const helpBarItemAbout = blue('About', () => {
			app.services.navigation.openAboutPopup();
		});

		const helpBarItemExit = back('Exit', () => {
			app.services.navigation.openExitPopup();
		});

		this._exported.helpBar.setItems([
			this._helpBarItemPlayPause,
			this._helpBarItemAspectRatio,
			helpBarItemAbout,
			helpBarItemExit
		]);
	}

	/**
	 * @return {PlayerOsd}
	 * @private
	 */
	_createOsd() {
		const osd = new PlayerOsd({
			title: this._exported.title,
			shadow: this._exported.shadow,
			progress: this._exported.progress,
			helpBar: this._exported.helpBar.getContainer()
		});
		osd.on(osd.EVENT_STATE_CHANGED, this._onOsdStateChanged.bind(this));
		return osd;
	}

	/**
	 * @param {?VideoService} video
	 * @private
	 */
	_setVideo(video) {
		app.services.video.setVisible(!!video);

		this._osd.setVideo(video);
		this._exported.progress.setPlayer(video);
		this._helpBarItemPlayPause.setVideo(video);

		if (this._video) {
			this._video.off(this._video.EVENT_BUFFERING, this._onBuffering);
			this._video.off(this._video.EVENT_ERROR, this._onError);
			this._video.off(this._video.EVENT_STATE_CHANGE, this._onStateChange);
		}

		this._video = video;

		if (this._video) {
			this._video.on(this._video.EVENT_BUFFERING, this._onBuffering);
			this._video.on(this._video.EVENT_ERROR, this._onError);
			this._video.on(this._video.EVENT_STATE_CHANGE, this._onStateChange);

			const state = this._video.getState();
			this._updateHelpBar(state);
		}
	}

	/**
	 * @param {IVideoState} state
	 * @private
	 */
	_updateHelpBar(state) {
		switch (state) {
			case IVideoState.PLAYING:
			case IVideoState.BUFFERING:
			case IVideoState.PAUSED:
			case IVideoState.SEEKING:
				this._helpBarItemPlayPause.show();
				this._helpBarItemAspectRatio.show();
				break;
			default:
				this._helpBarItemPlayPause.hide();
				this._helpBarItemAspectRatio.hide();
		}
	}

	/**
	 * @param {string} eventName
	 * @param {?PlayerOsdState} newState
	 * @private
	 */
	_onOsdStateChanged(eventName, newState) {
		switch (newState) {
			case PlayerOsdState.CONTROLS:
				this.activateWidget(this._exported.progress);
				break;
		}
	}

	/**
	 * @param {string} eventName
	 * @param {IVideoState} newState
	 * @private
	 */
	_onStateChange(eventName, newState) {
		this._updateHelpBar(newState);
	}

	/**
	 * @private
	 */
	_onBuffering() {
		const promise = (new Promise((resolve) => {
			this._bufferingPromiseResolve = () => {
				resolve();
			};

			const callback = /** @type {function(string)} */ (this._bufferingPromiseResolve);
			this._video.on(this._video.EVENT_STATE_CHANGE, callback);
		}))
			.then(() => {
				const callback = /** @type {function(string)} */ (this._bufferingPromiseResolve);
				this._video.off(this._video.EVENT_STATE_CHANGE, callback);

				this._bufferingPromiseResolve = null;
			});

		app.services.throbber.wait(promise);
	}

	/**
	 * @param {string} eventName
	 * @param {string} description
	 * @private
	 */
	_onError(eventName, description) {
		if (!this._url && description === 'NETWORK_NO_SOURCE') {
			return;
		}

		if (this._bufferingPromiseResolve) {
			this._bufferingPromiseResolve();
		}

		let message = description;
		message = message.replace(/-|_/ig, ' ');
		message = message.charAt(0).toUpperCase() + message.slice(1).toLowerCase();

		Simple.alert(['Error'], undefined, [message]);
	}

	/**
	 * @param {Event} event
	 * @private
	 */
	_onMoveOrClick(event) {
		if (this._container.contains(/** @type {Node} */(event.target))) {
			this._osd.showControls();
		}
	}
}
