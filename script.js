let API_KEY

window.onload = function() {
    if(!API_KEY) {
        API_KEY = window.prompt('Enter your OpenAI API key.')
        localStorage.setItem("API_KEY", API_KEY)
    }
}

function getPreferredVoice() {
    const voices = window.speechSynthesis.getVoices();
    const preferredVoices = ['Samantha',];
    
    for (let preferred of preferredVoices) {
        const voice = voices.find(v => v.name.includes(preferred));
        if (voice) return voice;
    }

    const femaleVoice = voices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('woman') ||
        v.gender === 'female'
    );
    if (femaleVoice) return femaleVoice;
    return voices[0] || null;
}
function speak(text, pitch = 0.3, rate = 0.3) {
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getPreferredVoice();
    
    if (voice) {
        utterance.voice = voice;
    }
    
    utterance.pitch = pitch
    utterance.rate = rate
    utterance.volume = 1.0
    utterance.lang = 'en-US'
    window.speechSynthesis.speak(utterance)
}

async function ask() {
    const transcript = localStorage.getItem("transcript");
    console.log("Sending transcript:", transcript);
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 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",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free",
          messages: [
            {
              role: "user",
              content: `Answer the question or statement, ${transcript}.(Speak English by default and don't include so many emojis and don't declare everything you do before doing it)`,
            },
          ],
        }),
      });
      
      const data = await response.json();
      console.log("Response data:", data);
      
      if (data.choices && data.choices.length > 0) {
        document.getElementById('content').style.animation = 'aiactive 1.3s infinite;'
        txt =  data.choices[0].message.content || data.choices[0].text.content
        speak(txt, 0.8, 0.8)
        console.log("ChatGPT reply:", data.choices[0].message.content || data.choices[0].text.content);
      } else {
        console.error("Unexpected response format:", data);
      }
      
    } catch (err) {
      console.error("Error during fetch:", err);
    }
  }


