window.onload = function() {
    if (!localStorage.getItem("API_KEY")) {
        const apiKey = window.prompt('Enter your API_KEY here.')
        if (apiKey) {
            localStorage.setItem("API_KEY", apiKey)
        } else {
            alert("API key is required.")
        }
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

document.getElementById('translatebtn').addEventListener('click', translate)

async function translate() {
    document.getElementById('result').innerHTML = 'Loading...'
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
              content: `In the first sentance only Translate the ${transcript} to ${language}. The first sentance should only consist of just the word tranlates 2 lines under the 1st sentance write a short 2 sentence definitions of the translation.`,
            },
          ],
        }),
      });
      
      const data = await response.json();
      console.log("Response data:", data);
      
      if (data.choices && data.choices.length > 0) {
       document.getElementById('result').innerHTML = data.choices?.[0]?.message?.content || '';
       console.log("Answer:", data.choices?.[0]?.message?.content || '')
      } else {
        console.error("Unexpected response format:", data);
      }
      
    } catch (err) {
      console.error("Error during fetch:", err);
    }
  }

  async function copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Text copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

document.getElementById('copybtn').addEventListener('click', function() {
    const text = document.getElementById('result').value;
    copyTextToClipboard(text);
    document.getElementById('copybtn').textContent ='Copy✔'
})


