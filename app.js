const LIFF_ID = "PUT_YOUR_LIFF_ID_HERE";

const form = document.getElementById("booking-form");
const statusBox = document.getElementById("liff-status");
const resultBox = document.getElementById("result");
const historyBox = document.getElementById("history");
const submitBtn = document.getElementById("submit-btn");

const today = new Date();
document.getElementById("date").min = today.toISOString().split("T")[0];

function setStatus(type, text) {
  statusBox.className = `notice ${type}`;
  statusBox.textContent = text;
}

function getZoneLabel(zone) {
  return {
    indoor: "ห้องแอร์",
    outdoor: "เอาท์ดอร์",
    private: "ห้องส่วนตัว"
  }[zone] ?? zone;
}

function saveHistory(booking) {
  const current = JSON.parse(localStorage.getItem("bookingHistory") || "[]");
  current.unshift(booking);
  localStorage.setItem("bookingHistory", JSON.stringify(current.slice(0, 5)));
}

function renderHistory() {
  const list = JSON.parse(localStorage.getItem("bookingHistory") || "[]");
  if (!list.length) {
    historyBox.classList.add("hidden");
    return;
  }

  historyBox.classList.remove("hidden");
  historyBox.innerHTML = `
    <h3>ประวัติการจองล่าสุด</h3>
    <ol class="summary">
      ${list
        .map(
          (item) =>
            `<li>${item.name} - ${item.date} ${item.time} (${item.guests} คน, ${getZoneLabel(item.zone)})</li>`
        )
        .join("")}
    </ol>
  `;
}

function validateBooking(date, time) {
  const slot = new Date(`${date}T${time}:00`);
  return !Number.isNaN(slot.getTime()) && slot > new Date();
}

async function initializeLiff() {
  try {
    await liff.init({ liffId: LIFF_ID });

    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    const profile = await liff.getProfile();
    document.getElementById("name").value = profile.displayName;

    if (liff.isInClient()) {
      setStatus("ok", "เชื่อมต่อ LIFF สำเร็จ สามารถส่งข้อมูลกลับไปยังแชตได้");
    } else {
      setStatus("ok", "เปิดผ่านเบราว์เซอร์ภายนอก: ยังจองได้ แต่จะไม่ส่งข้อความกลับแชต");
    }
  } catch (error) {
    console.error(error);
    setStatus("error", "เชื่อมต่อ LIFF ไม่สำเร็จ กรุณาตรวจสอบ LIFF ID");
    submitBtn.disabled = true;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.reportValidity()) {
    return;
  }

  const booking = {
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    date: form.date.value,
    time: form.time.value,
    guests: Number(form.guests.value),
    zone: form.zone.value,
    note: form.note.value.trim(),
    createdAt: new Date().toISOString()
  };

  if (!validateBooking(booking.date, booking.time)) {
    setStatus("error", "กรุณาเลือกวันเวลาในอนาคตสำหรับการจอง");
    return;
  }

  saveHistory(booking);
  renderHistory();

  resultBox.classList.remove("hidden");
  resultBox.innerHTML = `
    <h3>จองสำเร็จ ✅</h3>
    <ul class="summary">
      <li>ชื่อ: ${booking.name}</li>
      <li>โทร: ${booking.phone}</li>
      <li>วันเวลา: ${booking.date} ${booking.time}</li>
      <li>จำนวนคน: ${booking.guests}</li>
      <li>โซน: ${getZoneLabel(booking.zone)}</li>
      <li>หมายเหตุ: ${booking.note || "-"}</li>
    </ul>
  `;

  if (window.liff && liff.isInClient()) {
    await liff.sendMessages([
      {
        type: "text",
        text:
          `📌 ยืนยันการจองโต๊ะ\n` +
          `ชื่อ: ${booking.name}\n` +
          `วันเวลา: ${booking.date} ${booking.time}\n` +
          `จำนวนคน: ${booking.guests}\n` +
          `โซน: ${getZoneLabel(booking.zone)}\n` +
          `เบอร์โทร: ${booking.phone}`
      }
    ]);

    setStatus("ok", "บันทึกการจองแล้ว และส่งรายละเอียดกลับไปยังแชต LINE เรียบร้อย");
  }

  form.reset();
  document.getElementById("date").min = today.toISOString().split("T")[0];
});

renderHistory();
initializeLiff();
