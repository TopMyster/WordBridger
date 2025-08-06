let API_KEY

window.onload = function() {
    if(!localStorage.getItem("API_KEY")) {
        document.getElementById('getkey').style.display = 'block'
        document.getElementById('submition').addEventListener('click', function() {
            API_KEY = document.getElementById('gotkey').value
            localStorage.setItem("API_KEY", API_KEY)
            document.getElementById('getkey').style.display = 'none'
        })
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

function speech() {
    txt = document.getElementById('result').value
    speak(txt, 0.8, 0.8)
}

document.getElementById('translatebtn').addEventListener('click', translate())

async function translate() {
    const API_KEY = localStorage.getItem("API_KEY")
    const language = document.getElementById('language').value
    const transcript = document.getElementById('userinput').value
    console.log("Sending transcript:", transcript);
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free",
          messages: [
            {
              role: "user",
              content: `In the first sentance only Translate the ${transcript} to ${language}. 2 lines under the 1st sentance write a short 2 sentance definitions of the translation.`,
            },
          ],
        }),
      });
      
      const data = await response.json();
      console.log("Response data:", data);
      
      if (data.choices && data.choices.length > 0) {
        document.getElementById('result').value = data.choices[0].message.content || data.choices[0].text.content
      } else {
        console.error("Unexpected response format:", data);
      }
      
    } catch (err) {
      console.error("Error during fetch:", err);
    }
  }


