function togglePassword() {
  const passField = document.getElementById("adminPassInput");
  passField.type = passField.type === "password" ? "text" : "password";
}
function showFeatureMessage(msg) {
  const featureMsg = document.getElementById("featureMsg");
  featureMsg.textContent = "⚠️ " + msg;
}

async function verifyAdmin() {
  const pass = document.getElementById("adminPassInput").value.trim();
  const msg = document.getElementById("adminMsg");

  if (pass === "Sushil@55") {
    msg.textContent = "✅ Access granted. Loading data...";
    msg.style.color = "#0984e3";
    await loadAdminData();
  } else {
    msg.textContent = "❌ गलत पासवर्ड!";
    msg.style.color = "red";
    document.getElementById("historyTable").style.display = "none";
  }
}

async function loadAdminData() {
  const tbody = document.querySelector("#historyTable tbody");
  const msg = document.getElementById("adminMsg");

  tbody.innerHTML = "";

  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbz-3AhxhrO7q-vI4Mr2ELmryKemFSCCUXMcbXnXd1_QXYb-HyK8XPKmmPI5OOfQfa-Z/exec");
    const data = await res.json();

    if (!data || data.length === 0) {
      msg.textContent = "⚠️ No records found.";
      msg.style.color = "#e17055";
      return;
    }

    document.getElementById("historyTable").style.display = "table";

    data.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.id}</td>
        <td>${row.name}<br>${row.phone}</td>
        <td>${row.date}<br>${row.time}</td>
        <td>${row.location.replace(",", "<br>")}</td>
        <td>${row.status === "IN" ? "🟢&nbsp;&nbsp;&nbsp; IN" : "🔴 OUT"}</td>
      `;
      tbody.appendChild(tr);
    });

    msg.textContent = `✅ ${data.length} records loaded.`;
    msg.style.color = "hsl(305, 100.00%, 36.10%)";
  } catch (err) {
    msg.textContent = "❌ Error loading data.";
    msg.style.color = "red";
  }
}
const idNameMap = {
    "101": "Rahul",
    "102": "Vishal",
    "103": "Sushil",
    "104": "Priya",
    "105": "Anjali"
  };

  function toggleFeedback() {
    document.getElementById("feedbackForm").style.display = "block";
    document.querySelector(".admin-buttons").style.display = "none";
    document.getElementById("scrollWrapper").style.display = "none";
  }

  function closeFeedback() {
    document.getElementById("feedbackForm").style.display = "none";
    document.querySelector(".admin-buttons").style.display = "flex";
  }

  async function sendFeedback() {
    const id = document.getElementById("idInput").value.trim();
    const message = document.getElementById("messageInput").value.trim();
    const name = idNameMap[id];
    const now = new Date();
    const date = now.toLocaleDateString("en-GB");
    const time = now.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
    const thankyou = document.getElementById("thankyou");

    if (!id || !message) {
      thankyou.textContent = "❗कृपया सभी फ़ील्ड भरें।";
      thankyou.style.color = "red";
      return;
    }

    if (!name) {
      thankyou.textContent = "❌ मान्य ID नहीं मिली!";
      thankyou.style.color = "red";
      return;
    }

    thankyou.innerHTML = "🔄 कृपया प्रतीक्षा करें...";

    const formData = new URLSearchParams();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("message", message);
    formData.append("date", date);
    formData.append("time", time);

    const response = await fetch("https://script.google.com/macros/s/AKfycbwPGdp_k3_Vm0q_LniwZPWRozTSHru7lsI2r7rQSGDHZzHT3t4alxgEGrfAjhoZZjJf6A/exec", {
      method: "POST",
      body: formData
    });

    if (response.ok) {
      thankyou.textContent = `Thanks! ${name}`;
      thankyou.style.color = "green";
      document.getElementById("idInput").value = "";
      document.getElementById("messageInput").value = "";
    } else {
      thankyou.textContent = "❌ Data भेजने में त्रुटि हुई।";
      thankyou.style.color = "red";
    }
  }

  function togglePassword() {
    const input = document.getElementById("adminPassInput");
    const icon = document.getElementById("togglePass");
    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  }

  function showFeatureMessage(msg) {
    document.getElementById("featureMsg").textContent = msg;
  }
