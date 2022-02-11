function requestApi(functionName, args, callback, showResults, refreshPageWhenSuccess, disableBtnId) {
    $(disableBtnId).attr("disabled", true);
    setTimeout(function() {
        $(disableBtnId).attr("disabled", false);
    }, 200000)
    $("#isLoading").show(100)
    $.ajax({
        type: 'post',
        url: '/api/' + functionName + '.php',
        data: args,
        dataType: 'json',
        success: function(rdata) {
            if (showResults) {
                mdui.snackbar({
                    message: rdata.msg,
                    position: 'right-top'
                })
            }
            if (refreshPageWhenSuccess & rdata.code == 1) {
                $.pjax.reload({
                    container: "#pjax-container"
                })
            }
            $("#isLoading").hide(100)
            $(disableBtnId).attr("disabled", false)
            if (callback) {
                callback(rdata)
            }
        },
        error: function(data) {
            $("#isLoading").hide(100)
            $(disableBtnId).attr("disabled", false)
            mdui.snackbar({
                message: "请求接口[" + functionName + "]时，出现了一个致命错误！",
                position: 'right-top'
            })
        }
    })
}

function RandomNumBoth(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range);
    return num;
}

function randomImage() {
    var img = event.srcElement;
    img.onerror = null;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        switch (xhr.readyState) {
            case 4:
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                    imgURL = 'https://img.llilii.cn/kagamine/' + JSON.parse(xhr.responseText)['file_name'][RandomNumBoth(0, JSON.parse(xhr.responseText)['file_num'])];
                    img.src = imgURL;
                }
                break;
        }
    }
    xhr.open('get', 'https://static.llilii.cn/json/img_list.json');
    xhr.send(null);
}

function imageVerification(callback) {
    mdui.dialog({
        title: '请输入图片中的验证码',
        content: '<center><div class="mdui-row"> <div class="mdui-col-xs-9"> <div class="mdui-textfield"> <input class="mdui-textfield-input" id="answer" type="text" placeholder="请输入您的答案" /></div> </div> <div class="mdui-col-xs-3"> <img style="position: relative;top:15px" id="vcode" src="/api/vcode.php" /> </div> </div></center>',
        modal: true,
        buttons: [{
                text: '取消'
            },
            {
                text: '确认',
                onClick: function(inst) {
                    callback($('#answer').val());
                }
            }
        ]
    });
}

function search() {
    mdui.prompt('支持从名字、表白内容中搜索', '搜索',
        function(value) {
            setTimeout(function() {
                $.pjax({
                    url: '/?search=' + value,
                    container: '#pjax-container'
                });
            }, 10)
        }
    )
}

function jumpPage() {
    mdui.prompt('你要跳转到第几页？', '快速翻页',
        function(value) {
            setTimeout(function() {
                $.pjax({
                    url: '?p=' + value,
                    container: '#pjax-container'
                });
            }, 10)
        }
    )
}