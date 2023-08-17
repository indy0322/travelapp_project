const userEmail = document.getElementById('register-id')
const cnButton = document.getElementById('cn-button')
const userCN = document.getElementById('userCN')

window.onload = function () {
    const parameter = new URLSearchParams(location.search)
    if(parameter.get('error')){
        const err = parameter.get('error')
        alert(err)
        history.replaceState({}, null, location.pathname);
    }
  
  }

var randNum

function checkUserCN(){
    if(randNum != userCN.value){
        /*console.log("randNum: ",randNum)
        console.log("userCN: ",userCN.value)
        console.log("틀림")*/
        return false
    }
    else{
        /*console.log("randNum: ",randNum)
        console.log("userCN: ",userCN.value)
        console.log("맞음")*/
        return true
    }
}

cnButton.addEventListener('click',() => {

    $('.cn-container').css('display','block')

    var randomNum = Math.floor(Math.random() * 9999 + 1);
    randNum = randomNum
    /*console.log(randomNum)
    console.log(userEmail.value)*/

    $.ajax({
        type:'POST',   
        url:'/cn',   
        data:{
            userEmail: userEmail.value,
            randomNum: randomNum
        },   
        success : function(data){   
            console.log(data)
        }
    })
})




