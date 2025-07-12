const host = window.location.hostname;
let isStartCallAI = false;
let totalFilterSchedulePage = 0;
let isLoadedRecord = false;
let isBookedFail = false;
let isBookedSuccess = false;
let isCalledWithClient = false;

let filterpatientSchedule = {
    page: 1,
    pageSize: 15,
    gender: '',
    clinicId: 0,
    keyword: '',
    startDate: '',
    endDate: ''
}

let filterCall = {
    "starttime": "2023-01-01T00:00:00+07:00",
    "endtime": "2026-01-28T13:59:00+07:00",
    "call_id": "",
    "customer_number": "",
    "callType": "",
    "agent": [],
    "ipPhone": "",
    "transactionId": "",
    "page": 1,
    "limit": 5,
    "call_status": "hangup",
    "direction":"inbound"
}

let bookClinicForm = {
    HoVaTen: '',
    GioiTinh: '',
    NgaySinhStr: '',
    SoDienThoai: '',
    DiaChi: '',
    Cccd: '',
    NgheNghiep: '',
    DanToc: '',
    PhongKhamId: 0,
    Gio: '',
    LyDoKham: '',
    QuocTich: ''
}

window.onload = async () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('isLoggingIn')) {
        showSnackbar("Đăng nhập thành công", "success");
        const newUrl = `${window.location.pathname}`;
        window.history.replaceState({}, '', newUrl);
    }
    document.querySelector('.chat-container').innerHTML = '';
    await getClinicList();
    audioRemote = document.getElementById("audio_remote");
    //addHtmlLogin();
    //addHtml();
    //loadCredentials();

    //if (usingAutoLogin === 1) {
    //    onRegister();
    //    loadContentPhoneDial();
    //} else {
    //    loadContentPhone();
    //}
    addHtml();
    //loadContentPhoneDial();
    addHtmlLogin();
    onRegister();
    document.querySelector('#alohub_call_dial').style.display = 'none';
    document.querySelector('#alohub_calling_content').style.display = 'none';
    document.querySelector('#alohub_answer_content').style.display = 'none';
}

async function startCall(e) {
    e.preventDefault();
    try {
        if (isStartCallAI) return;
        const div = document.createElement('div');
        div.className = 'bot-message d-flex';
        const icon = document.createElement('i');
        icon.className = 'bi bi-robot mt-2 me-2 bot-icon';
        const text = document.createElement('p');
        text.className = 'message-text color-white';
        div.appendChild(icon);
        let textt = 'Xin chào, chúng tôi là chuyên viên hỗ trợ bạn trong việc đặt lịch khám. Đầu tiên thì bạn có thể cung cấp cho chúng tôi về tên của bạn được không?';

        let formData = new FormData();
        formData.append("text", textt);

        const res = await fetch(`http://localhost:8001/tts`, {
            method: "POST",
            body: formData
        });

        if (res.ok) {
            const blob = await res.blob();
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            audio.playbackRate = 1.2;
            loadTextWithAudioPlay(audio, textt);
        }
        isStartCallAI = true;
    } catch (error) {
        showSnackbar(error.message, "error");
    }
}

function loadTextWithAudioPlay(audio, textt) {
    const text = document.createElement('p');
    text.className = 'message-text color-white';
    text.textContent = "";

    const div = document.createElement('div');
    div.className = 'bot-message d-flex';
    const icon = document.createElement('i');
    icon.className = 'bi bi-robot mt-2 me-2 bot-icon';

    div.appendChild(icon);
    div.appendChild(text);
    document.querySelector('.chat-container').appendChild(div);

    audio.addEventListener('loadedmetadata', () => {
        const words = textt.split(" ");
        const totalTime = audio.duration / audio.playbackRate;
        const wordInterval = (totalTime / words.length) * 1000;

        audio.play();

        let currentWord = 0;
        const interval = setInterval(() => {
            if (currentWord >= words.length) {
                clearInterval(interval);
                return;
            }
            text.textContent += (currentWord > 0 ? " " : "") + words[currentWord];
            currentWord++;
        }, wordInterval);
    });
}

async function getClinicList() {
    try {
        const res = await fetch(`http://${host}:5132/api/BookClinic/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (res.ok) {
            let json = await res.json();
            await UpdateClinicList(json);
            await UpdateSelectClinicList(json);
        } else {
            throw new Error("Failed to fetch clinic list");
        }
    } catch (error) {
        showSnackbar(error.message, "error");
    }
}

async function textToSpeech(text) {
    try {
        let initialtext = text;
        text = normalizeText(text);
        const formData = new FormData();
        formData.append("text", text);
        const res = await fetch(`http://localhost:8001/tts`, {
            method: "POST",
            body: formData
        });
        if (res.ok) {
            const blob = await res.blob();
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            audio.playbackRate = 1.2;
            loadTextWithAudioPlay(audio, initialtext);
        }
    } catch (error) {
        showSnackbar(error.message, "error");
    }
}

async function UpdateClinicList(data) {
    let contentHtml = ``;
    data.forEach(item => {
        contentHtml += `
         <tr>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.tenPhong}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">${item.thongTinPhongKhams[0]?.hen || 0}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">${item.thongTinPhongKhams[0]?.dangKy || 0}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">${item.thongTinPhongKhams[0]?.kham || 0}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">${(item.thongTinPhongKhams[0]?.hen || 0) + (item.thongTinPhongKhams[0]?.dangKy || 0) + (item.thongTinPhongKhams[0]?.kham || 0)}</td>
         </tr>
        `;
    });
    const table = document.getElementById("clinic-info-table");
    if (table) {
        table.innerHTML = contentHtml;
    } else {
        console.error("Element with ID 'clinic-info-table' not found");
    }
}

async function UpdateSelectClinicList(data) {
    let contentHtml = `<option value="0">Không</option>`;
    data.forEach(item => {
        contentHtml += `
         <option value="${item.phongKhamId}">${item.tenPhong}</option>
        `;
    });
    const select = document.getElementById("select-clinic-section");
    if (select) {
        select.innerHTML = contentHtml;
    } else {
        console.error("Element with ID 'select-clinic-section' not found");
    }
}

async function sendMessageAndReceiveAnswer() {
    const input = document.querySelector('input[name="userPrompt"]');
    if (!input || input.value.trim() === "") {
        console.warn("User prompt input is empty or not found");
        return;
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = 'user-message';
    const messageContent = document.createElement('p');
    messageContent.className = 'message-text';
    messageContent.textContent = input.value;
    messageDiv.appendChild(messageContent);
    document.querySelector('.chat-container').appendChild(messageDiv);
    await answerUserPrompt(input);
}

async function answerUserPrompt(input) {
    try {
        const res = await fetch(`http://${host}:5132/api/gemini/ask`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token") || ""
            },
            body: JSON.stringify({ Prompt: input }),
        });

        if (res.ok) {
            const json = await res.json();
            if (json.result) {
                const parts = json.result.split("\n").filter(part => part.includes(":"));

                parts.forEach(part => {
                    const [label, valueRaw] = part.split(":", 2);
                    const value = valueRaw?.trim() || "";

                    if (label.includes("Tên")) {
                        bookClinicForm.HoVaTen = value;
                    }

                    if (label.includes("Ngày sinh")) {
                        const rawDate = value;
                        const [day, month, year] = rawDate.split(/[/\-]/).map(x => x?.trim());
                        if (day && month && year) {
                            const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
                            if (!isNaN(parsedDate.getTime())) {
                                const yyyy = parsedDate.getFullYear();
                                const mm = String(parsedDate.getMonth() + 1).padStart(2, '0');
                                const dd = String(parsedDate.getDate()).padStart(2, '0');
                                const formatted = `${yyyy}-${mm}-${dd}`;
                                bookClinicForm.NgaySinhStr = formatted;
                            } else {
                                console.warn("Invalid date format:", rawDate);
                            }
                        }
                    }

                    if (label.includes("Số điện thoại")) {
                        bookClinicForm.SoDienThoai = value;
                    }

                    if (label.includes("Địa chỉ")) {
                        bookClinicForm.DiaChi = value;
                    }

                    if (label.includes("Lí do khám")) {
                        bookClinicForm.LyDoKham = value;
                    }

                    if (label.includes("Nghề nghiệp")) {
                        bookClinicForm.NgheNghiep = value;
                    }

                    if (label.includes("Căn cước công dân")) {
                        bookClinicForm.Cccd = value;
                    }

                    if (label.includes("Giới tính")) {
                        bookClinicForm.GioiTinh = value;
                    }

                    if (label.includes("Quốc tịch")) {
                        bookClinicForm.QuocTich = value;
                    }

                    if (label.includes("Dân tộc")) {
                        bookClinicForm.DanToc = value;
                    }
                    if (label.includes("Giờ khám")) {
                        bookClinicForm.Gio = value;
                    }
                    if (label.includes("Phòng khám")) {
                        bookClinicForm.PhongKhamId = parseInt(value) || 0;
                    }
                });
            }
        } else {
            throw new Error("Failed to fetch response from Gemini API");
        }
    } catch (err) {
        console.error("Error in answerUserPrompt:", err);
    }
}

function checkAnyNullOrEmptyInput() {
    let check = true;
    let text = '\nCác thông tin còn thiếu: \n';
    const inputs = document.querySelectorAll('input[name]');
    const selects = document.querySelectorAll('select[name]');

    inputs.forEach(input => {
        if (!input || input.value.trim() === '') {
            const label = input.dataset.label || input.name;
            text += `${label}\n`;
            check = false;
        }
    });

    selects.forEach(select => {
        if (!select || select.value.trim() === '' || select.value === '0') {
            const label = select.dataset.label || select.name;
            text += `${label}\n`;
            check = false;
        }
    });

    return { check, text };
}

let audioStream;
let recorder;
let is_recording = false;

async function startRecording() {
    try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const input = audioContext.createMediaStreamSource(audioStream);
        recorder = new Recorder(input, { numChannels: 1 });
        recorder.record();
        console.log("🔴 Đang ghi âm...");
    } catch (err) {
        console.error("Error starting recording:", err);
        showSnackbar("Không thể bắt đầu ghi âm", "error");
    }
}

async function stopRecording() {
    if (recorder) {
        recorder.stop();
        recorder.exportWAV(async (blob) => {
            await speechToText(blob);
        });
        audioStream.getTracks().forEach(track => track.stop());
        recorder = null;
    }
}

async function recordingAudio() {
    const icon = document.querySelector(".recordAudio");
    if (!icon) {
        console.warn("Record audio icon not found");
        return;
    }

    if (is_recording) {
        icon.style.color = "white";
        await stopRecording();
    } else {
        icon.style.color = "red";
        await startRecording();
    }
    is_recording = !is_recording;
}

async function speechToText(blob) {
    try {
        const formData = new FormData();
        formData.append("file", blob, "recording.wav");
        const res = await fetch(`http://${host}:8080/speech-to-text`, {
            method: "POST",
            body: formData
        });
        if (res.ok) {
            const json = await res.json();
            const input = document.querySelector('input[name="userPrompt"]');
            if (input) {
                input.value = json.transcription || "";
            } else {
                console.warn("User prompt input not found for speech-to-text");
            }
        } else {
            showSnackbar("Có lỗi xảy ra trong quá trình nhận diện giọng nói", "error");
        }
    } catch (err) {
        showSnackbar("Có lỗi xảy ra trong quá trình nhận diện giọng nói", "error");
        console.error("Error in speechToText:", err);
    }
}
async function speechToTextWithMp3(blob) {
    try {
        const formData = new FormData();
        formData.append("file", blob, "recording.mp3");
        const res = await fetch(`http://${host}:8080/speech-to-text`, {
            method: "POST",
            body: formData
        });
        if (res.ok) {
            const json = await res.json();
            const input = document.querySelector('input[name="userPrompt"]');
            if (input) {
                input.value = json.transcription || "";
            } else {
                console.warn("User prompt input not found for speech-to-text");
            }
        } else {
            showSnackbar("Có lỗi xảy ra trong quá trình nhận diện giọng nói", "error");
        }
    } catch (err) {
        showSnackbar("Có lỗi xảy ra trong quá trình nhận diện giọng nói", "error");
        console.error("Error in speechToText:", err);
    }
}

async function submitBookClinicForm(e) {
    e.preventDefault();
    const labels = ['HovaTen', 'GioiTinh', 'NgaySinhStr', 'SoDienThoai', 'Cccd', 'NgheNghiep', 'DanToc', 'LyDoKham', 'QuocTich', 'PhongKhamId'];
    const formData = {};

    labels.forEach(label => {
        const input = document.querySelector(`input[name="${label}"], select[name="${label}"]`);
        if (input) {
            formData[label] = label === 'PhongKhamId' ? parseInt(input.value) || 0 : input.value;
        } else {
            console.warn(`Input or select with name '${label}' not found`);
        }
    });

    try {
        const res = await fetch(`http://${host}:5132/api/BookClinic/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        });
        const json = await res.json();
        if (!res.ok) {
            if (json.errors) {
                labels.forEach(label => DisplayError(label, json.errors));
                showSnackbar("Vui lòng kiểm tra các trường thông tin", "error");
            } else if (json.status === 500) {
                showSnackbar(json.message, "error");
            }
        } else {
            showSnackbar("Đặt lịch khám thành công", "success");
            await getClinicList();
        }
    } catch (err) {
        showSnackbar("Có lỗi xảy ra!", "error");
        console.error("Error in submitBookClinicForm:", err);
    }
}

function DisplayError(id, errors) {
    const errorElement = document.getElementById(id);
    if (!errorElement) {
        console.warn(`Error element with ID '${id}' not found`);
        return;
    }
    errorElement.innerText = errors && errors[id] ? errors[id] : '';
}

function clearMessage(e) {
    e.preventDefault();
    const container = document.querySelector('.chat-container');
    if (container) {
        container.innerHTML = '';
    } else {
        console.warn("Chat container not found");
    }
}

async function addToBenhAnDienTu(e) {
    e.preventDefault();
    try {
        e.preventDefault();
        const labels = ['HovaTen', 'GioiTinh', 'NgaySinhStr', 'SoDienThoai', 'Cccd', 'NgheNghiep', 'DanToc', 'LyDoKham', 'QuocTich', 'PhongKhamId'];
        const formData = {};

        labels.forEach(label => {
            const input = document.querySelector(`input[name="${label}"], select[name="${label}"]`);
            if (input) {
                formData[label] = label === 'PhongKhamId' ? parseInt(input.value) || 0 : input.value;
            } else {
                console.warn(`Input or select with name '${label}' not found`);
            }
        });
        formData['LichHenId'] = parseInt(document.querySelector('input[name="LichHenId"]').value) || 0;
        const res = await fetch(`http://${host}:5132/api/BookClinic/addToElectronicDisease`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData)
        });
        const json = await res.json();
        if (!res.ok) {
            if (json.errors) {
                labels.forEach(label => DisplayError(label, json.errors));
                showSnackbar("Vui lòng kiểm tra các trường thông tin", "error");
            } else if (json.status === 500) {
                showSnackbar(json.message, "error");
            }
        } else {
            showSnackbar(json.message, "success");
            await getClinicList();
        }

    } catch (err) {
        console.error(err)
        showSnackbar("Có lỗi xảy ra", "error");
    }
}

async function fetchAllPatientSchedule(e) {
    e.preventDefault();
    try {
        const response = await fetch(`http://${host}:5132/api/Patient`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(filterpatientSchedule),
        });

        const json = await response.json();

        if (response.ok) {
            updatePatientScheduleTable(json.schedules);
            totalFilterSchedulePage = json.totalPage;
            document.getElementById('current-page').innerText = json.page;
            document.getElementById('total-records').innerText = (json.schedules?.length || 0) + " / " + (filterpatientSchedule.pageSize || 0);
        } else {
            showSnackbar("Lỗi khi lấy lịch khám", "error");
        }
    } catch (err) {
        console.error(err);
        showSnackbar("Có lỗi xảy ra", "error");
    }
}

async function fetchAllCallHistory(e) {
    e.preventDefault();
    if (!isLoadedRecord) {
        showLoading();
        try {
            const response = await fetch(`https://2.alohub.vn:9909/api/v1.0/base/searchCallV1?userName=admin.vienvu&source=ipcc`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "brhsgtpukcjjzpxvfibxebcoqlcuen"
                },
                body: JSON.stringify(filterCall),
            });

            const json = await response.json();

            if (response.ok) {
                updateRecordTable(json.data);
            } else {
                showSnackbar("Lỗi khi lấy lịch khám", "error");
            }
        } catch (err) {
            console.error(err);
            showSnackbar("Có lỗi xảy ra", "error");
        } finally {
            hideLoading(); // Always hide spinner when done
            isLoadedRecord = true;
        }
    }
}



function updatePatientScheduleTable(data) {
    let contentHtml = ``;
    data?.map((schedule, index) => {
        contentHtml += `
         <tr data-schedule='${JSON.stringify(schedule)}' onclick="autoCompleteClinicForm(event, this)">
                                <td class="border p-2">${index + 1}</td>
                                <td class="border p-2">${schedule.patientDTO?.hovaTen || ''}</td>
                                <td class="border p-2">${schedule.patientDTO?.ngaySinh || ''}</td>
                                <td class="border p-2">${schedule.patientDTO?.diaChi || ''}</td>
                                <td class="border p-2">${schedule.patientDTO?.soDienThoai || ''}</td>
                                <td class="border p-2">${schedule.patientDTO?.gioiTinh || ''}</td>
                                <td class="border p-2">Người lớn</td>
                                <td class="border p-2">Có</td>
                                <td class="border p-2">${schedule.lyDoKham || ''}</td>
                                <td class="border p-2">Khám tổng quát</td>
                                <td class="border p-2">${schedule.clinicDTO?.tenPhong || ''}</td>
                                <td class="border p-2">Đã đăng ký</td>
                            </tr>
        `;
    });
    document.getElementById('patient-schedule-table-body').innerHTML = contentHtml;

}

function updateRecordTable(data) {
    let contentHtml = ``;
    data?.map((record, index) => {
        contentHtml += `
        <tr>
    <td class="border p-2">${index + 1}</td>
    <td class="border p-2">${record.called || ''}</td>
    <td class="border p-2">${record.caller_number || ''}</td>
    <td class="border p-2">${record.starttime || ''}</td>
    <td class="border p-2">${record.endtime || ''}</td>
    <td class="border p-2">${record.total_duration || ''}</td>
    <td class="border p-2">
        <button onclick="fetchRecordUrl('https://2.alohub.vn:1777/IPCCMedia/MP3Export.do?url=${encodeURIComponent(record.recording_url || '')}&source=ipcc')">Link</button>
    </td>
    <td class="border p-2"> <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onclick="bookClientAppointment('https://2.alohub.vn:1777/IPCCMedia/MP3Export.do?url=${encodeURIComponent(record.recording_url || '')}&source=ipcc', '${record.caller_number || ''}')">Đặt lịch hẹn</button></td>
</tr>
        `;
    });
    document.getElementById('record-table-body').innerHTML = contentHtml;

}

function autoCompleteClinicForm(e, element) {
    e.preventDefault();
    let parsedData = JSON.parse(element.dataset.schedule);
    document.querySelector('input[name="HovaTen"]').value = parsedData.patientDTO?.hovaTen || '';
    document.querySelector('input[name="NgaySinhStr"]').value = parsedData.patientDTO?.ngaySinh || '';
    document.querySelector('input[name="SoDienThoai"]').value = parsedData.patientDTO?.soDienThoai || '';
    document.querySelector('input[name="LyDoKham"]').value = parsedData.lyDoKham || '';
    document.querySelector('select[name="PhongKhamId"').value = parsedData.clinicDTO?.phongKhamId || '';
    document.querySelector('input[name="Cccd"').value = parsedData.patientDTO?.cccd || '';
    document.querySelector('select[name="QuocTich"').value = parsedData.patientDTO?.quocTich || '';
    document.querySelector('select[name="DanToc"').value = parsedData.patientDTO?.danToc || '';
    document.querySelector('input[name="NgheNghiep"').value = parsedData.patientDTO?.ngheNghiep || '';
    document.querySelector('select[name="GioiTinh"').value = parsedData.patientDTO?.gioiTinh || '';
    document.querySelector('input[name="LichHenId"]').value = parsedData.lichHenId || 0;
}

async function fetchRecordUrl(url) {
    try {
        const encodedUrl = encodeURIComponent(url);

        const response = await fetch(`http://localhost:5132/api/recordProxy/mp3?url=${encodedUrl}`);
        if (response.ok) {
            const blob = await response.blob();
            const audio = new Audio(URL.createObjectURL(blob));
            audio.play();
        }
    } catch (err) {
        console.log(err);
    }
}

async function bookClientAppointment(url, callerNumber) {
    try {
        const encodedUrl = encodeURIComponent(url);

        const response = await fetch(`http://localhost:5132/api/recordProxy/mp3?url=${encodedUrl}`);
        if (response.ok) {
            const blob = await response.blob();
            const formData = new FormData();
            formData.append("file", blob, "recording.mp3");
            const speechToTextRes = await fetch(`http://${host}:8080/speech-to-text`, {
                method: "POST",
                body: formData
            });
            if (speechToTextRes.ok) {
                const json = await speechToTextRes.json();
                await answerUserPrompt(json.transcription || "")
                const res = await fetch(`http://${host}:5132/api/BookClinic/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bookClinicForm)
                });
                if (!res.ok) {
                    isBookedFail = true;
                    onCallWithProvidedNumber(callerNumber)
                }
                if (res.ok) {
                    isBookedSuccess = true;
                    onCallWithProvidedNumber(callerNumber)
                }
            }
        }
    } catch (err) {
        console.log(err);
    }
}