const form=document.querySelector(".sub form");
btn=form.querySelector(".but input");
let id;
form.onsubmit=(e)=>{
    e.preventDefault();
}
window.addEventListener('load',(event)=>{
    var peer=new Peer()
    var myStream;
    var peerList=[];
    peer.on('open',function(id){
        document.getElementById("show").innerHTML=id;
       // document.getElementById(" .sub form .inp").innerHTML=id;
        btn.onclick=()=>{
            let xhr=new XMLHttpRequest();
            xhr.open("POST","client.php",true);
            xhr.onload=()=>{
                if(xhr.readyState==XMLHttpRequest.DONE){
                    if(xhr.status==200){
                        let data=xhr.response;
                        console.log(data);
                    }
                }
            }
            let formData=new FormData(form);
            xhr.send(formData);
         }
    })
    peer.on('call',function(call){
    navigator.mediaDevices.getUserMedia({
        video:true,
        audio:true
    }).then((stream)=>{
        myStream=stream
        addOurVideo(stream)
        call.answer(stream)
        call.on('stream',function(remoteStream){
            if(!peerList.includes(call.peer)){
                addRemoteVideo(remoteStream)
                peerList.push(call.peer);
            }
        })
    }).catch((err)=>{
        console.log(err+" can not connect.")
    })
})



document.getElementById("call-peer").addEventListener('click',(e)=>{
   let remoteId=document.getElementById("peerId").value;
    document.getElementById("show").innerHTML="connecting to "+remoteId;
    callPeer(remoteId);
})
function callPeer(id){
    navigator.mediaDevices.getUserMedia({
        video:true,
        audio:true
    }).then((stream)=>{
        myStream=stream
        addOurVideo(stream)
        let call=peer.call(id,stream)
        call.on('stream',function(remoteStream){
            if(!peerList.includes(call.peer)){
                addRemoteVideo(remoteStream);
                peerList.push(call.peer)
            }
        })
    }).catch((err)=>{
        console.log(err+" can not connect.")
    })
}

function addRemoteVideo(stream){
    let video=document.createElement("video");
    video.classList.add("video2");
    video.srcObject=stream;
    video.play()
    document.getElementById("remote").append(video)
}

function addOurVideo(stream){
    let video=document.createElement("video");
    video.classList.add("video1");
    video.srcObject=stream;
    video.play();
    document.getElementById("our").append(video)
}
})