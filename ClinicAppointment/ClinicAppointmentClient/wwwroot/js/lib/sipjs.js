var session;
var coolPhone;
var intervalId;
var timeCount = 0;
var audioRemote;
var isAutoAnswer = 1;
var usingCallJs = 1;
var usingAutoLogin = 1;

var callOptions = {
    pcConfig: {
        rtcpMuxPolicy: 'negotiate',
        iceServers: [{'urls': ['stun:stun.l.google.com:19302']}]
    },
    mediaConstraints: {
        audio: true,
        video: false
    },
    /*Add 7/1/2024, fix loi server gui REINVITE sau 60s tren Chrome */
    sessionTimersExpires: 1800
};

//window.onload = function () {
//    audioRemote = document.getElementById("audio_remote");
//    addHtmlLogin();
//    addHtml();
//    loadCredentials();

//    if (usingAutoLogin === 1) {
//        onRegister();
//        loadContentPhoneDial();
//    } else {
//        loadContentPhone();
//    }
//}

function addHtmlLogin() {
    if (usingAutoLogin === 1) {
        document.getElementById('alohub_sipml5').innerHTML += "<input type=\"text\" id=\"txtDomain\" value=\"\" class=\"hidden\" placeholder=\"e.g: alohub.vn\">\n" +
            "    <input type=\"password\" id=\"txtApiKey\" value=\"brhsgtpukcjjzpxvfibxebcoqlcuen\" class=\"hidden\" placeholder=\"apiKey\">\n" +
            "    <input type=\"text\" id=\"txtWebsocketServerUrl\" value=\"wss://crm.alohub.vn:57445\" class=\"hidden\"\n" +
            "           placeholder=\"e.g: wss://alohub.vn:7443\">\n" +
            "    <input type=\"text\" id=\"txtPrivateIdentity\" value=\"15655\" class=\"hidden\" placeholder=\"e.g: 9999\">\n" +
            "    <input type=\"password\" id=\"txtPassword\" value=\"VIENVU@#2025\" class=\"hidden\">\n" +
            "    <input type=\"text\" id=\"txtDisplayName\" value=\"15655\" class=\"hidden\">\n" +
            "    <input type=\"text\" id=\"txtPublicIdentity\" value=\"sip:15655@crm.alohub.vn:55094\" class=\"hidden\">";
    } else {
        document.getElementById('alohub_sipml5').innerHTML += "<div id=\"alohub_login_content\">\n" +
            "        <button id=\"btnOpenLoginForm\" class=\"alohub_button-call\" onclick=\"onTogglePhone();\">\n" +
            "            <svg width=\"25\" height=\"25\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
            "                <path d=\"M9 16C2.814 9.813 3.11 5.134 5.94 3.012l.627-.467a1.483 1.483 0 0 1 2.1.353l1.579 2.272a1.5 1.5 0 0 1-.25 1.99L8.476 8.474c-.38.329-.566.828-.395 1.301.316.88 1.083 2.433 2.897 4.246 1.814 1.814 3.366 2.581 4.246 2.898.474.17.973-.015 1.302-.396l1.314-1.518a1.5 1.5 0 0 1 1.99-.25l2.276 1.58a1.48 1.48 0 0 1 .354 2.096l-.47.633C19.869 21.892 15.188 22.187 9 16z\"\n" +
            "                      fill=\"customColor\"/>\n" +
            "            </svg>\n" +
            "        </button>\n" +
            "        <div id=\"alohub_login_form\">\n" +
            "        <span class=\"alohub_icon_minimize\" onclick=\"onTogglePhone();\">\n" +
            "               <svg width=\"25\" height=\"25\" viewBox=\"0 0 32 32\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">\n" +
            "                  <g id=\"icomoon-ignore\"></g>\n" +
            "                  <path d=\"M6.576 6.576c-5.205 5.205-5.205 13.643 0 18.849s13.643 5.205 18.849-0c5.206-5.206 5.206-13.643 0-18.849s-13.643-5.205-18.849 0zM24.67 24.67c-4.781 4.781-12.56 4.781-17.341 0s-4.781-12.56 0-17.341c4.781-4.781 12.56-4.781 17.341 0s4.78 12.56-0 17.341z\"\n" +
            "                        fill=\"customColor\"></path>\n" +
            "                  <path d=\"M10.722 9.969l-0.754 0.754 5.278 5.278-5.253 5.253 0.754 0.754 5.253-5.253 5.253 5.253 0.754-0.754-5.253-5.253 5.278-5.278-0.754-0.754-5.278 5.278z\"\n" +
            "                        fill=\"customColor\"></path>\n" +
            "               </svg>\n" +
            "        </span>\n" +
            "            <div class=\"alohub_form_item\">\n" +
            "                <label for=\"txtWebsocketServerUrl\">WebSocket Server URL</label>\n" +
            "                <input type=\"text\" id=\"txtWebsocketServerUrl\" placeholder=\"e.g. ws://sipml5.org:5062\">\n" +
            "            </div>\n" +
            "            <div class=\"alohub_form_item\">\n" +
            "                <label for=\"txtDisplayName\">Display Name</label>\n" +
            "                <input type=\"text\" id=\"txtDisplayName\" placeholder=\"e.g. John Doe\">\n" +
            "            </div>\n" +
            "            <div class=\"alohub_form_item\">\n" +
            "                <label for=\"txtPublicIdentity\">Public Identity</label>\n" +
            "                <input type=\"text\" id=\"txtPublicIdentity\" placeholder=\"e.g. sip:+33600000000@doubango.org\">\n" +
            "            </div>\n" +
            "            <div class=\"alohub_form_item\">\n" +
            "                <label for=\"txtPassword\">Password</label>\n" +
            "                <input type=\"password\" id=\"txtPassword\">\n" +
            "            </div>\n" +
            "            <div class=\"alohub_form_item_footer\">\n" +
            "                <button id=\"btnRegister\" onclick=\"onRegister();\">Login</button>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>";
    }
}

function addHtml() {
    document.getElementById('alohub_sipml5').innerHTML += '<!--Form Login\'-->\n' +
        '    <!--Form nhập số điện thoại(có validate số, enter sẽ gọi ra, và có 2 position khi người dùng thay đổi)-->\n' +
        '    <div id="alohub_call_dial" style="display: none">\n' +
        '            <span class="alohub_icon_full" onclick="minimizeContent();">\n' +
        '                    <svg width="25" height="25" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none"\n' +
        '                         stroke="customColor">\n' +
        '                        <polyline points="36 48 48 48 48 36"/>\n' +
        '                        <polyline points="28 16 16 16 16 28"/>\n' +
        '                        <rect x="8" y="8" width="48" height="48"/>\n' +
        '                        <line x1="16" y1="16" x2="28" y2="28"/>\n' +
        '                        <line x1="48" y1="48" x2="36" y2="36"/>\n' +
        '                    </svg>\n' +
        '                </span>\n' +
        '        <span class="alohub_icon_minimize" onclick="minimizeContent();">\n' +
        '                    <svg width="25" height="25" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">\n' +
        '                        <g id="icomoon-ignore">\n' +
        '                        </g>\n' +
        '                        <path d="M6.576 6.576c-5.205 5.205-5.205 13.643 0 18.849s13.643 5.205 18.849-0c5.206-5.206 5.206-13.643 0-18.849s-13.643-5.205-18.849 0zM24.67 24.67c-4.781 4.781-12.56 4.781-17.341 0s-4.781-12.56 0-17.341c4.781-4.781 12.56-4.781 17.341 0s4.78 12.56-0 17.341z"\n' +
        '                              fill="customColor">\n' +
        '                        </path>\n' +
        '                       <path d="M10.722 9.969l-0.754 0.754 5.278 5.278-5.253 5.253 0.754 0.754 5.253-5.253 5.253 5.253 0.754-0.754-5.253-5.253 5.278-5.278-0.754-0.754-5.278 5.278z"\n' +
        '                             fill="customColor">\n' +
        '                       </path>\n' +
        '                    </svg>\n' +
        '                </span>\n' +
        '        <label for="txtPhoneNumber">Số điện thoại</label>\n' +
        '        <div class="d-flex">\n' +
        '          <form onsubmit="return false" class="d-flex">\n' +
        '            <input type="text" id="txtPhoneNumber">\n' +
        '            <button type="submit" id="btnClickCall" class="alohub_button-call" onclick="onCall();">\n' +
        '                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '                    <path d="M9 16C2.814 9.813 3.11 5.134 5.94 3.012l.627-.467a1.483 1.483 0 0 1 2.1.353l1.579 2.272a1.5 1.5 0 0 1-.25 1.99L8.476 8.474c-.38.329-.566.828-.395 1.301.316.88 1.083 2.433 2.897 4.246 1.814 1.814 3.366 2.581 4.246 2.898.474.17.973-.015 1.302-.396l1.314-1.518a1.5 1.5 0 0 1 1.99-.25l2.276 1.58a1.48 1.48 0 0 1 .354 2.096l-.47.633C19.869 21.892 15.188 22.187 9 16z"\n' +
        '                          fill="customColor"/>\n' +
        '                </svg>\n' +
        '            </button>\n' +
        '          </form>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <!--End form nhập số điện thoại(có validate số, enter sẽ gọi ra, và có 2 position khi người dùng thay đổi)-->\n' +
        '    <!--Form Calling(có 2 giao diện khi người dùng thay đổi)-->\n' +
        '    <div id="alohub_calling_content">\n' +
        '            <span class="alohub_icon_full" onclick="minimizeContent();">\n' +
        '                    <svg width="25" height="25" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none"\n' +
        '                         stroke="customColor">\n' +
        '                        <polyline points="36 48 48 48 48 36"/>\n' +
        '                        <polyline points="28 16 16 16 16 28"/>\n' +
        '                        <rect x="8" y="8" width="48" height="48"/>\n' +
        '                        <line x1="16" y1="16" x2="28" y2="28"/>\n' +
        '                        <line x1="48" y1="48" x2="36" y2="36"/>\n' +
        '                    </svg>\n' +
        '                </span>\n' +
        '        <span class="alohub_icon_minimize" onclick="minimizeContent();">\n' +
        '                    <svg width="25" height="25" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">\n' +
        '                        <g id="icomoon-ignore">\n' +
        '                        </g>\n' +
        '                        <path d="M6.576 6.576c-5.205 5.205-5.205 13.643 0 18.849s13.643 5.205 18.849-0c5.206-5.206 5.206-13.643 0-18.849s-13.643-5.205-18.849 0zM24.67 24.67c-4.781 4.781-12.56 4.781-17.341 0s-4.781-12.56 0-17.341c4.781-4.781 12.56-4.781 17.341 0s4.78 12.56-0 17.341z"\n' +
        '                              fill="customColor">\n' +
        '                        </path>\n' +
        '                        <path d="M10.722 9.969l-0.754 0.754 5.278 5.278-5.253 5.253 0.754 0.754 5.253-5.253 5.253 5.253 0.754-0.754-5.253-5.253 5.278-5.278-0.754-0.754-5.278 5.278z"\n' +
        '                              fill="customColor">\n' +
        '                        </path>\n' +
        '                    </svg>\n' +
        '                </span>\n' +
        '        <div class="alohub_icon">\n' +
        '            <svg width="25" height="25" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">\n' +
        '                <title>call [#191]</title>\n' +
        '                <desc>Created with Sketch.</desc>\n' +
        '                <defs>\n' +
        '                </defs>\n' +
        '                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
        '                    <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7319.000000)" fill="customColor">\n' +
        '                        <g id="icons" transform="translate(56.000000, 160.000000)">\n' +
        '                            <path d="M94,7167 L94,7169 L96,7169 C96,7167.895 95.105,7167 94,7167 M94,7163 L94,7165 C96.206,7165 98,7166.794 98,7169 L100,7169 C100,7165.686 97.314,7163 94,7163 M94,7159 L94,7161 C98.411,7161 102,7164.589 102,7169 L104,7169 C104,7163.477 99.523,7159 94,7159 M98.652,7177.234 C98.641,7177.265 98.64,7177.27 98.652,7177.234 M98.117,7174.578 C97.422,7174.204 96.719,7173.778 95.992,7173.481 C94.587,7172.908 94.682,7174.602 93.679,7175.151 C93.027,7175.508 92.107,7174.861 91.538,7174.503 C90.544,7173.877 89.663,7173.053 88.931,7172.1 C88.556,7171.613 87.728,7170.697 87.83,7170.014 C87.992,7168.93 89.274,7168.876 88.907,7167.55 C88.711,7166.84 88.36,7166.141 88.097,7165.457 C87.745,7164.54 87.6,7163.953 86.573,7164.003 C85.831,7164.039 85.339,7164.356 84.883,7164.951 C83.649,7166.558 83.835,7168.725 84.664,7170.488 C85.838,7172.983 87.85,7175.335 89.999,7176.855 C91.461,7177.889 93.387,7178.828 95.157,7178.987 C96.453,7179.104 98.266,7178.403 98.73,7176.996 C98.698,7177.094 98.667,7177.189 98.652,7177.234 C98.663,7177.199 98.687,7177.128 98.73,7176.996 C98.777,7176.854 98.8,7176.783 98.811,7176.751 C98.797,7176.793 98.765,7176.891 98.731,7176.993 C99.139,7175.753 99.189,7175.155 98.117,7174.578 M98.811,7176.751 C98.819,7176.727 98.819,7176.725 98.811,7176.751"\n' +
        '                                  id="call-[#191]">\n' +
        '                            </path>\n' +
        '                        </g>\n' +
        '                    </g>\n' +
        '                </g>\n' +
        '            </svg>\n' +
        '        </div>\n' +
        '        <div class="alohub_title">\n' +
        '            Đang gọi...\n' +
        '        </div>\n' +
        '        <div class="alohub_content_information">\n' +
        '            <div class="alohub_infomation_call">\n' +
        '                <div class="alohub_information_title">\n' +
        '                    Số điện thoại\n' +
        '                </div>\n' +
        '                <div id="txtPhoneCalling"></div>\n' +
        '                <div class="alohub_title_calling">\n' +
        '                    Đang gọi ...\n' +
        '                </div>\n' +
        '            </div>\n' +
        '            <button class="alohub_button-hangup" onclick="onHangUp();">\n' +
        '                <svg width="25" height="25" viewBox="0 0 24 24" fill=\\"none\\" xmlns="http://www.w3.org/2000/svg">\n' +
        '                    <path d="M9 16C2.814 9.813 3.11 5.134 5.94 3.012l.627-.467a1.483 1.483 0 0 1 2.1.353l1.579 2.272a1.5 1.5 0 0 1-.25 1.99L8.476 8.474c-.38.329-.566.828-.395 1.301.316.88 1.083 2.433 2.897 4.246 1.814 1.814 3.366 2.581 4.246 2.898.474.17.973-.015 1.302-.396l1.314-1.518a1.5 1.5 0 0 1 1.99-.25l2.276 1.58a1.48 1.48 0 0 1 .354 2.096l-.47.633C19.869 21.892 15.188 22.187 9 16z"\n' +
        '                          fill="customColor"/>\n' +
        '                </svg>\n' +
        '                <span class="alohub_button-title">Kết thúc</span>\n' +
        '            </button>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <!--End form Calling(có 2 giao diện khi người dùng thay đổi)-->\n' +
        '    <!--Form answer-->\n' +
        '    <div id="alohub_answer_content">\n' +
        '            <span class="alohub_icon_full" onclick="minimizeContent();">\n' +
        '                   <svg width="25" height="25" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none"\n' +
        '                        stroke="customColor">\n' +
        '                       <polyline points="36 48 48 48 48 36"/>\n' +
        '                       <polyline points="28 16 16 16 16 28"/>\n' +
        '                       <rect x="8" y="8" width="48" height="48"/>\n' +
        '                       <line x1="16" y1="16" x2="28" y2="28"/>\n' +
        '                        <line x1="48" y1="48" x2="36" y2="36"/>\n' +
        '                   </svg>\n' +
        '              </span>\n' +
        '        <span class="alohub_icon_minimize" onclick="minimizeContent();">\n' +
        '                    <svg width="25" height="25" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">\n' +
        '                       <g id="icomoon-ignore"></g>\n' +
        '                       <path d="M6.576 6.576c-5.205 5.205-5.205 13.643 0 18.849s13.643 5.205 18.849-0c5.206-5.206 5.206-13.643 0-18.849s-13.643-5.205-18.849 0zM24.67 24.67c-4.781 4.781-12.56 4.781-17.341 0s-4.781-12.56 0-17.341c4.781-4.781 12.56-4.781 17.341 0s4.78 12.56-0 17.341z"\n' +
        '                             fill="customColor"></path>\n' +
        '                       <path d="M10.722 9.969l-0.754 0.754 5.278 5.278-5.253 5.253 0.754 0.754 5.253-5.253 5.253 5.253 0.754-0.754-5.253-5.253 5.278-5.278-0.754-0.754-5.278 5.278z"\n' +
        '                             fill="customColor"></path>\n' +
        '                   </svg>\n' +
        '                </span>\n' +
        '        <div class="alohub_icon">\n' +
        '            <svg width="25" height="25" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">\n' +
        '                <title>call [#191]</title>\n' +
        '                <desc>Created with Sketch.</desc>\n' +
        '                <defs></defs>\n' +
        '                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
        '                    <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7319.000000)" fill="#000000">\n' +
        '                        <g id="icons" transform="translate(56.000000, 160.000000)">\n' +
        '                            <path d="M94,7167 L94,7169 L96,7169 C96,7167.895 95.105,7167 94,7167 M94,7163 L94,7165 C96.206,7165 98,7166.794 98,7169 L100,7169 C100,7165.686 97.314,7163 94,7163 M94,7159 L94,7161 C98.411,7161 102,7164.589 102,7169 L104,7169 C104,7163.477 99.523,7159 94,7159 M98.652,7177.234 C98.641,7177.265 98.64,7177.27 98.652,7177.234 M98.117,7174.578 C97.422,7174.204 96.719,7173.778 95.992,7173.481 C94.587,7172.908 94.682,7174.602 93.679,7175.151 C93.027,7175.508 92.107,7174.861 91.538,7174.503 C90.544,7173.877 89.663,7173.053 88.931,7172.1 C88.556,7171.613 87.728,7170.697 87.83,7170.014 C87.992,7168.93 89.274,7168.876 88.907,7167.55 C88.711,7166.84 88.36,7166.141 88.097,7165.457 C87.745,7164.54 87.6,7163.953 86.573,7164.003 C85.831,7164.039 85.339,7164.356 84.883,7164.951 C83.649,7166.558 83.835,7168.725 84.664,7170.488 C85.838,7172.983 87.85,7175.335 89.999,7176.855 C91.461,7177.889 93.387,7178.828 95.157,7178.987 C96.453,7179.104 98.266,7178.403 98.73,7176.996 C98.698,7177.094 98.667,7177.189 98.652,7177.234 C98.663,7177.199 98.687,7177.128 98.73,7176.996 C98.777,7176.854 98.8,7176.783 98.811,7176.751 C98.797,7176.793 98.765,7176.891 98.731,7176.993 C99.139,7175.753 99.189,7175.155 98.117,7174.578 M98.811,7176.751 C98.819,7176.727 98.819,7176.725 98.811,7176.751"\n' +
        '                                  id="call-[#191]">\n' +
        '                            </path>\n' +
        '                        </g>\n' +
        '                    </g>\n' +
        '                </g>\n' +
        '            </svg>\n' +
        '        </div>\n' +
        '        <div class="alohub_title">\n' +
        '            Đang nghe máy...\n' +
        '        </div>\n' +
        '        <div class="alohub_content_information">\n' +
        '            <div class="alohub_infomation_call">\n' +
        '                <div class="alohub_information_title">\n' +
        '                    Số điện thoại\n' +
        '                </div>\n' +
        '                <div id="txtPhoneAnswer"></div>\n' +
        '                <div id="txtCallTime"></div>\n' +
        '            </div>\n' +
        '            <button class="alohub_button-hangup" onclick="onHangUp();">\n' +
        '                <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '                    <path d="M9 16C2.814 9.813 3.11 5.134 5.94 3.012l.627-.467a1.483 1.483 0 0 1 2.1.353l1.579 2.272a1.5 1.5 0 0 1-.25 1.99L8.476 8.474c-.38.329-.566.828-.395 1.301.316.88 1.083 2.433 2.897 4.246 1.814 1.814 3.366 2.581 4.246 2.898.474.17.973-.015 1.302-.396l1.314-1.518a1.5 1.5 0 0 1 1.99-.25l2.276 1.58a1.48 1.48 0 0 1 .354 2.096l-.47.633C19.869 21.892 15.188 22.187 9 16z"\n' +
        '                          fill="customColor"/>\n' +
        '                </svg>\n' +
        '                <span class="alohub_button-title">Kết thúc</span>\n' +
        '            </button>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '    <!--End form answer-->'
}

function formatTime(timer) {
    const getSeconds = `0${(timer % 60)}`.slice(-2)
    const minutes = `${Math.floor(timer / 60)}`
    const getMinutes = `0${minutes % 60}`.slice(-2)
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)

    return `${getHours} : ${getMinutes} : ${getSeconds}`
}

function startRingTone() {
    try {
        ringtone.play();
    } catch (e) {
    }
}

function stopRingTone() {
    try {
        ringtone.pause();
    } catch (e) {
    }
}

function startRingbackTone() {
    try {
        ringbacktone.play();
    } catch (e) {
    }
}

function stopRingbackTone() {
    try {
        ringbacktone.pause();
    } catch (e) {
    }
}

function onTogglePhone() {
    alohub_login_form.classList.toggle("is_open");
}

function minimizeContent() {
    alohub_call_dial.classList.toggle("minimize");
    alohub_calling_content.classList.toggle("minimize");
    alohub_answer_content.classList.toggle("minimize");
}

function loadContentPhone() {
    alohub_call_dial.style.display = 'none';
    alohub_calling_content.style.display = 'none';
    alohub_answer_content.style.display = 'none';
    alohub_login_content.style.display = 'block';
}

function hiddenLogin() {
    if (usingAutoLogin !== 1) {
        alohub_login_content.style.display = 'none';
    }
}

function loadContentPhoneRinging() {
    alohub_call_dial.style.display = 'none';
    alohub_calling_content.style.display = 'block';
    alohub_answer_content.style.display = 'none';
    hiddenLogin();
}

function loadContentPhoneDial() {
    alohub_call_dial.style.display = 'block';
    alohub_calling_content.style.display = 'none';
    alohub_answer_content.style.display = 'none';
    hiddenLogin();
}

function loadContentPhoneAnswer() {
    alohub_call_dial.style.display = 'none';
    alohub_calling_content.style.display = 'none';
    alohub_answer_content.style.display = 'block';
    hiddenLogin();
}

function loadCredentials() {
    if (window.localStorage) {
        var s_value;

        if ((s_value = window.localStorage.getItem('alohub.identity.websocket_server_url'))) {
            txtWebsocketServerUrl.value = s_value;
        }
        if ((s_value = window.localStorage.getItem('alohub.identity.impu'))) {
            txtPublicIdentity.value = s_value;
        }
        if ((s_value = window.localStorage.getItem('alohub.identity.password'))) {
            txtPassword.value = s_value;
        }
        if ((s_value = window.localStorage.getItem('alohub.identity.display_name'))) {
            txtDisplayName.value = s_value;
        }
        if ((s_value = window.localStorage.getItem('alohub.identity.impi'))) {
            txtPublicIdentity.value.split(/[:@]+/)[1] = s_value;
        }
    }
}

function saveCredentials() {
    if (window.localStorage) {
        window.localStorage.setItem('alohub.identity.websocket_server_url', txtWebsocketServerUrl.value);
        window.localStorage.setItem('alohub.identity.impu', txtPublicIdentity.value);
        window.localStorage.setItem('alohub.identity.password', txtPassword.value);
        window.localStorage.setItem('alohub.identity.display_name', txtDisplayName.value);
        window.localStorage.setItem('alohub.identity.impi', txtPublicIdentity.value);
    }
}

function onClearInterVal() {
    clearInterval(intervalId);
    timeCount = 0;
}

function timeAnswer() {
    txtCallTime.innerHTML = formatTime(timeCount);
    intervalId = setInterval(() => {
        timeCount = timeCount + 1;
        txtCallTime.innerHTML = formatTime(timeCount);
    }, 1000);
}

function addPhoneNumber(number) {
    txtPhoneAnswer.innerHTML = number;
    txtPhoneCalling.innerHTML = number;
}

function onRegister() {
    var socket = new JsSIP.WebSocketInterface(txtWebsocketServerUrl.value);
    var configuration = {
        sockets: [socket],
        display_name: txtDisplayName.value,
        uri: txtPublicIdentity.value,
        password: txtPassword.value
        /*session_timers: false*/
    };

    saveCredentials();

    JsSIP.debug.enable('JsSIP:*');

    coolPhone = new JsSIP.UA(configuration);

    coolPhone.on('connected', function (e) {
        /* Your code here */
        console.log('===connected===');
        //const button = document.getElementById("callHelperButton");
        //button.click();
        //hiddenLogin();
        //loadContentPhoneDial();
    });

    coolPhone.on('disconnected', function (e) {
        /* Your code here */
        console.log('===disconnected===');
    });

    coolPhone.on('newRTCSession', function (e) {
        /* Your code here */
        console.log('===newRTCSession==');
        var newSession = e.session;

        if (session) {
            //hangup any existing call
            session.terminate();
            onClearInterVal();
        }

        session = newSession;

        session.on('ended', function () {
            session = null;
            console.log('===ended===');
            //loadContentPhoneDial();
            onClearInterVal();
            document.querySelector('#alohub_call_dial').style.display = 'none';
            document.querySelector('#alohub_calling_content').style.display = 'none';
            document.querySelector('#alohub_answer_content').style.display = 'none';
        });

        session.on('connecting', function () {
            console.log('=====Rung chuong========')
            console.log(session.remote_identity.uri.user);
            loadContentPhoneRinging();
        });

        session.on('failed', function () {
            session = null;
            console.log('===failed===');
            //loadContentPhoneDial();
            document.querySelector('#alohub_call_dial').style.display = 'none';
            document.querySelector('#alohub_calling_content').style.display = 'none';
            document.querySelector('#alohub_answer_content').style.display = 'none';
        });

        session.on('accepted', function () {
            console.log('===accepted===');
            loadContentPhoneAnswer();
        });

        session.on('confirmed', async function () {
            console.log('===confirmed===');
            stopRingTone();

            if (isSystemCall && isBookedFail) {
                await playTTSAndSendToCall(session, 'Đặt lịch thất bại. Xin vui lòng thử lại. Trân trọng cảm ơn.', true);
                isBookedFail = false;
                isSystemCall = false;
            } else if (isSystemCall && isBookedSuccess) {
                await playTTSAndSendToCall(session, 'Đặt lịch thành công. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.', true);
                isBookedSuccess = false;
                isSystemCall = false;
            } else if (isSystemCall || isUserCall) {
                await playTTSAndSendToCall(session, 'Chào mừng bạn đến với hệ thống phòng khám của chúng tôi. Bạn vui lòng cung cấp các thông tin cho chúng tôi bao gồm họ tên, ngày sinh, giới tính, số điện thoại, địa chỉ, nghề nghiệp, quốc tịch, dân tộc, lí do khám và giờ khám được không?');
                console.log("Đang chờ bạn nói...");
                await waitUntilRemoteUserStopsSpeaking(audioRemote.srcObject, 3000);
                console.log("Bạn đã ngừng nói");
                await playTTSAndSendToCall(session, 'Cảm ơn bạn đã cung cấp thông tin cho chúng tôi. Chúng tôi sẽ gửi đến phản hồi nhanh nhất cho quý vị', true);
                isSystemCall = false;
                isUserCall = false;
            }
        });


        session.on('addstream', function (e) {
            console.log('===addstream===');
        });

        session.on('peerconnection', (e) => {
            console.log('peerconnection');
            let logError = '';
            const peerconnection = e.peerconnection;

            peerconnection.onaddstream = function (e) {
                console.log('addstream', e);
            };

            var remoteStream = new MediaStream();
            console.log(peerconnection.getReceivers());
            peerconnection.getReceivers().forEach(function (receiver) {
                console.log(receiver);
                remoteStream.addTrack(receiver.track);
            });
        });

        session.on("icecandidate", function (event) {
            if (e.candidate) {
                const candidate = e.candidate.candidate;
                if (candidate.includes('::')) {
                    console.log('Filtered out IPv6 candidate:', candidate);
                    return; // Bỏ qua candidate IPv6
                }
                session.addIceCandidate(e.candidate);
            }

            if (event.candidate.type === "srflx" &&
                event.candidate.relatedAddress !== null &&
                event.candidate.relatedPort !== null) {
                event.ready();
            }
        });

        session.on('sdp', function (e) {
            console.log(e)
            e.sdp = filterSDP(e.sdp); // Loại bỏ candidate IPv6 trong SDP
        });

        if (session.direction === 'incoming') {
            console.log('===incoming===');
            isUserCall = true;
            console.log('===number===');
            if (isAutoAnswer === 0) {
                startRingTone();
                console.log(session.remote_identity.uri.user);
            } else {
                onAnswer();
            }
        } else {
            isSystemCall = true;
            console.log('session connection', session.connection)
            session.connection.addEventListener('addstream', function (e) {
                audioRemote.srcObject = e.stream;
                audioRemote.play();
            });
        }
    });

    coolPhone.on('newMessage', function (e) {
        /* Your code here */
        console.log('===newMessage===');
    });

    coolPhone.on('registered', function (e) {
        /* Your code here */
        console.log('===registered===');
        //loadContentPhoneDial();
    });

    coolPhone.on('unregistered', function (e) {
        /* Your code here */
        console.log('===unregistered===');
    });

    coolPhone.on('registrationFailed', function (e) {
        /* Your code here */
        console.log('===registrationFailed===');
    });

    coolPhone.start();
}

async function alohubMakeCall(phoneNumber) {
    if (txtDomain.value !== '' && txtApiKey.value !== '') {
        const response = await fetch(txtDomain.value, {
            method: 'POST',
            body: JSON.stringify({
                phoneNumber: phoneNumber,
                ipPhone: txtPublicIdentity.value.split(/[:@]+/)[1],
                transactionId: `ALOHUB_${new Date().getTime()}`
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': txtApiKey.value
            }
        });
        const myJson = await response.json();
        console.log('==ResponseMakeCall==', myJson);
        if (myJson.success !== '1') {
            loadContentPhoneDial();
            oSipSessionCall = null;
            alert(myJson.error_message);
        }
    } else {
        alert('Vui lòng nhập thông tin API endpoint và API key');
    }
}

function onCall() {
    var numberPhone = txtPhoneNumber.value;

    if (usingCallJs === 1) {
        coolPhone.call(numberPhone, callOptions);
    } else {
        alohubMakeCall(numberPhone);
    }

    loadContentPhoneRinging();
    addPhoneNumber(numberPhone);
}

function onCallWithProvidedNumber(number) {

    if (usingCallJs === 1) {
        coolPhone.call(number, callOptions);
    } else {
        alohubMakeCall(number);
    }
    loadContentPhoneRinging();
    document.querySelector('#alohub_calling_content').style.display = 'none';
    addPhoneNumber(number);
}

function onAnswer() {
    if (session) {
        session.answer(callOptions);
        session.connection.addEventListener('addstream', function (e) {
            audioRemote.srcObject = e.stream;
            audioRemote.play();
        });
        addPhoneNumber(session.remote_identity.uri.user);
        timeAnswer();
    }
}

function onHangUp() {
    loadContentPhoneDial();
    stopRingTone();
    stopRingbackTone();

    if (session) {
        session.terminate();
    }
}

function filterSDP(sdp) {
    console.log('test', sdp)
    return sdp.split('\r\n').filter(line => {
        // Loại bỏ các dòng chứa candidate IPv6
        return !/^a=candidate:\d+ \d+ \w+ \d+ [0-9a-fA-F:]+ .*/.test(line);
    }).join('\r\n');
}
async function playTTSAndSendToCall(session, text, isEnded = false) {
    try {
        const formData = new FormData();
        formData.append("text", text);

        const res = await fetch('http://localhost:8001/tts', {
            method: "POST",
            body: formData
        });

        if (!res.ok) throw new Error("Không lấy được âm thanh từ TTS");

        const blob = await res.blob();
        const arrayBuffer = await blob.arrayBuffer();

        const audioContext = new AudioContext();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        const destination = audioContext.createMediaStreamDestination();
        source.connect(destination);
        source.playbackRate.value = 1.2;

        const stream = destination.stream;
        const track = stream.getAudioTracks()[0];

        // Thay thế đường tiếng hiện tại trong cuộc gọi
        const sender = session.connection.getSenders().find(s => s.track?.kind === 'audio');
        if (sender) {
            await sender.replaceTrack(track);
        } else {
            session.connection.addTrack(track, stream);
        }
        source.onended = async () => {
            try {
                await audioContext.close(); // luôn đóng context
            } catch (e) {
                console.warn('Không thể đóng AudioContext:', e);
            }
            if (isEnded) {
                console.log('[INFO] Bot kết thúc cuộc gọi sau khi nói xong.');
                session.terminate();
            }
        };
        source.start();
    } catch (error) {
        console.error("Lỗi khi phát TTS vào cuộc gọi:", error);
    }
}

async function waitUntilRemoteUserStopsSpeaking(remoteStream, minSilenceMs = 3000) {
    return new Promise((resolve) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(remoteStream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);

        const data = new Uint8Array(analyser.fftSize);
        let hasSpoken = false;
        let timeoutId = null;
        const check = () => {
            analyser.getByteTimeDomainData(data);
            const rms = Math.sqrt(data.reduce((acc, val) => acc + ((val - 128) ** 2), 0) / data.length);

            if (rms > 5) {
                hasSpoken = true;
                if (timeoutId) clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    cleanup();
                    resolve();
                }, minSilenceMs);
            }

            requestAnimationFrame(check);
        };

        const cleanup = () => {
            if (timeoutId) clearTimeout(timeoutId);
            source.disconnect();
            analyser.disconnect();
            if (audioContext.state !== 'closed') audioContext.close();
        };

        check();
    });
}