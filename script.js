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
  const featureMsg = document.getElementById("featureMsg");
  featureMsg.textContent = "⚠️ " + msg;
}
function verifyAdmin() {
  const pass = document.getElementById("adminPassInput").value;
  const msg = document.getElementById("adminMsg");

  if (pass === "admin123") {
    msg.textContent = "🔄 Processing...";
    msg.style.color = "orange";
    localStorage.setItem("adminLoggedIn", "true"); // ✅ Save login state
    loadAdminData();
  } else {
    msg.textContent = "❌ Incorrect password!";
    msg.style.color = "red";
  }
}
async function loadAdminData() {
  const msg = document.getElementById("adminMsg");
  msg.textContent = "🔄 Processing...";
  msg.style.color = "orange";

  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbz-3AhxhrO7q-vI4Mr2ELmryKemFSCCUXMcbXnXd1_QXYb-HyK8XPKmmPI5OOfQfa-Z/exec");
    const data = await res.json();

    // Hide login panel and show history
    document.getElementById("adminPanel").style.display = "none";
    document.getElementById("historySection").style.display = "block";
    msg.textContent = "";

    const tbody = document.querySelector("#historyTable tbody");
    tbody.innerHTML = "";

    let totalUsers = new Set();
    let totalAttendance = 0;

    data.reverse().forEach((row, index) => {
      const tr = document.createElement("tr");
      if (index === 0) tr.classList.add("highlight");
      tr.innerHTML = `
        <td>${row.id}</td>
        <td>${row.name}<br>${row.phone}</td>
        <td>${row.date}<br>${row.time}</td>
        <td>${row.location.replace(",", "<br>")}</td>
        <td style="min-width: 100px;">${row.status === "IN" ? "🟢&nbsp;&nbsp;&nbsp; IN" : "🔴 OUT"}</td>
      `;
      tbody.appendChild(tr);

      totalUsers.add(row.id);
      if (row.status === "IN") totalAttendance++;
    });

    // ✅ Update count
    document.getElementById("totalUsers").textContent = totalUsers.size;
    document.getElementById("totalAttendance").textContent = totalAttendance;

  } catch (err) {
    msg.textContent = "❌ Failed to load data.";
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
// 📄 Download as PDF
function downloadHistoryPDF() {
  const element = document.getElementById("historySection");
  html2pdf().from(element).save("Attendance_History.pdf");
}
  // 🔙 Logout & Back to Admin Panel//
function backToAdminPanel() {
  localStorage.removeItem("adminLoggedIn"); // ✅ Clear login state
  document.getElementById("historySection").style.display = "none";
  document.getElementById("adminPanel").style.display = "block";
  document.getElementById("adminMsg").textContent = "";
}

// 💬 Open Feedback Form
function toggleFeedback() {
  document.getElementById("adminPanel").style.display = "none";
  document.getElementById("feedbackForm").style.display = "block";
}

// 💬 Close Feedback Form
function closeFeedback() {
  document.getElementById("feedbackForm").style.display = "none";
  document.getElementById("adminPanel").style.display = "block";
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
      thankyou.style.color = " hsla(219, 93%, 45%, 1.00)";
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
function filterTable() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.querySelectorAll("#historyTable tbody tr");

  rows.forEach(row => {
    const regNo = row.cells[0]?.textContent.toLowerCase() || "";
    const name = row.cells[1]?.textContent.toLowerCase() || "";

    if (regNo.includes(input) || name.includes(input)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}
// 📅 Filter by Date
function filterTableByDate() {
  const inputDate = document.getElementById("dateFilterInput").value;
  const rows = document.querySelectorAll("#historyTable tbody tr");

  rows.forEach(row => {
    const dateCell = row.cells[2]?.innerText.split("\n")[0]; // Extract date
    row.style.display = dateCell === inputDate ? "" : "none";
  });
}

// ✅ Auto-login on page load if already logged in
window.onload = function () {
  if (localStorage.getItem("adminLoggedIn") === "true") {
    loadAdminData(); // 🚀 Auto-login
  }
};

