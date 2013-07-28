(function() {

  function getValues(obj) {
    vals = []
    for (var key in obj) {
      vals.push(obj[key]);
    }

    return vals;
  }

  function formatData(mixData) {
    obj = [];

    for (var key in mixData) {
      obj.push({
        date: key,
        value: mixData[key]
      });
    }

    return obj;
  }

  function extend(data, percent) {
    var diff = data[1] - data[0];
    var amount = diff * percent;
    return [data[0] - .5 * amount, data[1] + .5 * amount];
  }

  var StatsView = Backbone.View.extend({
    template: HandlebarsTemplates['stats'],
    className: "stats-page",

    initialize: function() {
      this.model = this.options.model;
    },

    postRender: function() {


      a = new MixpanelRequest(
        "http://mixpanel.com/api/2.0/events/properties/", {
          event: "campaign_conversion" + this.model.id,
          name: "test",
          type: "general",
          unit: "day",
          interval: 7
        },
        _.bind(function(data_mix) {
          values = data_mix.data;
          console.log(values);

          // define dimensions of graph
          var m = [0, 0, 30, 60]; // margins
          var w = 800 - m[1] - m[3]; // width
          var h = 400 - m[0] - m[2]; // height

          // X scale will fit all values from data[] within pixels 0-w
          var x_time = d3.time.scale().domain(
            [new Date(values.series[0]),
              new Date(values.series[values.series.length - 1])
            ])
            .range([0, w]);

          var domain_array = getValues(values.values.A).concat(getValues(values.values.B));
          var domain = [d3.min(domain_array), d3.max(domain_array)];

          var y_time = d3.scale.linear().domain(
            extend(domain, .10)
          )
            .range([h, 0]);

          // create a line function that can convert data[] into x and y points
          var line = d3.svg.line()
          // assign the X function to plot our line as we wish
          .x(function(d, i) {
            // verbose logging to show what's actually being done
            //console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
            // return the X coordinate where we want to plot this datapoint
            return x_time(new Date(d.date));
          })
            .y(function(d) {
              // verbose logging to show what's actually being done
              //console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
              // return the Y coordinate where we want to plot this datapoint
              return y_time(d.value);
            })

          var findNode = $(this.el).find("#graph")[0];

          // Add an SVG element with the desired dimensions and margin.
          var graph = d3.select(findNode).append("svg:svg")
            .attr("width", w + m[1]+m[3])
            .attr("height", h + m[0] + m[2])
            .append("svg:g")
            .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

          // create yAxis
          var xAxis = d3.svg.axis().scale(x_time).tickSize(-h).tickSubdivide(true).orient("bottom");
          // Add the x-axis.
          graph.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + h + ")")
            .call(xAxis);


          // create left yAxis
          var yAxisLeft = d3.svg.axis().scale(y_time).ticks(8).orient("left");
          // Add the y-axis to the left
          graph.append("svg:g")
            .attr("class", "y axis")
            .call(yAxisLeft);

          // Add the line by appending an svg:path element with the data line we created above
          // do this AFTER the axes above so that the line is above the tick-lines
          graph.append("svg:path").attr("d", line(formatData(values.values.B)));
        }, this)
      );


    },

    render: function() {
      console.log("view");
      $(this.el).html(this.template(this.model.toJSON()));
      this.postRender()
      return this.el
    },

  });

  window.StatsView = StatsView

})();