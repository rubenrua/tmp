YUI.add('moodle-atto_pumukitpr-button', function (Y, NAME) {

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_pumukitpr
 * @copyright  2013 Damyon Wiese  <damyon@moodle.com>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_pumukitpr_alignment-button
 */

/**
 * Atto pumukitpr selection tool.
 *
 * @namespace M.atto_pumukitpr
 * @class Button
 * @extends M.editor_atto.EditorPlugin
 */



var COMPONENTNAME = 'atto_pumukitpr';
var FLAVORCONTROL = 'pumukitpr_flavor';
var LOGNAME = 'atto_pumukitpr';

var CSS = {
        INPUTSUBMIT: 'atto_media_urlentrysubmit',
        INPUTCANCEL: 'atto_media_urlentrycancel',
        FLAVORCONTROL: 'flavorcontrol'
    },
    SELECTORS = {
        FLAVORCONTROL: '.flavorcontrol'
    };

var TEMPLATE = '' +
    '<h2> __asdf  asf asdf fdsaf asdf__  </h2>' +
    '<p> asdf  asf asdf fdsaf asdf  </p>' +
    '<iframe src="{{PUMUKITURL}}" frameborder="0" allowfullscreen style="width:100%;height:80vh">' +
    '</iframe>' +
    '<form class="atto_form">' +
        '<input class="{{CSS.FLAVORCONTROL}}" id="{{elementid}}_{{FLAVORCONTROL}}" ' +
            'name="{{elementid}}_{{FLAVORCONTROL}}" value="{{defaultflavor}}" ' +
            'type="hidden" />' +
    '</form>';

Y.namespace('M.atto_pumukitpr').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {


    _receiveMessageBind: null,

    /**
     * Initialize the button
     *
     * @method Initializer
     */
    initializer: function() {
        // If we don't have the capability to view then give up.
        if (this.get('disabled')){
            return;
        }

        this.addButton({
            icon: 'e/insert_edit_video',
            //icon: 'icon',
            //iconComponent: 'atto_pumukitpr',
            buttonName: 'pumukitpr',
            callback: this._displayDialogue,
            callbackArgs: 'iconone'
        });

    },

    /**
     * Get the id of the flavor control where we store the ice cream flavor
     *
     * @method _getFlavorControlName
     * @return {String} the name/id of the flavor form field
     * @private
     */
    _getFlavorControlName: function(){
        return(this.get('host').get('elementid') + '_' + FLAVORCONTROL);
    },


     /**
     * Display the pumukitpr Dialogue
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function(e, clickedicon) {
        e.preventDefault();
        var width=900;

        this._receiveMessageBind = this._receiveMessage.bind(this);
        window.addEventListener('message', this._receiveMessageBind);

        var dialogue = this.getDialogue({
            headerContent: this.get('dialogtitle'),
            width: width + 'px',
            focusAfterHide: clickedicon
        });
        //dialog doesn't detect changes in width without this
        //if you reuse the dialog, this seems necessary
        if(dialogue.width !== width + 'px'){
            dialogue.set('width',width+'px');
        }

        //append buttons to iframe
        var buttonform = this._getFormContent(clickedicon);

        var bodycontent =  Y.Node.create('<div></div>');
        bodycontent.append(buttonform);

        //set to bodycontent
        dialogue.set('bodyContent', bodycontent);
        dialogue.show();
        this.markUpdated();
    },


     /**
     * Return the dialogue content for the tool, attaching any required
     * events.
     *
     * @method _getDialogueContent
     * @return {Node} The content to place in the dialogue.
     * @private
     */
    _getFormContent: function(clickedicon) {
        var template = Y.Handlebars.compile(TEMPLATE),
            content = Y.Node.create(template({
                elementid: this.get('host').get('elementid'),
                CSS: CSS,
                FLAVORCONTROL: FLAVORCONTROL,
                PUMUKITURL: this.get('pumukitprurl'),
                component: COMPONENTNAME,
                defaultflavor: this.get('defaultflavor'),
                clickedicon: clickedicon
            }));

        this._form = content;
        //this._form.one('.' + CSS.INPUTSUBMIT).on('click', this._doInsert, this);
        return content;
    },

    /**
     * Inserts the users input onto the page
     * @method _getDialogueContent
     * @private
     */
    _doInsert : function(e){
        e.preventDefault();
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        var flavorcontrol = this._form.one(SELECTORS.FLAVORCONTROL);

        // If no file is there to insert, don't do it.
        if (!flavorcontrol.get('value')){
            Y.log('No flavor control or value could be found.', 'warn', LOGNAME);
            return;
        }

        this.editor.focus();
        this.get('host').insertContentAtFocusPoint(flavorcontrol.get('value'));
        this.markUpdated();

    },


    _receiveMessage : function(e){
        if (e.data.type != 'atto_pumukitpr') {
            return;
        }

        e.preventDefault();
        this.getDialogue({
            focusAfterHide: null
        }).hide();

        // If no file is there to insert, don't do it.
        if (!e.data.url){
            Y.log('No URL from pumukitpr value could be found.', 'warn', LOGNAME);
            return;
        }

        window.removeEventListener('message', this._receiveMessageBind);

        this.editor.focus();
        this.get('host').insertContentAtFocusPoint(e.data.url);
        this.markUpdated();
    }
}, {
    ATTRS: {
        pumukitprurl: {
            value: ''
        },
        dialogtitle: {
            value: ''
        }
    }
});


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
