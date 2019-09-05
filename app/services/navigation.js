import app from 'generated/app';
import * as define from 'generated/define';
import packageInfo from 'generated/package-info';
import Simple from 'tv/popups/simple/simple';
import Player from 'tv/scenes/player/player';
import SceneOpener from 'zb/scene-opener';


/**
 */
export default class Navigation {
	/**
	 * @param {Scenes} scenes
	 * @param {SceneOpener} opener
	 */
	constructor(scenes, opener) {
		/**
		 * @type {Scenes}
		 * @private
		 */
		this._scenes = scenes;

		/**
		 * @type {SceneOpener}
		 * @private
		 */
		this._opener = opener;
	}

	/**
	 * @return {Promise}
	 */
	openHome() {
		return this._opener.open(this._scenes.player);
	}

	/**
	 * @return {Promise}
	 */
	openAboutPopup() {
		return Simple.alert(
			['About PlayOnTV App'],
			undefined,
			[
				`Version: ${packageInfo['version']}+${define.git.revision}`,
				``,
				`Created by: Andrew Motoshin`,
				`Homepage: github.com/htmlhero/playontv-app`
			]
		);
	}

	/**
	 * @return {Promise}
	 */
	openExitPopup() {
		return Simple
			.confirm(
				['Exit'],
				undefined,
				undefined,
				['Are you shure want to exit?']
			)
			.then(app.exit.bind(app));
	}
}


/**
 * @typedef {{
 *     player: Player
 * }}
 */
export let Scenes;
