import IVideo, {State as IVideoState} from 'zb/device/interfaces/i-video';
import EventPublisher from 'zb/events/event-publisher';


/**
 * @abstract
 * @implements {IVideo}
 */
export default class AbstractVideo extends EventPublisher {
	/**
	 * @param {IVideo} video
	 */
	constructor(video) {
		super();

		/**
		 * Play command has been received and player has started loading video data
		 * Fired with: nothing
		 * @const {string}
		 */
		this.EVENT_LOAD_START = 'load-start';

		/**
		 * Position has been changed
		 * Fired with: number position
		 * @const {string}
		 */
		this.EVENT_TIME_UPDATE = 'time-update';

		/**
		 * Player has started buffering
		 * Fired with: nothing
		 * @const {string}
		 */
		this.EVENT_BUFFERING = 'buffering';

		/**
		 * An error occurred
		 * Fired with: string error description
		 * @const {string}
		 */
		this.EVENT_ERROR = 'error';

		/**
		 * Video metadata has been loaded
		 * Fired with: nothing
		 * @const {string}
		 */
		this.EVENT_LOADED_META_DATA = 'loaded-meta-data';

		/**
		 * Video has ended
		 * Fired with: nothing
		 * @const {string}
		 */
		this.EVENT_ENDED = 'ended';

		/**
		 * Duration has been obtained or changed
		 * Fired with: number duration in milliseconds
		 * @const {string}
		 */
		this.EVENT_DURATION_CHANGE = 'duration-change';

		/**
		 * Video has started to play
		 * Fired with: nothing
		 * @const {string}
		 */
		this.EVENT_PLAY = 'play';

		/**
		 * Video has been paused
		 * Fired with: nothing
		 * @const {string}
		 */
		this.EVENT_PAUSE = 'pause';

		/**
		 * Video has been stopped (play position has been reset)
		 * Fired with: nothing
		 * @const {string}
		 */
		this.EVENT_STOP = 'stop';

		/**
		 * Playback rate has been changed
		 * Fired with: number new rate
		 * @const {string}
		 */
		this.EVENT_RATE_CHANGE = 'rate-change';

		/**
		 * Volume has been changed
		 * Fired with: number new volume
		 * @const {string}
		 */
		this.EVENT_VOLUME_CHANGE = 'volume-change';

		/**
		 * Only if old state !== new state
		 * Fired with:
		 *     {State} new state
		 *     {State} old state
		 * @const {string} State changed.
		 */
		this.EVENT_STATE_CHANGE = 'state-change';

		/**
		 * @type {IVideo}
		 * @private
		 */
		this._video = video;

		this._video.on(this._video.EVENT_LOAD_START, this._onLoadStart.bind(this));
		this._video.on(this._video.EVENT_TIME_UPDATE, this._onTimeUpdate.bind(this));
		this._video.on(this._video.EVENT_BUFFERING, this._onBuffering.bind(this));
		this._video.on(this._video.EVENT_ERROR, this._onError.bind(this));
		this._video.on(this._video.EVENT_LOADED_META_DATA, this._onLoadedMetaData.bind(this));
		this._video.on(this._video.EVENT_ENDED, this._onEnded.bind(this));
		this._video.on(this._video.EVENT_DURATION_CHANGE, this._onDurationChange.bind(this));
		this._video.on(this._video.EVENT_PLAY, this._onPlay.bind(this));
		this._video.on(this._video.EVENT_PAUSE, this._onPause.bind(this));
		this._video.on(this._video.EVENT_RATE_CHANGE, this._onRateChange.bind(this));
		this._video.on(this._video.EVENT_VOLUME_CHANGE, this._onVolumeChange.bind(this));
		this._video.on(this._video.EVENT_STATE_CHANGE, this._onStateChange.bind(this));
	}

	/**
	 * @override
	 */
	play(url, startFrom) {
		this._video.play(url, startFrom);
	}

	/**
	 * @override
	 */
	resume() {
		this._video.resume();
	}

	/**
	 * @override
	 */
	pause() {
		this._video.pause();
	}

	/**
	 * @override
	 */
	togglePause() {
		this._video.togglePause();
	}

	/**
	 * @override
	 */
	stop() {
		this._video.stop();
	}

	/**
	 * @override
	 */
	forward() {
		return this._video.forward();
	}

	/**
	 * @override
	 */
	rewind() {
		return this._video.rewind();
	}

	/**
	 * @override
	 */
	destroy() {
		this._video.destroy();
	}

	/**
	 * @override
	 */
	setPlaybackRate(rate) {
		this._video.setPlaybackRate(rate);
	}

	/**
	 * @override
	 */
	getPlaybackRate() {
		return this._video.getPlaybackRate();
	}

	/**
	 * @override
	 */
	setPosition(milliseconds) {
		this._video.setPosition(milliseconds);
	}

	/**
	 * @override
	 */
	getPosition() {
		return this._video.getPosition();
	}

	/**
	 * @override
	 */
	getDuration() {
		return this._video.getDuration();
	}

	/**
	 * @override
	 */
	setVolume(value) {
		this._video.setVolume(value);
	}

	/**
	 * @override
	 */
	getVolume() {
		return this._video.getVolume();
	}

	/**
	 * @override
	 */
	volumeUp(step) {
		return this._video.volumeUp(step);
	}

	/**
	 * @override
	 */
	volumeDown(step) {
		return this._video.volumeDown(step);
	}

	/**
	 * @override
	 */
	isMuted() {
		return this._video.isMuted();
	}

	/**
	 * @override
	 */
	setMuted(value) {
		this._video.setMuted(value);
	}

	/**
	 * @override
	 */
	getMuted() {
		return this._video.getMuted();
	}

	/**
	 * @override
	 */
	toggleMuted() {
		this._video.toggleMuted();
	}

	/**
	 * @override
	 */
	getState() {
		return this._video.getState();
	}

	/**
	 * @override
	 */
	getViewport() {
		return this._video.getViewport();
	}

	/**
	 * @override
	 */
	getUrl() {
		return this._video.getUrl();
	}

	/**
	 * @private
	 */
	_onLoadStart() {
		this._fireEvent(this.EVENT_LOAD_START);
	}

	/**
	 * @param {string} eventName
	 * @param {number} position
	 * @private
	 */
	_onTimeUpdate(eventName, position) {
		this._fireEvent(this.EVENT_TIME_UPDATE, position);
	}

	/**
	 * @private
	 */
	_onBuffering() {
		this._fireEvent(this.EVENT_BUFFERING);
	}

	/**
	 * @param {string} eventName
	 * @param {string} error
	 * @private
	 */
	_onError(eventName, error) {
		this._fireEvent(this.EVENT_ERROR, error);
	}

	/**
	 * @private
	 */
	_onLoadedMetaData() {
		this._fireEvent(this.EVENT_LOADED_META_DATA);
	}

	/**
	 * @private
	 */
	_onEnded() {
		this._fireEvent(this.EVENT_ENDED);
	}

	/**
	 * @param {string} eventName
	 * @param {number} duration in milliseconds
	 * @private
	 */
	_onDurationChange(eventName, duration) {
		this._fireEvent(this.EVENT_DURATION_CHANGE, duration);
	}

	/**
	 * @private
	 */
	_onPlay() {
		this._fireEvent(this.EVENT_PLAY);
	}

	/**
	 * @private
	 */
	_onPause() {
		this._fireEvent(this.EVENT_PAUSE);
	}

	/**
	 * @param {string} eventName
	 * @param {number} rate
	 * @private
	 */
	_onRateChange(eventName, rate) {
		this._fireEvent(this.EVENT_RATE_CHANGE, rate);
	}

	/**
	 * @param {string} eventName
	 * @param {number} volume
	 * @private
	 */
	_onVolumeChange(eventName, volume) {
		this._fireEvent(this.EVENT_VOLUME_CHANGE, volume);
	}

	/**
	 * @param {string} eventName
	 * @param {IVideoState} newState
	 * @param {IVideoState} oldState
	 * @private
	 */
	_onStateChange(eventName, newState, oldState) {
		this._fireEvent(this.EVENT_STATE_CHANGE, newState, oldState);
	}
}
