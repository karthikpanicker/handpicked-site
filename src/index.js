import 'jquery/dist/jquery.min';
const QRious = require('qrious/dist/qrious');
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import './css/meyer-reset.css';
import './css/styles.css';
import './load-custom-sections';
import { BASE_URL } from './constants';

window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
window.castReceiverManager.start();
window.castReceiverManager.onSenderDisconnected = function (event) {
    if (window.castReceiverManager.getSenders().length == 0 &&
        event.reason == cast.receiver.system.DisconnectReason.REQUESTED_BY_SENDER) {
        window.close();
    }
};

(function() {
    function fetchRoomInfo() {
        fetch(BASE_URL + 'roominfo')
            .then(function (response) {
                if (response.status == 200) {
                    return response.json();
                } else {
                    var image = document.getElementById('qr-code');
                    image.src = "placeholder.png";
                    document.getElementById("code-span").textContent = "";
                }
            })
            .then(function (myJson) {
                if (myJson) {
                    const url = new URL(myJson);
                    document.getElementById("code-span").textContent = "2cast.tv and enter code: "+url.searchParams.get("passcode");
                    var qr = new QRious({
                        element: document.getElementById('qr-code'),
                        value: myJson,
                        size: 250,
                    });
                }
            })
            .catch(function (error) {
                console.log("Unable to connect to connect server.")
            });
    }
    fetchRoomInfo();
    window.setInterval(fetchRoomInfo, 10000);
})();
