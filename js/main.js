window.onload = function () {
  
  var loading = true;
 
  // ****************
  // Canvas.js Config
  // ****************
  var dataset = [];
  var dataLength = 500;          // number of dataPoints visible at any point

  var chart = new CanvasJS.Chart("chart-container",{
    // Chart Options
    // See: http://canvasjs.com/docs/charts/chart-options/
    backgroundColor: "#262626",      
    data: [{
      type: "line",             // required
      xValueType: "dateTime",   // required
      dataPoints: dataset,      // required
      lineColor: "#04C305",     // optional
      color: "#04C305",         // optional
      markerSize: 0             // optional
    }],
    axisX: {
      interval: 1,              // recommended
      intervalType: "minute",   // recommended
      labelFontColor: "white"   // optional
    },
    axisY: {
      interval: 10,             // recommended
      minimum: 70,              // recommended
      maximum: 120,             // recommended
      labelFontColor: "white",  // optional
      gridColor: "grey",        // optional
      gridThickness: 1,         // optional
      gridDashType: "dot"       // optional
    }
  });

  chart.render();

  var updateChart = function (datestamp, heart_rate) {  
    dataset.push({
      x: datestamp.getTime(),
      y: heart_rate
    });

    if (dataset.length > dataLength)
    {
      dataset.shift();
    }

    chart.render();
  };

  // *************
  // Pusher Config
  // *************
  Pusher.logToConsole = true;  // Enable logging - don't include in production
  var pusher_app_id = 'YOUR-PUSHER-APP-ID';
  var pusher_channel = 'YOUR-PUSHER-CHANNEL-NAME';

  var pusher = new Pusher(pusher_app_id, {
    encrypted: true
  });

  var channel = pusher.subscribe(pusher_channel);

  channel.bind('datapoint', function(data) {
    if(null != data) {
      var datestamp = new Date();
      var heart_rate = data;
      
      // Update current heart rate indicator
      document.getElementById("heart-rate").innerHTML = heart_rate.toFixed(2);

      // Update chart
      updateChart(datestamp, heart_rate);

      // Clear loading message on first datapoint received
      if(loading) {
        loading = false;
        document.getElementById("loading").style.visibility = "hidden";
        document.getElementById("main-container").style.visibility = "visible";
      }
    }
  });

}
