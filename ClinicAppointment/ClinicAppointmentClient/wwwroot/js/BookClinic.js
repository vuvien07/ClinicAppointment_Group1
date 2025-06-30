const host = window.location.hostname;
let isStartCallAI = false;

window.onload = async () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('isLoggingIn')) {
        showSnackbar("Đăng nhập thành công", "success");
        const newUrl = `${window.location.pathname}`;
        window.history.replaceState({}, '', newUrl);
    }
    document.querySelector('.chat-container').innerHTML = '';
    await getClinicList();
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
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">1</td>
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
    const inputLabel = ['HovaTen', 'GioiTinh', 'NgaySinhStr', 'SoDienThoai', 'Cccd', 'NgheNghiep', 'DanToc', 'LyDoKham', 'QuocTich', 'PhongKhamId'];
    let prompt = input.value;
    input.value = '';
    const div = document.createElement('div');
    div.className = 'bot-message d-flex';
    const icon = document.createElement('i');
    icon.className = 'bi bi-robot mt-2 me-2 bot-icon';
    const text = document.createElement('p');
    text.className = 'message-text color-white';
    text.textContent = '...';
    div.appendChild(icon);
    div.appendChild(text);
    document.querySelector('.chat-container').appendChild(div);

    try {
        const res = await fetch(`http://${host}:5132/api/gemini/ask`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token") || ""
            },
            body: JSON.stringify({ Prompt: prompt }),
        });

        if (res.ok) {
            document.querySelector('.chat-container').removeChild(div);
            const json = await res.json();
            if (json.result) {
                const parts = json.result.split("\n").filter(part => part.includes(":"));

                parts.forEach(part => {
                    const [label, valueRaw] = part.split(":", 2);
                    const value = valueRaw?.trim() || "";

                    if (label.includes("Tên")) {
                        const input = document.querySelector('input[name="HovaTen"]');
                        if (input) input.value = value;
                        else console.warn("Input 'HovaTen' not found");
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
                                const input = document.querySelector('input[name="NgaySinhStr"]');
                                if (input) input.value = formatted;
                                else console.warn("Input 'NgaySinhStr' not found");
                            } else {
                                console.warn("Invalid date format:", rawDate);
                            }
                        }
                    }

                    if (label.includes("Số điện thoại")) {
                        const input = document.querySelector('input[name="SoDienThoai"]');
                        if (input) input.value = value;
                        else console.warn("Input 'SoDienThoai' not found");
                    }

                    if (label.includes("Địa chỉ")) {
                        const input = document.querySelector('input[name="DiaChi"]');
                        if (input) input, input.value = value;
                        else console.warn("Input 'DiaChi' not found");
                    }

                    if (label.includes("Lí do khám")) {
                        const input = document.querySelector('input[name="LyDoKham"]');
                        if (input) input.value = value;
                        else console.warn("Input 'LyDoKham' not found");
                    }

                    if (label.includes("Nghề nghiệp")) {
                        const input = document.querySelector('input[name="NgheNghiep"]');
                        if (input) input.value = value;
                        else console.warn("Input 'NgheNghiep' not found");
                    }

                    if (label.includes("Căn cước công dân")) {
                        const input = document.querySelector('input[name="Cccd"]');
                        if (input) input.value = value;
                        else console.warn("Input 'Cccd' not found");
                    }

                    if (label.includes("Giới tính")) {
                        const select = document.querySelector('select[name="GioiTinh"]');
                        if (select) {
                            const options = Array.from(select.options).map(opt => opt.value);
                            select.value = options.includes(value) ? value : "";
                        } else {
                            console.warn("Select 'GioiTinh' not found");
                        }
                    }

                    if (label.includes("Quốc tịch")) {
                        const select = document.querySelector('select[name="QuocTich"]');
                        if (select) {
                            const options = Array.from(select.options).map(opt => opt.value);
                            select.value = options.includes(value) ? value : "Khác";
                        } else {
                            console.warn("Select 'QuocTich' not found");
                        }
                    }

                    if (label.includes("Dân tộc")) {
                        const select = document.querySelector('select[name="DanToc"]');
                        if (select) {
                            const options = Array.from(select.options).map(opt => opt.value);
                            select.value = options.includes(value) ? value : "Khác";
                        } else {
                            console.warn("Select 'DanToc' not found");
                        }
                    }
                });
                await textToSpeech(json.result);
            }
        } else {
            throw new Error("Failed to fetch response from Gemini API");
        }
    } catch (err) {
        text.textContent = 'Có lỗi xảy ra: ' + err.message;
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