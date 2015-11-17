define([
    'underscore'
], function(_){
    return [
        "position_map",
        ["map_axis"],
        {},
        function(axis){
            var projection = axis.projection;
            return function(xlabel, ylabel){
                return {
                    x: function(d){
                        return projection(d[xlabel], d[ylabel])[0];
                    },
                    y: function(d){
                        return projection(d[xlabel], d[ylabel])[1];
                    }};
            };
        }
    ];
});
