define([
    'underscore',
    'state'
], function(_, State){
    return [
        "interactive_map",
        ["context", "map", "callback", "updates"],
        {},
        function(context, axis, callback, updates){
            axis.update_callback(function(d){
                callback(d);
                _.each(updates, function(state){
                    state.update();
                });
            });
            return new State();
        }
    ];
});
