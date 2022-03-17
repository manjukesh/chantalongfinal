var buffer = 2
var counter = 0
var ifSeek = false
var carryTime = 0
var inLoop = false;
var isPaused = false;
var pauseTrigger = false;
var pauseStartTime = 0;
var isManual = false;
var manTrigger = false;
var timelines;
var shlokas;
var currentShlokaID = 0;
var language=3;
var flag = true;


function fetchSholka(file) {
    language=3;
    buffer = 2
    isPaused = false
    counter = 0
    ifSeek = false
    carryTime = 0
    document.getElementById("oggSource").src = "./clips/" + file + ".mp3"
    document.getElementById("fileName").innerHTML = file
    $.ajax({
        type: 'POST',
        url: '/mantra',
        data: {
            csrfmiddlewaretoken: window.CSRF_TOKEN,
            'name': file
        },
        success: function (responseData) {

            timelines = responseData['timelines']
            shlokas = responseData['shlokas']

            document.getElementById('timelines').innerHTML = JSON.stringify(timelines)
            document.getElementById('shlokas').innerHTML = JSON.stringify(shlokas)

            currentShlokaID = 0;

            if (language%4==3) document.getElementById('replaceText').innerHTML = shlokas[currentShlokaID];
            else document.getElementById('replaceText').innerHTML = shlokas[currentShlokaID][language%4];

        },
        fail: function (data) {
            $("#cover-spin").hide();
        }
    });
}

async function callHeartBeat(data) {
    var state = document.getElementById("stateAsync").value

    //if (state == 'false')
    {
        var index = 0
        var flag = false
        var prev = ""
        timelines = data['timelines']
        shlokas = data['shlokas']

        document.getElementById('timelines').innerHTML = JSON.stringify(timelines)
        document.getElementById('shlokas').innerHTML = JSON.stringify(shlokas)

        timelines = JSON.parse(document.getElementById("timelines").innerHTML);

        var times = [];

        for (var time in timelines) {
            var a = time.split(':');
            var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
            times.push(seconds)
        }
        for (let i = 0; i < times.length; i++) {
            var a = times[i];
            // console.log(a);
            var seconds = a;
            sk = shlokas[i];
            if (flag == true) {
                var b = times[i - 1];
                if (carryTime != 0) {
                    seconds = seconds - carryTime;
                    carryTime = 0;
                }
                if (ifSeek == true) {
                    var y = document.getElementById("oggSource").currentTime;

                    if (seconds > y) {
                        seconds = seconds - y;
                    }
                    else {
                        carryTime = y - seconds;
                        seconds = 0;

                    }
                    ifSeek = false;
                }
                else {
                    seconds = seconds - b;
                }
            }
            flag = true;
            await sleep(seconds * 1000);
            if (isManual) {
                if (manTrigger) {
                    isPaused = true;
                    document.getElementById("oggSource").pause();
                    await sleep(10 * 1000);
                }
                else {
                    manTrigger = true;
                }

            }
            if (isPaused) {
                i = i - 1;
                pauseTrigger = true;
                ifSeek = true;
            }
            else {
                if (counter == 0) {
                    if (inLoop) {
                        i = i - 1;
                        document.getElementById("oggSource").currentTime = times[i];
                    } else {
                        if (language%4==3) document.getElementById('replaceText').innerHTML = sk;
                        else document.getElementById('replaceText').innerHTML = sk[language%4];
                    }
                } else {
                    i = counter;
                    counter = 0;
                }
            }
        }
    }
}

function sleep(ms) {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}

function getCurrentTime() {
    manTrigger = false;
    document.getElementById("oggSource").play();
    ifSeek = true;
    var state = document.getElementById("stateAsync").value;
    var timelines = JSON.parse(document.getElementById("timelines").innerHTML);
    var shlokas = JSON.parse(document.getElementById("shlokas").innerHTML);
    timeInSeconds = document.getElementById("oggSource").currentTime;
    var times = []
    for (var time in timelines) {
        var a = time.split(':');
        var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
        times.push(seconds)
    }
    var diffArr = times.map(x => Math.abs(timeInSeconds - x));
    var minNumber = Math.min(...diffArr);
    currentShlokaID = diffArr.findIndex(x => x === minNumber);
    counter = currentShlokaID;
    if (language%4==3) document.getElementById('replaceText').innerHTML = shlokas[currentShlokaID];
    else document.getElementById('replaceText').innerHTML = shlokas[currentShlokaID][language%4];
}

function goBack() {
    manTrigger = false;
    document.getElementById("oggSource").play();
    var state = document.getElementById("stateAsync").value;
    var timelines = JSON.parse(document.getElementById("timelines").innerHTML);
    var shlokas = JSON.parse(document.getElementById("shlokas").innerHTML);
    var timeInSeconds = document.getElementById("oggSource").currentTime;
    var times = [];
    var prevtime = 0;
    counter = 0;
    for (var time in timelines) {
        times.push(time);
        counter = counter + 1;
        var a = time.split(':');
        var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
        if (seconds > timeInSeconds) {
            if (timeInSeconds - prevtime < 5) {
                counter = counter - 3;
            }
            else {
                counter = counter - 2;
            }
            var ae = times[counter].split(':');
            var secTime = (+ae[0]) * 60 * 60 + (+ae[1]) * 60 + (+ae[2]);
            document.getElementById("oggSource").currentTime = secTime;
            currentShlokaID = counter;
            if (language%4==3) document.getElementById('replaceText').innerHTML = shlokas[counter];
            else document.getElementById('replaceText').innerHTML = shlokas[counter][language%4];
            document.getElementById("stateAsync").value = false;
            break;
        }
        prevtime = seconds;
    }
}

function goForward() {
    manTrigger = false;
    document.getElementById("oggSource").play();
    var state = document.getElementById("stateAsync").value;
    var timelines = JSON.parse(document.getElementById("timelines").innerHTML);
    var shlokas = JSON.parse(document.getElementById("shlokas").innerHTML);
    var timeInSeconds = document.getElementById("oggSource").currentTime;
    var times = []
    counter = 0;
    for (var time in timelines) {
        counter = counter + 1;
        var a = time.split(':');
        var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
        if (seconds > timeInSeconds) {
            document.getElementById("oggSource").currentTime = seconds;
            timeInSeconds = seconds;
            break;
        }
    }
    counter = counter - 1;
    if (language%4==3) document.getElementById('replaceText').innerHTML = shlokas[counter];
    else document.getElementById('replaceText').innerHTML = shlokas[counter][language%4];
    currentShlokaID = counter;
    document.getElementById("stateAsync").value = false
}

function functionPause() {
    pauseStartTime = Date.now();
    isPaused = true;
}
function functionPlay() {
    keeploop = false;
    isPaused = false;
}

function inLoopfunc() {
    inLoop = !inLoop;
    if (inLoop) {
        document.getElementById("loop").style.background = 'red';
        document.getElementById("loop").innerText = 'Stop Loop';
    }
    else {
        document.getElementById("loop").style.background = 'rgba(26,26,26,.8)';
        document.getElementById("loop").innerText = 'Loop';
    }
}

function Manual() {
    manTrigger = true;
    isManual = !isManual;
    if (isManual) {
        document.getElementById("Manual").style.background = 'red';
        document.getElementById("Manual").innerText = 'Auto Play';
    }
    else {
        document.getElementById("Manual").style.background = 'rgba(26,26,26,.8)';
        document.getElementById("Manual").innerText = 'Manual';
    }
}

function selectlanguage() {
    language++;
    if (language%4==3) document.getElementById('replaceText').innerHTML = shlokas[currentShlokaID-1];
    else document.getElementById('replaceText').innerHTML = shlokas[currentShlokaID-1][language%4];

    if (language%4==0) {
        document.getElementById("Language").innerText = 'Only Sanskrit';
    }
    else if(language%4==1) {
        document.getElementById("Language").innerText = 'Only Meaning';
    }
    else if(language%4==2){
        document.getElementById("Language").innerText = 'All';
    }
    else if(language%4==3){
        document.getElementById("Language").innerText = 'Only Eng';
    }
}