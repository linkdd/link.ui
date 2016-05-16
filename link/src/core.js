define([
    'classify',
    'link/app',
    'link/utils',
    'link/widgetregistry',
    'link/widget',
    'link/widgets/element',
    'link/widgets/box',
    'link/widgets/action',
    'link/actionregistry',
    'link/actions/activate',
    'link/actions/goto'
], function(
    classify,
    Application,
    Utils,
    WidgetRegistry,
    Widget,
    ElementWidget,
    BoxWidget,
    ActionWidget,
    ActionRegistry,
    ActionActivate,
    ActionGoto

) {
    /**
     * Link Framework module.
     *
     * @module Link
     */
    classify.module('Link', function() {
        this.Application = Application;
        this.Utils = Utils;
        this.WidgetRegistry = WidgetRegistry;
        this.Widget = Widget;

        var basewidgets = {
            'el': ElementWidget,
            'box': BoxWidget,
            'action': ActionWidget
        };

        for (var wname in basewidgets) {
            this.WidgetRegistry.add(wname, basewidgets[wname]);
        }

        this.ActionRegistry = ActionRegistry;

        var baseactions = {
            'activate': ActionActivate,
            'goto': ActionGoto
        };

        for (var aname in baseactions) {
            this.ActionRegistry.add(aname, baseactions[aname]);
        }
    });

    return Link;
});