const API_KEY = "AIzaSyBRvqJLeuk4IRinZ1JRHfjdZsPEgF_p9b0";
let countEnter = 0;

const keywordSuggestions = () => {
  const idea = document.querySelector(".list-idea");

  if (!idea) return;

  const keyword = [
    "Công nghệ thông tin",
    "Marketing",
    "Kế toán",
    "Thiết kế đồ họa",
    "Kinh tế",
  ];

  idea.innerHTML = keyword.map((item) => `<li>${item}</li>`).join("");
};

// Gọi hàm sau khi DOM đã tải xong
document.addEventListener("DOMContentLoaded", keywordSuggestions);

async function getRecommendation() {
  const keyword = document.querySelector("#keyword").value;
  const resultDiv = document.querySelector("#result");
  const loader = document.querySelector("#loader");
  const loaderIcon = document.querySelector("#loader-icon");
  const button = document.querySelector("button");

  const dataLoading = [
    "Chill đi bạn, loading xíu thôi… 😎",
    "Đang tải, khum lâu đâu 🌝",
    "Chờ tầm 3 nốt nhạc… 🎶",
    "Đợi tý, team mình đang thả thính dữ liệu… 💘",
    "Team mình đang tranh luận xem nên hiển thị gì… 🤼",
  ];
  if (!keyword) {
    alert("Nhập gì đi bạn ê 🌝");
    return;
  }

  loader.style.display = "block";
  loaderIcon.style.display = "block";
  loader.innerText = dataLoading[Math.floor(Math.random() * 5)];
  console.log(Math.floor(Math.random() * 5));

  resultDiv.textContent = "";
  if (countEnter >= 5) {
    loader.innerText = "Bình tĩnh bạn ơi, app chưa kịp thở đây nè 🌬️";
  }
  countEnter += 1;

  try {
    button.disabled = true;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Hãy gợi ý các trường đại học/cao đẳng tại Việt Nam phù hợp với các tiêu chí sau: ${keyword}. \nCho biết lý do phù hợp cho từng trường. Định dạng: \n1. Tên trường\n- Địa điểm: \n- Chuyên ngành nổi bật: \n- Lý do phù hợp:`,
                  // text: `${keyword}`,
                },
              ],
            },
          ],
        }),
      }
    );
    countEnter >= 6 ? (countEnter = 0) : countEnter;
    const data = await response.json();
    const recommendation =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Không nhận được phản hồi phù hợp";
    resultDiv.innerHTML = marked.parse(recommendation);
  } catch (error) {
    console.error("Lỗi:", error);
    resultDiv.textContent = "Có lỗi xảy ra, vui lòng thử lại";
  } finally {
    loader.style.display = "none";
    loaderIcon.style.display = "none";
    button.disabled = false;
  }
}
