window.onload = async() => {
    try {
        const res = await fetch("http://localhost:5132/api/ClinicInfo/create", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if(!res.ok){
            throw new Error("Không thể kết nối tới server");
        }
    } catch (error) {
        showSnackbar(error.message, "error");
    }
}
async function LoginToSystem(e) {
    e.preventDefault();
    let labels = [
        'Username',
        'Password',]
    try {
        const res = await fetch("http://localhost:5132/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Username: document.querySelector('input[name="TenDangNhap"]').value,
                Password: document.querySelector('input[name="MatKhau"]').value,
            })
        });
        const json = await res.json();
        if (!res.ok) {
            if (json.errors) {
                let errors = json.errors;
                for (let i = 0; i < labels.length; i++) {
                    DisplayError(labels[i], errors);
                }
            }
            if (json.message) {
                showSnackbar(json.message, "error");
            }
        } else {
            window.location.href = "/bookclinic?isLoggingIn=true";
        }
    } catch (error) {
        showSnackbar(error.message, "error");
    }
}
function DisplayError(id, errors) {
    if (!errors || !errors[id]) {
        document.getElementById(id).innerText = '';
        return;
    };
    document.getElementById(id).innerText = errors[id];
}
