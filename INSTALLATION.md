# Installation

First of all clone the repo:
```sh
git clone git@github.com:htmlhero/playontv-app.git
```

Then from project root run:
```sh
npm install
```

Build application for Samsung SmartTV using host and port, what used by [PlayOnTV server](https://github.com/htmlhero/playontv-server).
For example:
```sh
API_BASE_URL=http://192.168.1.2:8080 npm run build:samsung
```

Serve Samsung SmartTV application for installation:
```sh
npm run serve:samsung
```

#### For Samsung SmartTV H-series (year 2014)

1. Login as "developer"
	1. Press the **Menu** remote button (or **Misc** button on touch remote and select **Menu** button on the screen).
	2. Select **Smart Hub** -\> **Samsung Account** -\> **Login**
		* **Login:** develop
		* **Password:** 11111111
	3. Press **Log In**.
2. Add IP
	1. Press the **Smart hub** remote button.
	2. Select a screen button leading to full Smart Hub.
	3. Select any existing app and hold **OK** remote button until a new menu comes.
	4. Select **IP Setting**.
	5. Enter IP.
	6. Select any existing app and hold **OK** remote button until a new menu comes.
	7. Select **Start User App Sync**.

#### For Samsung SmartTV F-series (year 2013)

1. Login as "developer"
	1. Press the **Smart hub** remote button.
	2. Press the **Menu** remote button (or **Misc** button on touch remote and select **Menu** button on the screen).
	3. Select **Smart Features** -\> **Samsung Account** -\> **Log In**
		* **Login:** develop
		* **Password:** sso1029dev!
	4. Check **Remember my password**.
	5. Press **Log In**.
2. Add IP
	1. Press the **Smart hub** remote button.
	2. Select **More Apps**.
	3. Select **Options** in the top right corner of the screen.
	4. Select **IP Setting**.
	5. Enter IP.
	6. Select **Options** -\> **Start App Sync**.

#### For Samsung SmartTV E-series (year 2012)

1. Login as "developer"
	1. Press the **Smart hub** remote button.
	2. Press the **Red (A)** remote button.
		* **Login:** develop
		* **Password:** 111111
2. Add IP
	1. Press the **Tools** remote button.
	2. Select **Settings**.
	3. Select **Development**.
	4. Select the checkbox and press **OK**.
	5. Select **IP Setting**.
	6. Enter IP.
	7. Select **User Application Synchronization**.
	8. After downloading the app restart your SmartTV.
