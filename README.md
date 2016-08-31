# Real-Time Heart Rate Tracker <br/> built with AT&T M2X, Pusher & Canvas.js

This is a sample application which leverages the [AT&T M2X Time-Series Datastore](https://m2x.att.com) to gather and store heart rate data, and the [M2X Pusher Integration](https://m2x.att.com/developer/documentation/v2/integrations#pusher-sink-integration) to stream data in real-time over [Pusher](https://pusher.com/) WebSocket Channel to a web application that dispalys the current heart rate & a dynamic chart from [Canvas.js](http://canvasjs.com/html5-javascript-dynamic-chart/)

View live demo: http://panoply.cloud/heart-rate-tracker/

![Heart Rate Tracker](images/heart-rate-tracker.gif)

# Prerequisites

* [AT&T IoT Services](https://m2x.att.com/signup) account
* [Pusher](https://pusher.com/signup) account
* M2X Device with a `heart-rate` Stream which is receiving real-time data updates. If you don't have any, see [Data Generation](#data-generation) for instructions on how to generate data.
* Configured M2X Pusher Integration to send M2X Device data to Pusher WebSocket channel. See [Configure M2X Pusher Integration](#configure-m2x-pusher-integration) for more info.

# Data Generation

If you don't have an M2X Device seeding live data, I've included a [Python script](bin/hr_datagen.py) that leverages the [M2X Python Client Library](https://github.com/attm2x/m2x-python) to push generated heart rate data to M2X.

#### Requirements: 

* `Python 3`
* `pip 3`
* `M2X Python Client` 

To execute the script, run the following commands:

1. Install M2X Python Client:
    ```bash
    pip install m2x
    ```

2. Set environment variables for `M2X_API_KEY` & `M2X_HR_DEVICE`:
    ```bash
    export M2X_API_KEY=[YOUR-M2X-API-KEY]
    export M2X_HR_DEVICE=[YOUR-M2X-DEVICE-ID]
    ```

2. Run the script:
    ```bash
    pyhthon ./bin/hr_datagen.py
    ```

# Configure M2X Pusher Integration

The M2X -> Pusher Integration, once configured, will deliver all data from the data sources given in `selectors` to Pusher.

Create the Integration by making an HTTP request to the [Create Integration](https://m2x.att.com/developer/documentation/v2/integrations#Create-Integration) endpoint of the M2X API.

#### Example:

`POST` /integrations

Request Body:

```json
{
    "name": "Heart Rate Data",
    "description": "Send heart rate data from M2X Device to Pusher.",
    "type": "pusher_sink",
    "config": { 
        "app_id": "YOUR-PUSHER-APP-ID",
        "app_key": "YOUR-PUSHER-APP-KEY",
        "app_secret": "YOUR-PUSHER-APP-SECRET",
        "app_cluster": "YOUR-PUSHER-APP-CLUSTER-SHORTCODE",
        "channel_prefix": "YOUR-CUSTOM-CHANNEL-PREFIX" },
    "selectors": { 
        "devices": [
            "M2X-DEVICE-ID"] }
}
```

# Install & Run

1. Clone this repository
2. Add your Pusher App ID & Chanel Name to [js/main.js](js/main.js), note that the channel name is the `channel_prefix` provided when [configuring the M2X Pusher integration](#configure-m2x-pusher-integration) plus the name of the stream. Example: channel prefix `m2x-` + stream name: `heart-rate` = channel name: `m2x-heart-rate`
3. Open [index.html](index.html) to view the data streaming in real-time
