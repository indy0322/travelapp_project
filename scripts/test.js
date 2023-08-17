const videoStart = document.getElementById("video-start")
const videoStop = document.getElementById("video-stop")
const camera = document.getElementById("camera")
const captureBtn = document.getElementById("captureBtn")
const captureImage = document.getElementById("captureImage")
const textImage = document.getElementById("textImage")

videoStart.addEventListener('click',async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: "environment"
        }
    })

    camera.srcObject = mediaStream
    camera.play();
})

videoStop.addEventListener('click',async () => {
    const stream = camera.srcObject
    const tracks = stream.getTracks();

        tracks.forEach((track)=>{
            track.stop()
        })
})

captureBtn.addEventListener('click',async () => {
    const canvas = document.createElement('canvas')
                
    canvas.width = 400
    canvas.height = 400

    canvas.getContext('2d').drawImage(camera,0,0)
    captureImage.src = canvas.toDataURL('image/jpeg',1.0)
    var arr = captureImage.src.split(',')
    var mime = arr[0].match(/:(.*?);/)[1]
    var data = arr[1]

    var dataStr = window.atob(data)
    var n = dataStr.length 
    
    var u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = dataStr.charCodeAt(n)
    }

    var file =new File([u8arr],"tesssst.jpg", {type:mime})

    let payload = new FormData()
    payload.append('file',file)

                

    $.ajax({
        type:'POST',   
        url:'/imaggee',   
        data:{
            file:payload
        },
        processData : false,	
        contentType : false,
        success : function(data){   
            console.log(data);  
        }   
    })
               

            


    /*var blob = new Blob([captureImage.src])
    const blobURL = window.URL.createObjectURL(blob)*/

    /*$.ajax({
        type:'POST',   
        url:'/imaggee',   
        data:{
            imageData: captureImage.src
        },
        success : function(data){   
            console.log(data);  
        }   
    })*/
})


            