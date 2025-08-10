window.onload = function() {
    if (!localStorage.getItem("API_KEY")) {
        const apiKey = window.prompt('Enter your API_KEY here. Get the API_KEY from https://huggingface.co/')
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
  getPreferredVoice()
  if (!localStorage.getItem("API_KEY")) {
    document.getElementById('result').value = 'Get your API_KEY';
    return;
  }
  document.getElementById('result').value = 'Loading...';
  const API_KEY = localStorage.getItem("API_KEY");
  const language = document.getElementById('language').value;
  const transcript = document.getElementById('userinput').value;
  console.log("Sending transcript:", transcript);
  const defaultmode = `In the first sentance only Translate the ${transcript} to ${language}. The first sentance should only consist of just the word tranlated 2 lines under the 1st sentance write short 2 sentence defining and explaining the meaning the the translation. make sure your translations are correct and accurate. Be as accurate with the translation as possible and get them from google translate. Don't put the translated word in the response and dont put things like **Definition and Explanation** or any *. make sure the translation is 1 lines above the description.`
  const generatemode = `generate item or request they say which is ${transcript}, into ${language} and an example of this is if someone says Generate a nice letter to my spanish sister, you generate a full letter in ${language} and you do not translate Generate a nice letter to my spanish sister. make what you generate sound a bit human too. dont put the tranlation of the the generated text in the response`
  let mode
        let userInput = document.getElementById('userinput');
        let value = userInput.value || '';
        if (value.toLowerCase().startsWith('generate')) {
           mode = generatemode
          userInput.style.color = '#972ee1ff';
        } else {
          userInput.style.color = '';
            mode = defaultmode
        }
  try {
    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b:fireworks-ai",
        messages: [
          {
            role: "user",
            content: `${mode}`,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("Response data:", data);

    if (data.choices && data.choices.length > 0) {
      document.getElementById('result').value =
        data.choices?.[0]?.message?.content || '';
      console.log("Llama answer:", data.choices?.[0]?.message?.content || '');
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

 setInterval(function() {
        let userInput = document.getElementById('userinput');
        let value = userInput.value || '';
        if (value.toLowerCase().startsWith('generate')) {
          userInput.style.color = '#972ee1ff';
          document.getElementById('translatebtn').textContent = 'Generate'
          document.getElementById('translatebtn').style.color = '#972ee1ff'
        } else {
          userInput.style.color = '';
          document.getElementById('translatebtn').textContent = 'Translate'
          document.getElementById('translatebtn').style.color = '#000000ff'
        }
      }, 1000);

document.getElementById('copybtn').addEventListener('click', function() {
    const text = document.getElementById('result').value;
    copyTextToClipboard(text);
    document.getElementById('copybtn').textContent ='Copy✔'
})


