var laypage = layui.laypage, layer = layui.layer;
var scratch_type = 'new';

function Scratch(thetype) {
    laypage.render({
        elem: 'scratch_change_page'
        , count: scratch_count
        , limit: 8
        , theme: '#448aff'
        ,     layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
        ,     limits: [8, 16, 32]
        , jump: function (obj, first) {
            $.ajax({
                'url': '/scratch/view/getScratchProjects',
                'type': 'POST',
                'data': { curr: obj.curr, limit: obj.limit, type: thetype },
                'success': function (d) {
                    if (d.length) {
                        $("#scratch_projects").html("");
                        for (var i = 0; i < d.length; i++) {
                            tzzt = ''
                            if (d[i].state == 2) {

                                tzzt = '<i class="mdui-icon material-icons">stars</i>'
                            }
                            $("#scratch_projects").append(`
<div class="mdui-col-md-3 mdui-col-sm-6 mdui-col-xs-12" style="margin:5px 0px 5px 0px;">
<mdui-card variant="outlined" clickable ondragstart="return false" style="user-select:none;width: 100%;overflow: hidden">
<mdui-card clickable href="/scratch/play?id=${d[i].id}">
    <img src="${S3staticurl}/scratch_slt/${d[i].id}"
        style="pointer-events: none;width: 100%;" />
    <div class="card-media-covered">
            <div class="card-media-covered-text">${tzzt}${d[i].title}</div>
    </div>
</mdui-card>
<div href='/user?id=${d[i].authorid}' style="padding: 16px;">
    <img class="card-avatar" src="/api/usertx?id=${d[i].authorid}" />
    <div class="card-user card-user-name">${d[i].nickname}</div>
    <div class="card-user card-user-motto">${d[i].view_count}浏览</div>
</div>
</mdui-card>
</div>`);
                        } document.getElementById("scratch_type").classList.remove('mdui-hidden');
                    } else {
                        automsg({ buttonText: '关闭', message: "无满足条件的作品" });
                    }
                }
            });
        }
});
}

Scratch('new')

$('#scratch_search_txt').keydown(function (e) {
    if (e.keyCode == 13) { Scratch_Search(); }
});
function Scratch_Search() {
    var txt = $("#scratch_search_txt").val();
    if (txt == '') { $("#scratch_search_txt").focus(); return }

    $.ajax({
        'url': '/scratch/view/seachScratchProjects',
        'type': 'POST',
        'data': { t: 's', txt: txt, searchall: document.getElementById("search_src").checked },
        'success': function (d) {
            if (d.length) {
                $("#scratch_projects").html("");

                for (var i = 0; i < d.length; i++) {
                    tzzt = ''
                    if (d[i].state == 2) {

                        tzzt = '<i class="mdui-icon material-icons">stars</i>'
                    }
                    $("#scratch_projects").append(`
                    <div class="mdui-col-md-3 mdui-col-sm-6 mdui-col-xs-12" style="margin:5px 0px 5px 0px;">
<mdui-card variant="outlined" clickable ondragstart="return false" style="user-select:none;width: 100%;overflow: hidden">
<mdui-card clickable href="/scratch/play?id=${d[i].id}">
    <img src="${S3staticurl}/scratch_slt/${d[i].id}"
        style="pointer-events: none;width: 100%;" />
    <div class="card-media-covered">
            <div class="card-media-covered-text">${tzzt}${d[i].title}</div>
    </div>
</mdui-card>
<div href='/user?id=${d[i].authorid}' style="padding: 16px;">
    <img class="card-avatar" src="/api/usertx?id=${d[i].authorid}" />
    <div class="card-user card-user-name">${d[i].nickname}</div>
    <div class="card-user card-user-motto">${d[i].view_count}浏览</div>
</div>
</mdui-card>
</div>`);
                } document.getElementById("scratch_type").classList.add('mdui-hidden');
                document.getElementById("scratch_change_page").innerHTML = `<mdui-button onclick="Scratch(scratch_type)">取消搜索</mdui-button>`;
            } else {
                automsg({ buttonText: '关闭', message: "无满足条件的作品" });
            }
        }
    });
}

