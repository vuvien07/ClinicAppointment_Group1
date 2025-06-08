const host = window.location.hostname;
window.onload = async () => {
    var params = new URLSearchParams(window.location.search);
    if (params.has('isLoggingIn')) {
        showSnackbar("Đăng nhập thành công", "success");
        const newUrl = `${window.location.pathname}`;
        window.history.replaceState({}, '', newUrl);
    }
    document.querySelector('.chat-container').innerHTML = '';
    await getClinicList();
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
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">${item.thongTinPhongKhams[0]?.hen}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">${item.thongTinPhongKhams[0]?.dangKy}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">${item.thongTinPhongKhams[0]?.kham}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">1</td>
                    </tr>
        `;
    });
    document.getElementById("clinic-info-table").innerHTML = contentHtml;
}

async function UpdateSelectClinicList(data) {
    let contentHtml = `<option value="0">Không</option>`;
    data.forEach(item => {
        contentHtml += `
         <option value="${item.phongKhamId}">${item.tenPhong}</option>
        `;
    });
    document.getElementById("select-clinic-section").innerHTML = contentHtml;
}

async function sendMessageAndReceiveAnswer() {
    var input = document.querySelector('input[name="userPrompt"]');
    if (input.value === "") return;

    // Tạo phần tử tin nhắn mới
    const messageDiv = document.createElement('div');
    messageDiv.className = 'user-message';

    const messageContent = document.createElement('p');
    messageContent.className = 'message-text';
    messageContent.textContent = input.value;

    messageDiv.appendChild(messageContent);

    // Thêm vào khung chat
    document.querySelector('.chat-container').appendChild(messageDiv);
    await answerUserPrompt(input.value);

    // Xoá nội dung input
    input.value = "";
}

async function answerUserPrompt(prompt) {
    const div = document.createElement('div');
    div.className = 'bot-message d-flex';
    const icon = document.createElement('i');
    icon.className = 'bi bi-robot mt-2 me-2 bot-icon';
    const text = document.createElement('p');
    text.className = 'message-text color-white';
    text.textContent = '...';
    try {
        div.appendChild(icon);
        div.appendChild(text);
        document.querySelector('.chat-container').appendChild(div);

        const res = await fetch(`http://${host}:5132/api/gemini/ask`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ Prompt: prompt }),
        });
        if (res.ok) {
            const json = await res.json();
            if (json.result) {
                text.textContent = json.result;
                const parts = json.result?.split("\n");

                if (Array.isArray(parts)) {
                    parts.forEach(part => {
                        if (!part || !part.includes(":")) return;

                        const [label, valueRaw] = part.split(":");
                        const value = valueRaw?.trim() || "";

                        if (label.includes("Tên")) {
                            const input = document.querySelector('input[name="HovaTen"]');
                            if (input) input.value = value;
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
                                } else {
                                    console.warn("Ngày sinh không hợp lệ sau khi tách:", rawDate);
                                }
                            } else {
                                console.warn("Không thể tách ngày/tháng/năm từ:", rawDate);
                            }
                        }

                        if (label.includes("Số điện thoại")) {
                            const input = document.querySelector('input[name="SoDienThoai"]');
                            if (input) input.value = value;
                        }

                        if (label.includes("Địa chỉ")) {
                            const input = document.querySelector('input[name="DiaChi"]');
                            if (input) input.value = value;
                        }

                        if (label.includes("Lí do khám")) {
                            const input = document.querySelector('input[name="LyDoKham"]');
                            if (input) input.value = value;
                        }

                        if (label.includes("Nghề nghiệp")) {
                            const input = document.querySelector('input[name="NgheNghiep"]');
                            if (input) input.value = value;
                        }
                        if (label.includes("Căn cước công dân")) {
                            const input = document.querySelector('input[name="Cccd"]');
                            if (input) input.value = value;
                        }
                        if (label.includes("Giới tính")) {
                            const select = document.querySelector('select[name="GioiTinh"]');
                            if (select) {
                                const options = Array.from(select.options).map(opt => opt.value);
                                if (options.includes(value)) {
                                    select.value = value;
                                } else {
                                    select.value = "";
                                }
                            }
                        }
                        if (label.includes("Quốc tịch")) {
                            const select = document.querySelector('select[name="QuocTich"]');
                            if (select) {
                                const options = Array.from(select.options).map(opt => opt.value);
                                if (options.includes(value)) {
                                    select.value = value;
                                } else {
                                    select.value = "Khác";
                                }
                            }
                        }
                        if (label.includes("Dân tộc")) {
                            const select = document.querySelector('select[name="DanToc"]');
                            if (select) {
                                const options = Array.from(select.options).map(opt => opt.value);
                                if (options.includes(value)) {
                                    select.value = value;
                                } else {
                                    select.value = "Khác";
                                }
                            }
                        }


                        // Bạn có thể bổ sung thêm các trường khác tương tự ở đây nếu cần.
                    });
                }

            }
        }
    } catch (err) {
        text.textContent = 'Cos loi xay ra :' + err;
    }
}
let audioStream;
let recorder;
let is_recording = false;

async function startRecording() {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const input = audioContext.createMediaStreamSource(audioStream);
    recorder = new Recorder(input, { numChannels: 1 });

    recorder.record();
    console.log("🔴 Đang ghi âm...");
}

async function stopRecording() {
    recorder.stop();

    recorder.exportWAV(async (blob) => {
        await speechToText(blob);
    });

    audioStream.getTracks().forEach(track => track.stop());
    recorder = null;
}
async function recordingAudio() {
    let icon = document.querySelector(".recordAudio");
    if (is_recording) {
        icon.style.color = "white";
        await stopRecording();
    }
    if (!is_recording) {
        icon.style.color = "red";
        await startRecording();
    }
    is_recording = !is_recording
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
            document.querySelector('input[name="userPrompt"]').value = json.transcription;
        } else {
            showSnackbar("Có lỗi xảy ra trong quá trình nhận diện giọng nói", "error");
        }
    } catch (err) {
        showSnackbar("Có lỗi xảy ra trong quá trình nhận diện giọng nói", "error");
    }
}

async function submitBookClinicForm(e) {
    e.preventDefault();
    let labels = [
        'HovaTen', 'GioiTinh', 'NgaySinhStr', 'SoDienThoai', 'Cccd', 'NgheNghiep', 'DanToc', 'LyDoKham', 'QuocTich', 'PhongKhamId']
    try {
        const res = await fetch(`http://${host}:5132/api/BookClinic/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                HovaTen: document.querySelector('input[name="HovaTen"]').value,
                GioiTinh: document.querySelector('select[name="GioiTinh"]').value,
                NgaySinhStr: document.querySelector('input[name="NgaySinhStr"]').value,
                SoDienThoai: document.querySelector('input[name="SoDienThoai"]').value,
                Cccd: document.querySelector('input[name="Cccd"]').value,
                NgheNghiep: document.querySelector('input[name="NgheNghiep"]').value,
                DanToc: document.querySelector('select[name="DanToc"]').value,
                LyDoKham: document.querySelector('input[name="LyDoKham"]').value,
                QuocTich: document.querySelector('select[name="QuocTich"]').value,
                PhongKhamId: parseInt(document.querySelector('select[name="PhongKhamId"]').value)
            })
        });
        let json = await res.json();
        if (!res.ok) {
            if (json.errors) {
                let errors = json.errors;
                for (let i = 0; i < labels.length; i++) {
                    DisplayError(labels[i], errors);
                }
            }
            if (json.status === 500) {
                showSnackbar(json.message, "error");
            }
        } else {
            showSnackbar("Đặt lịch khám thành công", "success");
            await getClinicList();
        }
    }
    catch (err) {
        showSnackbar("Có lỗi xảy ra!", "error")
    }
}

function DisplayError(id, errors) {
    if (!errors || !errors[id]) {
        document.getElementById(id).innerText = '';
        return;
    };
    document.getElementById(id).innerText = errors[id];
}
