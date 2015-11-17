define([
    'underscore'
], function(_, State){
    return [
        'axis_map',
        ["context", "width", "height"],
        {
            center: [13, 35],
            scale: 1000,
            map_data: null,
            stroke_color: 'black',
            callback: function(){},
            fill: "steelblue"
        },
        function(context, width, height, options){
            var g = context;
            
            var projection = d3.geo.mercator()
                    .center(options.center)
                    .scale(options.scale);
            
            var path = d3.geo.path().projection(projection);
            var id = Nyaplot.utils.uuid();

            g
                .attr("clip-path","url(#" + id + ")")
                .append("clipPath")
                .attr("id", id)
                .append("rect")
                .attr({
                    "x" : 0,
                    "y" : 0,
                    "width" : width,
                    "height" : height
                });
            
            var map = g.selectAll("path")
                    .data(options.map_data.features)
                    .enter()
                    .append('path')
                    .attr("d", path)
                    .attr("stroke", options.stroke_color)
                    .attr("fill", function(d){
                        if(d.id == "BMU")return 'none';
                        return options.fill;
                    })
                    .on("mousedown", function(d){
                        options.callback(d);
                    })
                    .on("mouseover", function(d){
                        d3.select(this).style("fill", d3.rgb(options.fill).darker(1));
                    })
                    .on("mouseout", function(d){
                        d3.select(this).style("fill", options.fill);
                    });
            
            return new Nyaplot.State({
                update_callback: function(callback){
                    options.callback = callback;
                }
            });
        }
    ];
});
