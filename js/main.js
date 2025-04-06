const API_KEY = "AIzaSyBRvqJLeuk4IRinZ1JRHfjdZsPEgF_p9b0";

// DOM cache
const DOM = {
  ideaList: document.querySelector(".list-idea"),
  resultDiv: document.querySelector("#result"),
  historyList: document.querySelector(".list"),
  loader: document.querySelector("#loader"),
  loaderIcon: document.querySelector("#loader-icon"),
  button: document.querySelector("button"),
  boxIdea: document.querySelector(".box-idea"),
  keywordInput: document.querySelector("#keyword"),
};

// Storage helper
const storage = {
  getHistory() {
    try {
      return JSON.parse(localStorage.getItem("kq")) || [];
    } catch {
      return [];
    }
  },
  saveHistory(list) {
    localStorage.setItem("kq", JSON.stringify(list));
  },
};

// Utils
const dataLoading = [
  "Chill đi bạn, loading xíu thôi… 😎",
  "Đang tải, khum lâu đâu 🌝",
  "Chờ tầm 3 nốt nhạc… 🎶",
  "Đợi tý, team mình đang thả thính dữ liệu… 💘",
  "Team mình đang tranh luận xem nên hiển thị gì… 🤼",
];
let countEnter = 0;
const pickLoadingText = () => {
  const text = dataLoading[countEnter % dataLoading.length];
  countEnter++;
  return text;
};
const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2)}`;

// Render danh sách gợi ý cố định
function renderStaticIdeas() {
  const keywords = [
    "Công nghệ thông tin",
    "Marketing",
    "Kế toán",
    "Thiết kế đồ họa",
    "Kinh tế",
  ];
  DOM.ideaList.innerHTML = keywords.map((k) => `<li>${k}</li>`).join("");
}

// Render lịch sử search
function renderHistory() {
  const list = storage.getHistory();
  DOM.historyList.innerHTML = list
    .map((item) => `<li data-id="${item.id}">${item.title}</li>`)
    .join("");
}

// Hiển thị kết quả đã lưu
function showKQ(id) {
  const item = storage.getHistory().find((i) => i.id === id);
  if (!item) return;
  DOM.resultDiv.innerHTML = marked.parse(item.text);
  DOM.boxIdea.style.display = "none";
}

// Gọi API
async function getRecommendation() {
  const keyword = DOM.keywordInput.value.trim();
  if (!keyword) return alert("Nhập gì đi bạn ê 🌝");

  // Hiển thị loader
  DOM.loader.style.display = "block";
  DOM.loaderIcon.style.display = "block";
  DOM.loader.textContent = pickLoadingText();
  DOM.resultDiv.textContent = "";
  DOM.button.disabled = true;
  DOM.boxIdea.style.display = "none";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Hãy gợi ý các trường đại học/cao đẳng tại Việt Nam phù hợp với các tiêu chí sau: ${keyword}. \nCho biết lý do phù hợp cho từng trường. Định dạng: \n1. Tên trường\n- Địa điểm: \n- Chuyên ngành nổi bật: \n- Lý do phù hợp:`,
                },
              ],
            },
          ],
        }),
      }
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const recommendation =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Không nhận được phản hồi phù hợp";

    DOM.resultDiv.innerHTML = marked.parse(recommendation);

    // Cập nhật lịch sử: thêm mục mới lên đầu
    const history = storage.getHistory();
    const newEntry = { id: genId(), title: keyword, text: recommendation };
    storage.saveHistory([newEntry, ...history]);
    renderHistory();
  } catch (err) {
    console.error("Lỗi:", err);
    DOM.resultDiv.textContent = "Có lỗi xảy ra, vui lòng thử lại";
  } finally {
    DOM.loader.style.display = "none";
    DOM.loaderIcon.style.display = "none";
    DOM.button.disabled = false;
  }
}

// Event binding
document.addEventListener("DOMContentLoaded", () => {
  renderStaticIdeas();
  renderHistory();
});
DOM.historyList.addEventListener("click", (e) => {
  const li = e.target.closest("li[data-id]");
  if (li) showKQ(li.dataset.id);
});
