/* jshint browser: true, esversion: 6 */
/* globals document,Vue,BootstrapVue,window,uibuilder */
'use strict';

import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import App from './App.vue';
import router from './router.js';
// import store from './store';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

// Vue.config.productionTip = false;
Vue.use(BootstrapVue);

new Vue({
    router,
    // store,
    render: h => h(App),
    data: {
        startMsg    : 'Vue has started, waiting for messages',
        feVersion   : '',
        counterBtn  : 0,
        inputText   : null,
        inputChkBox : false,
        socketConnectedState : false,
        serverTimeOffset     : '[unknown]',
        imgProps             : { width: 75, height: 75 },

        msgRecvd    : '[Nothing]',
        msgsReceived: 0,
        msgCtrl     : '[Nothing]',
        msgsControl : 0,

        msgSent     : '[Nothing]',
        msgsSent    : 0,
        msgCtrlSent : '[Nothing]',
        msgsCtrlSent: 0,
    },
    computed: {
        hLastRcvd: function() {
            const msgRecvd = this.msgRecvd;
            if (typeof msgRecvd === 'string') return 'Last Message Received = ' + msgRecvd;
            else return 'Last Message Received = ' + this.syntaxHighlight(msgRecvd);
        },
        hLastSent: function() {
            const msgSent = this.msgSent;
            if (typeof msgSent === 'string') return 'Last Message Sent = ' + msgSent;
            else return 'Last Message Sent = ' + this.syntaxHighlight(msgSent);
        },
        hLastCtrlRcvd: function() {
            const msgCtrl = this.msgCtrl;
            if (typeof msgCtrl === 'string') return 'Last Control Message Received = ' + msgCtrl;
            else return 'Last Control Message Received = ' + this.syntaxHighlight(msgCtrl);
        },
        hLastCtrlSent: function() {
            const msgCtrlSent = this.msgCtrlSent
            if (typeof msgCtrlSent === 'string') return 'Last Control Message Sent = ' + msgCtrlSent;
            //else return 'Last Message Sent = ' + this.callMethod('syntaxHighlight', [msgCtrlSent]);
            else return 'Last Control Message Sent = ' + this.syntaxHighlight(msgCtrlSent);
        },
    },
    methods: {
        syntaxHighlight: function(json) {
            json = JSON.stringify(json, undefined, 4);
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            })
            return json;
        },
        mounted: function() {
            /** **REQUIRED** Start uibuilder comms with Node-RED @since v2.0.0-dev3
             * Pass the namespace and ioPath variables if hosting page is not in the instance root folder
             * e.g. If you get continual `uibuilderfe:ioSetup: SOCKET CONNECT ERROR` error messages.
             * e.g. uibuilder.start('/nr/uib', '/nr/uibuilder/vendor/socket.io') // change to use your paths/names
             */
            uibuilder.start();
            
            const vueApp = this;
            
            // Example of retrieving data from uibuilder
            this.feVersion = uibuilder.get('version');
            
            //#region ---- Trace Received Messages ---- //
            // If msg changes - msg is updated when a standard msg is received from Node-RED over Socket.IO
            // newVal relates to the attribute being listened to.
            uibuilder.onChange('msg', function(newVal){
                //console.info('[indexjs:uibuilder.onChange] msg received from Node-RED server:', newVal)
                vueApp.msgRecvd = newVal;
            });
            // As we receive new messages, we get an updated count as well
            uibuilder.onChange('msgsReceived', function(newVal){
                //console.info('[indexjs:uibuilder.onChange] Updated count of received msgs:', newVal)
                vueApp.msgsReceived = newVal;
            });
            
            // If we receive a control message from Node-RED, we can get the new data here - we pass it to a Vue variable
            uibuilder.onChange('ctrlMsg', function(newVal){
                //console.info('[indexjs:uibuilder.onChange:ctrlMsg] CONTROL msg received from Node-RED server:', newVal)
                vueApp.msgCtrl = newVal;
            });
            // Updated count of control messages received
            uibuilder.onChange('msgsCtrl', function(newVal){
                //console.info('[indexjs:uibuilder.onChange:msgsCtrl] Updated count of received CONTROL msgs:', newVal)
                vueApp.msgsControl = newVal;
            });
            //#endregion ---- End of Trace Received Messages ---- //
            
            //#region ---- Trace Sent Messages ---- //
            // You probably only need these to help you understand the order of processing //
            // If a message is sent back to Node-RED, we can grab a copy here if we want to
            uibuilder.onChange('sentMsg', function(newVal){
                //console.info('[indexjs:uibuilder.onChange:sentMsg] msg sent to Node-RED server:', newVal)
                vueApp.msgSent = newVal;
            });
            // Updated count of sent messages
            uibuilder.onChange('msgsSent', function(newVal){
                //console.info('[indexjs:uibuilder.onChange:msgsSent] Updated count of msgs sent:', newVal)
                vueApp.msgsSent = newVal;
            });
            
            // If we send a control message to Node-RED, we can get a copy of it here
            uibuilder.onChange('sentCtrlMsg', function(newVal){
                //console.info('[indexjs:uibuilder.onChange:sentCtrlMsg] Control message sent to Node-RED server:', newVal)
                vueApp.msgCtrlSent = newVal;
            });
            // And we can get an updated count
            uibuilder.onChange('msgsSentCtrl', function(newVal){
                //console.info('[indexjs:uibuilder.onChange:msgsSentCtrl] Updated count of CONTROL msgs sent:', newVal)
                vueApp.msgsCtrlSent = newVal;
            });
            //#endregion ---- End of Trace Sent Messages ---- //
            
            // If Socket.IO connects/disconnects, we get true/false here
            uibuilder.onChange('ioConnected', function(newVal){
                //console.info('[indexjs:uibuilder.onChange:ioConnected] Socket.IO Connection Status Changed to:', newVal)
                vueApp.socketConnectedState = newVal;
            });
            // If Server Time Offset changes
            uibuilder.onChange('serverTimeOffset', function(newVal){
                //console.info('[indexjs:uibuilder.onChange:serverTimeOffset] Offset of time between the browser and the server has changed to:', newVal)
                vueApp.serverTimeOffset = newVal;
            });
        }
    },
}).$mount('#app');
