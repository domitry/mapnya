define([
    'plugins/map/axis',
    'plugins/map/interactive',
    'sheet'
], function(Axis, InteractiveMap, sheet){
    return function(){
        sheet.register_sheet.apply(sheet, Axis);
        sheet.register_sheet.apply(sheet, InteractiveMap);
    };
});
