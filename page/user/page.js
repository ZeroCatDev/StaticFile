function getQueryString(name) {
  const url_string = window.location.href;
  const url = new URL(url_string);
  return url.searchParams.get(name);
}
function FormatTime(t, date) {
  var date = new Date(date);
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(t)) {
    t = t.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(t)) {
      t = t.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return t;
}
var scratch_count = 0;
var python_count = 0;
function loaduserinfo(load) {

    AjaxGet("/api/getuserinfo", {id:getQueryString("id")}, function (data) {
      console.log(data.info);
      $("#mainuserdisplay_name").html(DOMPurify.sanitize(data.info.display_name));

      $("#usermotto").html(DOMPurify.sanitize(marked.parse(data.info.motto)));
      $("#mainuserimages").attr(
        "src",
        S3staticurl + "/user/" + data.info.images
      );
      $("#regTime").html(FormatTime("yyyy-MM-dd", data.info.regTime) + "注册");
      $("#tag").html(data.info.tag);
      scratch_count = data.info.scratch_count,
      python_count = data.info.python_count
      load()
        });


}

$(function () {
  loaduserinfo(function () {
    Scratch();
    Python();

  }
  );});
var laypage = layui.laypage,
  layer = layui.layer;

function Scratch() {
  laypage.render({
    elem: "scratch_change_page",
    count: scratch_count,
    limit: 16,
    theme: "#448aff",
    layout: ["count", "prev", "page", "next", "limit", "refresh", "skip"],
    limits: [8, 16, 32],
    jump: function (obj, first) {
      AjaxFn("/api/getUserScratchProjects",{
        curr: obj.curr,
        limit: obj.limit,
        userid: getQueryString("id"),
      },function (d) {
        if (d.length) {
          $("#scratch_projects").html("");
          for (var i = 0; i < d.length; i++) {
            tzzt = "";
            if (d[i].state == 2) {
              tzzt = '<mdui-icon name="star"></mdui-icon>';
            }
            $("#scratch_projects").append(`
                <div class="mdui-col-md-3 mdui-col-sm-6 mdui-col-xs-12" style="margin:5px 0px 5px 0px;">
<mdui-card variant="outlined" clickable ondragstart="return false" style="user-select:none;width: 100%;overflow: hidden" href="/scratch/play?id=${d[i].id}">

    <img src="${S3staticurl}/scratch_slt/${d[i].id}"
      style="pointer-events: none;width: 100%;" />
    <div class="card-media-covered">
        <div class="card-media-covered-text">${tzzt}${d[i].title}</div>
    </div>
</mdui-card>
</div>
            `);
          }
        } else {
          $("#scratch_projects").html(
            `<p class="mdui-text-center">没有找到Scratch作品</p>`
          );
          automsg({ buttonText: "关闭", message: "无满足条件的作品" });
        }
      })

    },
  });
}
function Python() {
  laypage.render({
    elem: "python_change_page",
    count: python_count,
    limit: 16,
    theme: "#448aff",
    layout: ["count", "prev", "page", "next", "limit", "refresh", "skip"],
    limits: [8, 16, 32],
    jump: function (obj, first) {
      AjaxFn("/api/getUserPythonProjects", {
        curr: obj.curr,
        limit: obj.limit,
        userid: getQueryString("id"),
      },function(d){ if (d.length) {
        $("#python_projects").html("");
        for (var i = 0; i < d.length; i++) {
          tzzt = "";
          if (d[i].state == 2) {
            tzzt = '<mdui-icon name="star"></mdui-icon>';
          }
          $("#python_projects")
            .append(`<div class="mdui-col-md-3 mdui-col-sm-6 mdui-col-xs-12" style="margin:5px 0px 5px 0px;">
        <mdui-card variant="outlined" href='/python/play?id=${d[i].id}' clickable ondragstart="return false" style="user-select:none;width: 100%;overflow: hidden">
          <div class="card-main">
              <div class="substr card-main-text" >${tzzt}${d[i].title}</div>
              <div class="substr card-main-subtitle">${d[i].description}</div>
            </div>
        </mdui-card>
        </div>
          `);
        }
      } else {
        $("#python_projects").html(
          `<p class="mdui-text-center">没有找到Python作品</p>`
        );

        automsg({ buttonText: "关闭", message: "无满足条件的作品" });
      }})

    },
  });
}


function getQueryString(name) {
  const queryString = window.location.search.slice(1);
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  const r = queryString.match(reg);
  return r ? decodeURIComponent(r[2]) : null;
}
