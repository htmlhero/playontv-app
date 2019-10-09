# PlayOnTV app 📺

SmartTV application that allows you to play on TV video from your favorite browser.
Used with [PlayOnTV server](https://github.com/htmlhero/playontv-server).

## Try it out

**Step 1:** run local server at port `8080` with command:
```sh
npx github:htmlhero/playontv-server --port 8080
```

**Step 2:** send test video data with command:
```sh
curl -G 'http://localhost:8080/setVideo' --data-urlencode 'title=Big Buck Bunny' --data-urlencode 'url=http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
```

**Step 3:** open [application demo](https://htmlhero.github.io/playontv-app) in browser.
Take a look at the demo page, the video is playing!

## Usage

### Start server

The easiest way to start the server is run `npx github:htmlhero/playontv-server --port 8080` on local/remote machine.
You can configure port as you need. After start, in the output you will see the server address, it will come in handy later.

### Build and start app

Then you should build PlayOnTV application with configured server address.
Follow this [instruction](INSTALLATION.md). After that start the app.

### Send data

Last step — send data to your server. There are several ways to do it.
For example, data sending snippet can looks like one of this:

##### Bookmarklet

```javascript
javascript:(() => {
	const serverUrl = 'http://192.168.1.2:8080';
	const videoUrl = prompt('Paste video URL');
	const src = new URL(serverUrl);
	src.pathname = 'setVideo';
	src.searchParams.set('url', videoUrl);
	new Image().src = src.href;
})();
```

##### Terminal

```sh
curl -G 'http://192.168.1.2:8080/setVideo' --data-urlencode 'url=http://example.com/video.mp4'
```

You can choose your own way to send data using [HTTP API](https://github.com/htmlhero/playontv-server#http-api).

### Watch video

If all previous steps done right, video should start to play on TV. Relax and enjoy it 🍿

## Contributing

You can add support for another SmartTV platforms from [list](https://www.npmjs.com/search?q=zombiebox-platform).

## License

Project licensed under MIT licence. Please read LICENSE file.
