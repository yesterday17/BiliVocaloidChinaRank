function basicScore(play, p) {
    return play / p;
}

function xiuZhengA(playingScore, collect, danmaku, comment) {
    var ans = (playingScore + collect) / (playingScore + collect + danmaku * 10 + comment * 20);
    return ans.toFixed(2);
}

function xiuZhengB(collect, play) {
    var ans = collect / play * 450;

    if (ans > 50) return 50;
    else return ans.toFixed(2);
}

function playingScore(play, p, collect, type) {
    var bs = basicScore(play, p);
    var ans = 0.0;

    if (bs > 10000) {
        ans = bs * 0.5 + 5000;
    } else {
        ans = bs;
    }

    if (xiuZhengB(collect, play) < 10 && type == 1) {
        ans = ans * xiuZhengB(collect, play) * 0.1;
    }

    return ans;
}

function score(play, p, collect, danmaku, comment) {
    return playingScore(play, p, collect, 1) + (comment * 25 + danmaku) * xiuZhengA(playingScore(play, p, collect, 0), collect, danmaku, comment) + collect * xiuZhengB(collect, play);
}

function getScore(text) {

    try {
        var obj = JSON.parse(text);
        var play = obj.data.out_play + obj.data.in_play;
        var collect = obj.data.fav;
        var comment = obj.data.reply;
        var danmaku = obj.data.dm;
        var p = 1;
        return score(play, p, collect, danmaku, comment);
    } catch (e) {
        alertError();
    }
}

function getScoreById(av) {
    var remoteUrl = "http://api.bilibili.com/x/stat?aid=" + av + "&jsonp=jsonp";

    $.ajax({
        async: false,
        url: remoteUrl,
        dataType: 'jsonp',
        jsonp: 'callback',
        timeout: 5000,
        success: function (json) {
            //alert(json);
            var text = JSON.stringify(json);
            var ans = getScore(text).toFixed(0);
            alertScore(ans);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alertError();
        }
    });
}

function submitAV() {
    var id = document.getElementById("doc-ipt-3").value;
    //alert(id);
    getScoreById(id);
}

function alertScore(score) {
    var $modal = $('#alert-score');
    document.getElementById("score_final").innerText = score;
    $modal.modal();

    document.getElementById("doc-ipt-3").value = "";
}

function alertError() {
    var $modal = $('#alert-error');
    $modal.modal();

    document.getElementById("doc-ipt-3").value = "";
}


/*
    //Input
    cout << "播放数:";
    cin >> play;
    cout << "评论数:";
    cin >> comment;
    cout << "弹幕数:";
    cin >> danmaku;
    cout << "收藏数:";
    cin >> collect;

    cout << "基础得分:" << basicScore(play, p) << endl;
    cout << "修正A:" << xiuZhengA(playingScore2(play, p, collect), collect, danmaku, comment) << endl;
    cout << "修正B:" << xiuZhengB(collect, play) << endl;
    cout << "播放得点:" << playingScore(play, p, collect) << endl;
    cout << "总分:" << score(play, p, collect, danmaku, comment);
*/
