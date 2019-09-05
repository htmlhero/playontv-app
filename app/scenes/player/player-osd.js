import VideoService from 'tv/services/video';
import StateManager from 'tv/services/state-manager';
import PlayerProgress from 'tv/widgets/player-progress/player-progress';
import Timeout from 'zb/timeout';
import {State as IVideoState} from 'zb/device/interfaces/i-video';
import Keys from 'zb/device/input/keys';
import EventPublisher from 'zb/events/event-publisher';


/**
 */
export class PlayerOsd extends EventPublisher {
	/**
	 * @override
	 * @param {ItemMap} itemMap
	 */
	constructor(itemMap) {
		super();

		/**
		 * @const {number}
		 */
		this.CONTROLS_SHOW_TIME = 5 * 1000;

		/**
		 * Fired with: {?State} newState, {?State} oldState
		 * @const {string}
		 */
		this.EVENT_STATE_CHANGED = 'state-changed';

		/**
		 * @type {StateManager}
		 * @private
		 */
		this._stateManager = this._createStateManager(itemMap);
		this._setState(null);

		/**
		 * @type {Timeout}
		 * @private
		 */
		this._controlsTimer = new Timeout(this.hideControls.bind(this), this.CONTROLS_SHOW_TIME);

		/**
		 * @type {?VideoService}
		 * @private
		 */
		this._video = null;

		this._onVideoStateChange = this._onVideoStateChange.bind(this);
		this.on(this.EVENT_STATE_CHANGED, this._onOsdStateChanged.bind(this));
	}

	/**
	 */
	beforeDOMShow() {
		this.showControls();
	}

	/**
	 */
	afterDOMHide() {
		this.hideControls();
	}

	/**
	 * @param {Keys} zbKey
	 * @return {boolean} True if Key handled, false if not
	 */
	processKey(zbKey) {
		const keys = Keys;

		if (this._isControlsVisible() || this._isEmpty()) {
			const isEnter = zbKey === keys.ENTER;
			const isUp = zbKey === keys.UP;
			const isDown = zbKey === keys.DOWN;
			const isLeft = zbKey === keys.LEFT;
			const isRight = zbKey === keys.RIGHT;
			const isNavigation = isUp || isDown || isLeft || isRight;
			const isOnlyControlsShow = this._isEmpty() && (isEnter || isNavigation);

			this.showControls();

			return isOnlyControlsShow;
		}

		return false;
	}

	/**
	 * @param {?VideoService} video
	 */
	setVideo(video) {
		if (this._video) {
			this._video.off(this._video.EVENT_PLAY, this._onVideoStateChange);
			this._video.off(this._video.EVENT_PAUSE, this._onVideoStateChange);
			this._video.off(this._video.EVENT_STOP, this._onVideoStateChange);
			this._video.off(this._video.EVENT_ENDED, this._onVideoStateChange);
		}

		this._video = video;

		if (this._video) {
			this._video.on(this._video.EVENT_PLAY, this._onVideoStateChange);
			this._video.on(this._video.EVENT_PAUSE, this._onVideoStateChange);
			this._video.on(this._video.EVENT_STOP, this._onVideoStateChange);
			this._video.on(this._video.EVENT_ENDED, this._onVideoStateChange);
		}
	}

	/**
	 */
	showControls() {
		switch (this._getVideoState()) {
			case IVideoState.INITED:
			case IVideoState.UNINITED:
			case IVideoState.DEINITED:
			case IVideoState.PAUSED:
			case IVideoState.STOPPED:
			case IVideoState.ERROR:
			case null:
				this._controlsTimer.stop();
				break;
			default:
				this._controlsTimer.restart();
				break;
		}

		this._setState(State.CONTROLS);
	}

	/**
	 */
	hideControls() {
		this._setState(null);
	}

	/**
	 * @param {ItemMap} itemMap
	 * @return {StateManager}
	 * @private
	 */
	_createStateManager(itemMap) {
		const itemList = Object.keys(itemMap).map((key) => itemMap[key]);

		const stateManager = new StateManager(itemList);

		stateManager.registerState(State.CONTROLS, [
			itemMap.title,
			itemMap.shadow,
			itemMap.progress,
			itemMap.helpBar
		]);

		return stateManager;
	}

	/**
	 * @param {?State} newState
	 * @private
	 */
	_setState(newState) {
		const oldState = this._stateManager.getState();

		if (newState === oldState) {
			return;
		}

		this._stateManager.setState(newState);
		this._fireEvent(this.EVENT_STATE_CHANGED, newState, oldState);
	}

	/**
	 * @return {boolean}
	 * @private
	 */
	_isControlsVisible() {
		return this._stateManager.getState() === State.CONTROLS;
	}

	/**
	 * @return {boolean}
	 * @private
	 */
	_isEmpty() {
		return this._stateManager.getState() === null;
	}

	/**
	 * @return {?IVideoState}
	 * @private
	 */
	_getVideoState() {
		return this._video ? this._video.getState() : null;
	}

	/**
	 * @private
	 */
	_onVideoStateChange() {
		switch (this._getVideoState()) {
			case IVideoState.INITED:
			case IVideoState.UNINITED:
			case IVideoState.DEINITED:
			case IVideoState.PLAYING:
			case IVideoState.PAUSED:
			case IVideoState.STOPPED:
			case IVideoState.ERROR:
				if (this._isControlsVisible() || this._isEmpty()) {
					this.showControls();
				}
				break;
		}
	}

	/**
	 * @param {string} eventName
	 * @param {?State} newState
	 * @param {?State} oldState
	 * @private
	 */
	_onOsdStateChanged(eventName, newState, oldState) {
		if (oldState === State.CONTROLS) {
			this._controlsTimer.stop();
		}
	}
}


/**
 * @enum {string}
 */
export const State = {
	CONTROLS: 'controls'
};


/**
 * @typedef {{
 *     title: HTMLElement,
 *     shadow: HTMLElement,
 *     progress: PlayerProgress,
 *     helpBar: HTMLElement
 * }}
 */
export let ItemMap;
