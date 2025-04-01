const API_KEY = "AIzaSyBRvqJLeuk4IRinZ1JRHfjdZsPEgF_p9b0";

async function getRecommendation() {
  const keyword = document.getElementById("keyword").value;
  const resultDiv = document.getElementById("result");
  const loader = document.getElementById("loader");

  if (!keyword) {
    alert("Vui lòng nhập từ khoá");
    return;
  }

  loader.style.display = "block";
  resultDiv.textContent = "";

  try {
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
                },
              ],
            },
          ],
        }),
      }
    );

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
  }
}
