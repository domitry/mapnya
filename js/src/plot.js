define([
    "underscore",
    "simple/base"
], function(_, SimpleBase){
    _.extend(Plot.prototype, SimpleBase.prototype);
    
    function Plot(callback, updates, options){
        SimpleBase.apply(this);

        this.callback = _.isUndefined(callback) ? function(){console.log("hello");} : callback; 

        if(!_.isUndefined(updates)){
            this.updates = _.flatten(_.map(updates, function(p){
                return _.map(p.charts, function(c){
                    return c.uuid;
                });
            }));
            console.log("done", this.updates);
        }else{
            this.updates = [];
        }

        this.create_sheets = function(){
            this.sheets = [
                this.background_uuid,
                this.context_uuid,
                this.axis_uuid,
                this.label_uuid
            ];
        };
        
        this.create_axis = function(){
            this.axis = {
                type: "axis_map", uuid: this.axis_uuid, args: {
	                width: this.view_width,
	                height: this.view_height
                }, sync_args:{
                    // xscale: this.xscale_uuid,
                    // yscale: this.yscale_uuid
                }
            };
        };

        this.create_interactive = function(){
            this.interactive_layer = {
                type: "interactive_map", uuid: this.interactive_uuid, args: {
                    callback: this.callback
                }, sync_args: {
                    map: this.axis_uuid,
                    updates: this.updates
                }
            };
        };
        
        _.extend(this, options);
        this.xdomain = [0, 100];
        this.ydomain = [0, 100];
        this.xscale_type = this.yscale_type = "linear";
        this.charts = [];
    }

    Plot.prototype.merge_domain = function(type, src, dst){
        if(type=="linear"){
            return [
                Math.min(src[0], dst[0]),
                Math.max(src[1], dst[1])
            ];
        }else if(type=="ordinal"){
            return _.union(src, dst);
        }
        throw new Error("Not implemented.");
    };

    Plot.prototype.add = function(chart){
        if(_.isArray(chart)){
            _.each(chart, _.bind(function(c){this.add(c);}, this));
            return;
        }
        
        if(_.isNull(this.xscale_type) && _.isNull(this.yscale_type)){
            this.xscale_type = chart.xscale_type;
            this.yscale_type = chart.yscale_type;
        }else if(this.xscale_type !=  chart.xscale_type || this.yscale_type != chart.yscale_type)
            throw new Error("scale_type does not match.");

        this.xdomain = this.merge_domain(this.xscale_type, this.xdomain, chart.xdomain);
        this.ydomain = this.merge_domain(this.yscale_type, this.ydomain, chart.ydomain);

        this.charts.push(chart);
    };

    Plot.prototype.create_models = function(standalone){
        standalone = _.isUndefined(standalone) ? true : false;
        
        this.data_arr = _.map(this.charts, function(c){
            return c.data;
        });
        
        this.plots = _.map(this.charts, _.bind(function(c){
            return c.to_json(this);
        }, this));

        var arr = SimpleBase.prototype.create_models.apply(this);

        if(standalone == true){
            arr.push(
                {
                    type: "pane", uuid: "pane", args: {
	                    "parent_id":"vis",
	                    "layout": {type: "rows", contents: [0]}
                    }, sync_args: {
                        stages: [this.stage_uuid]
                    }
                }
            );
        }

        return arr;
    };

    return Plot;
});
