const API_KEY = "sk-your-openai-api-key";

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
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Hãy gợi ý các trường đại học/cao đẳng tại Việt Nam phù hợp với các tiêu chí sau: ${keyword}. 
                                    Cho biết lý do phù hợp cho từng trường. Định dạng: 
                                    1. Tên trường
                                    - Địa điểm: 
                                    - Chuyên ngành nổi bật: 
                                    - Lý do phù hợp:`,
          },
        ],
      }),
    });

    const data = await response.json();
    const recommendation = data.choices[0].message.content;
    resultDiv.textContent = recommendation;
  } catch (error) {
    console.error("Lỗi:", error);
    resultDiv.textContent =
      "Hệ thống đang phát triển vui lòng quay lại sau!!!!!";
    // resultDiv.textContent = "Có lỗi xảy ra, vui lòng thử lại";
  } finally {
    loader.style.display = "none";
  }
}
