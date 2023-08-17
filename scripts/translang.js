window.onload = function(){
    //let nickName = document.getElementById('nickName')

    //nickName.value = "김승민"
    //var test = $('#nickName').val('<%=userdata%>')
    //console.log(test.split(' ')[1])
    //$('#src-lang').val(test.split(' ')[1])
    //var userlang = $('#userlang').html()
    //console.log(userlang)
    //$('#src-lang').val(userlang)

    
}

if (!("webkitSpeechRecognition" in window)){
    alert("지원되지 않는 브라우저입니다.")
}
else{
    console.log("지원되는 브라우저입니다.")

    const speech = new webkitSpeechRecognition

    document.getElementById('start').addEventListener("click", () => {
        if($('#start').html() == '음성인식 시작'){
            speech.start();
            $('#start').html('음성인식 중지')
            setTimeout(()=>{
                speech.stop();
                $('#start').html('음성인식 시작')
            },7000)
        }
        else if($('#start').html() == '음성인식 중지'){
            speech.stop();
            $('#start').html('음성인식 시작')
        }
    })
   
    /*document.getElementById('start').addEventListener("click", () => {
            speech.start();
           
    })

    document.getElementById('stop').addEventListener("click", () => {
        speech.stop();
    })*/
    
    speech.addEventListener('result', (event) => {
        console.log(event)
        const {transcript} = event["results"][0][0]
        console.log(transcript)

        document.getElementById('text-input').value = transcript
    })
}







const synth = window.speechSynthesis

const textForm = document.querySelector('form')
const transInput = document.querySelector('#translate-input')
const voiceSelect = document.querySelector('#voice-select')
const rate = document.querySelector('#rate')
const rateValue = document.querySelector('#rate-value')
const pitch = document.querySelector('#pitch')
const pitchValue = document.querySelector('#pitch-value')

let voices = [];

const getVoices = () => {
    voices = synth.getVoices();
    
    voices.forEach(voice => {
        const option = document.createElement('option')

        option.textContent = voice.name + '(' + voice.lang +')'

        option.setAttribute('data-lang', voice.lang)
        option.setAttribute('data-name', voice.name)
        voiceSelect.appendChild(option)
    })
}

getVoices();

if(synth.onvoiceschanged !== undefined){
    synth.onvoiceschanged = getVoices;

}

const speek = () => {
    if(synth.speaking) {
        console.error('Already speaking...')
        return
    }
    if(transInput.value !== ''){
        const speakText = new SpeechSynthesisUtterance(transInput.value)
        
        speakText.onend = e => {
            console.log('Done speaking...')
        }

        speakText.onerror = e => {
            console.error('Something went wrong')
        }

        const SelectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name')

        voices.forEach(voice => {
            if(voice.name === SelectedVoice) {
                speakText.voice = voice
            }
        })

        speakText.rate = rate.value
        speakText.pitch = pitch.value

        synth.speak(speakText)
    }
}

textForm.addEventListener('submit',  e => {
    e.preventDefault()
    speek()
    //transInput.blur();
})

rate.addEventListener('change', e => rateValue.textContent = rate.value)
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value)

voiceSelect.addEventListener('change', e => speek())

const srcLang = document.getElementById('src-lang')
const transLang = document.getElementById('trans-lang')

const speakButton = document.querySelector('.translate-speakButton')

$('.translate-speakButton').click(function(){
    console.log(transLang.options[transLang.selectedIndex].value)
    console.log(srcLang.options[srcLang.selectedIndex].value)
    
    let sendData = document.getElementById('text-input').value
    $.ajax({
        type:'POST',   
        url:'/translate',   
        data:{
            source: srcLang.options[srcLang.selectedIndex].value,
            target: transLang.options[transLang.selectedIndex].value,
            transData: sendData,
        },   
        success : function(data){   
            console.log(data['message']['result']['translatedText']);  
            document.getElementById('translate-input').value = data['message']['result']['translatedText']
        }

    })
})

$('#uploadBtn').click(function(){
    console.log($('#uploadForm')[0])
    var form = $('#uploadForm')[0];
    var formData = new FormData(form)
    //formData.append('textImage',$('#textImage')[0].files[0])

    $.ajax({
        type:'POST',   
        url:'/image',   
        data:formData,
        processData: false,
        contentType: false,
        success : function(data){
            document.getElementById('text-input').value = data   
            console.log(data)
        }
    })
})





