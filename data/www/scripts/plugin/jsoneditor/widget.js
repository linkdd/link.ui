define(['classify', 'jquery', 'app/widget/el', 'jsoneditor'], function(classify, $, ElementWidget, JSONEditor) {

    classify.classify(ElementWidget, 'JsonEditorWidget', function() {
        classify.def('initialize', function() {
            this.callSuper();

            var jsoncontainer = $('<div/>', {
                style: 'height: 100%'
            });
            this.editor = new JSONEditor(jsoncontainer[0], this.conf.options || {});
            this.container.append(jsoncontainer);

            if (this.conf.url !== undefined) {
                var me = this;

                this.application.controllers.ajax.get(this.conf.url).then(function(view) {
                    me.editor.set(view)
                });

                var btn = $('<button/>', {
                    class: 'btn btn-primary',
                    type: 'button'
                });
                btn.data('loading-text', ' Saving...')

                btn.append($('<span/>', {
                    class: 'glyphicon glyphicon-ok'
                }));

                btn.append(' Save');
                btn.click(function() {
                    btn.button('loading');
                    me.application.controllers.ajax.put(
                        me.conf.url,
                        me.editor.get()
                    ).then(function() {
                        btn.button('reset');
                    });
                });

                var btncontainer = $('<div/>', {
                    class: 'pull-right'
                });
                btncontainer.css('padding', '10px');
                btncontainer.append(btn);

                this.container.append(btncontainer);
            }
        });

        classify.def('render', function() {
            this.setReady();
        });
    });

    return JsonEditorWidget;
});
