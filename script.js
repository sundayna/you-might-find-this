import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBaUXGNaKvD-AG1eHv-bc4HLcY1r80iwkw",
  authDomain: "you-might-find-this.firebaseapp.com", 
  projectId: "you-might-find-this", 
  storageBucket: "you-might-find-this.firebasestorage.app",
  messagingSenderId: "158990428262",
  appId: "1:158990428262:web:faf561857212f16c3be5a7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Firebase 已經準備好連線！");


// ===== 發送訊息 =====
document.getElementById("sendBtn").addEventListener("click", async () => {
  const recipient = document.getElementById("recipient").value.trim();
  const message = document.getElementById("message").value.trim();
  const color = document.getElementById("colorPicker").value;

  if (!recipient || !message) {
    alert("請填寫內容！");
    return;
  }

  try {
    await addDoc(collection(db, "messages"), {
      to: recipient,
      content: message,
      color: color,
      timestamp: new Date()
    });

    alert("訊息已送出！");
    document.getElementById("recipient").value = "";
    document.getElementById("message").value = "";

  } catch (error) {
    console.error("送出失敗", error);
    alert("傳送失敗！");
  }
});


// ===== 搜尋訊息 =====
document.getElementById("searchBtn").addEventListener("click", async () => {
  const name = document.getElementById("searchName").value.trim();
  const resultsDiv = document.getElementById("results");

  if (!name) {
    alert("請輸入名字！");
    return;
  }

  resultsDiv.innerHTML = "搜尋中...";

  try {
    const q = query(collection(db, "messages"), where("to", "==", name));
    const querySnapshot = await getDocs(q);

    resultsDiv.innerHTML = "";

    if (querySnapshot.empty) {
      resultsDiv.innerHTML = "找不到給 " + name + " 的訊息。";
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      const card = document.createElement("div");
      card.className = "message-card";

      // 卡片顏色 + 透明度
      card.style.background = hexToRGBA(data.color || "#ffffff", 0.35);

      card.innerHTML = `
        <div class="recipient">Dear: ${data.to}</div>
        <div class="message-text">${data.content}</div>
        <div class="time">
          ${data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString() : ""}
        </div>
      `;

      resultsDiv.appendChild(card);
    });

  } catch (error) {
    console.error("搜尋失敗", error);
    resultsDiv.innerHTML = "搜尋失敗，請檢查資料庫權限。";
  }
});


// ===== HEX → RGBA 轉換 =====
function hexToRGBA(hex, opacity) {
  const r = parseInt(hex.substring(1,3),16);
  const g = parseInt(hex.substring(3,5),16);
  const b = parseInt(hex.substring(5,7),16);
  return `rgba(${r},${g},${b},${opacity})`;
}

