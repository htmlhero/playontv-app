import Api, {VideoUpdateData} from 'tv/api/index';
import SamsungDevice from 'samsung/device';
import BaseApplication from 'generated/base-application';
import NavigationService from 'tv/services/navigation';
import VideoService from 'tv/services/video';
import PlayerScene from 'tv/scenes/player/player';
import ThrobberService from 'ui/widgets/throbber/throbber';
import {
	log as consoleLog,
	setLevel as consoleSetLevel,
	Level as ConsoleLevel
} from 'zb/console/console';
import {hide, show, div} from 'zb/html';


/**
 */
export default class Application extends BaseApplication {
	/**
	 * @override
	 */
	constructor() {
		consoleSetLevel(ConsoleLevel.LOG);

		super();

		/**
		 * @type {{
		 *     navigation: NavigationService,
		 *     api: Api,
		 *     video: VideoService,
		 *     throbber: ThrobberService
		 * }}
		 */
		this.services;

		/**
		 * @type {{
		 *     player: PlayerScene
		 * }}
		 */
		this.scenes;
	}

	/**
	 * @override
	 */
	onReady() {
		super.onReady();

		if (this.isDeviceSamsung()) {
			const samsungDevice = /** @type {SamsungDevice} */ (this.device);
			samsungDevice.enableVolumeOSD(true);
		}

		this.scenes = {
			player: new PlayerScene()
		};

		this.addScene(this.scenes.player, 'player');

		const sceneOpener = this.getSceneOpener();
		const navigation = new NavigationService({
			player: this.scenes.player
		}, sceneOpener);

		const api = new Api();
		api.on(api.EVENT_VIDEO_UPDATE, this._onVideoUpdate.bind(this));

		this.services = {
			navigation,
			api,
			video: new VideoService(this.device),
			throbber: this._createThrobber()
		};
	}

	/**
	 * @override
	 */
	onStart(launchParams) {
		super.onStart(launchParams);

		this.home();
	}

	/**
	 * @override
	 */
	home() {
		return this.services.navigation.openHome();
	}

	/**
	 * @return {ThrobberService}
	 * @private
	 */
	_createThrobber() {
		const throbberContainer = div('a-throbber zb-fullscreen');
		const throbber = new ThrobberService({
			step: 58,
			width: 1392
		});

		throbberContainer.appendChild(throbber.getContainer());
		this._body.appendChild(throbberContainer);

		throbber.on(throbber.EVENT_START, () => {
			show(throbberContainer);
		});

		throbber.on(throbber.EVENT_STOP, () => {
			hide(throbberContainer);
		});

		return throbber;
	}

	/**
	 * @param {string} eventName
	 * @param {VideoUpdateData} data
	 * @private
	 */
	_onVideoUpdate(eventName, data) {
		consoleLog('VideoUpdate event:', data);

		const {url} = data;

		if (url !== this.services.video.getUrl()) {
			this.scenes.player.setData(data.title, data.url);
		}
	}
}
