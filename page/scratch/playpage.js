_pid = getQueryString('id');

socialShare(".social-share", $config);
function projectanalysis() {
  var chartDom = document.getElementById("main1");
  var myChart = echarts.init(chartDom);
  var option;
  var h = {
    context: getHead(JSON.parse(projectjson)),
    info: "<%= project.author_display_name %> 的作品 <%= project.title %> 的分析",
    infotext: getStats(JSON.parse(projectjson)),
  };
  console.log(h);
  var opcodes = {
    looks: "外观",
    control: "控制",
    motion: "移动",
    sound: "声音",
    event: "事件",
    sensing: "侦测",
    operator: "运算",
    procedures: "自定义",
    argument: "参数",
    data: "数据",
    pen: "画笔",
    other: "其它",
  };
  const data = genData(50);
  option = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
      type: "scroll",
      orient: "vertical",
      right: 10,
      top: 10,
      bottom: 10,
      data: data.legendData,
    },
    series: [
      {
        name: "类别",
        type: "pie",
        radius: "55%",
        center: ["40%", "50%"],
        data: data.seriesData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  function genData(count) {
    // prettier-ignore
    const legendData = [];
    const seriesData = [];
    let o = Object.keys(h.context),
      s = 0;
    for (var i = 0; i < o.length; i++) {
      s += h.context[o[i]];
    }
    for (var i = 0; i < o.length; i++) {
      var name = opcodes[o[i]] || o[i];
      legendData.push(name);
      seriesData.push({
        name: name + "  " + ((h.context[o[i]] / s) * 100).toFixed(1) + "%",
        value: h.context[o[i]],
      });
    }
    var infotext = h.infotext;
    console.log(infotext);
    document.getElementById("r").innerHTML =
      // "不含圆形积木数:"+h.noreturn+"<br>"+
      "<mdui-chip>变量数:" +
      infotext.variables +
      "个</mdui-chip>" +
      "<mdui-chip>列表数:" +
      infotext.lists +
      "个</mdui-chip>" +
      "<mdui-chip>广播数:" +
      infotext.broadcasts +
      "个</mdui-chip>" +
      "<mdui-chip>总块数:" +
      infotext.blocks +
      "块</mdui-chip>" +
      "<mdui-chip>插件数:" +
      infotext.extensions +
      "个</mdui-chip>";
    return {
      legendData: legendData,
      seriesData: seriesData,
      total: s,
    };
  }

  option && myChart.setOption(option);
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
function getQueryString(name) {
  const url_string = window.location.href;
  const url = new URL(url_string);
  return url.searchParams.get(name);
}
function getprojectinfo() {
  _pid = getQueryString('id');
  AjaxGet("http://localhost:3000/scratch/projectinfo?id="+ getQueryString("id"), {}, function (result) {
	
  document.querySelector("#authorinfo").headline =
        result.author_display_name;
      document.querySelector("#authorinfo").description = result.author_motto;
      document.querySelector("#authorinfo").href = "/user?id=" + result.id;
      document.querySelector("#editlink").href = "/scratch/edit.html#" + result.id;

      document.querySelector("#authoravatar").src =
        S3staticurl + "/user/" + result.author_images + ".png";
      document.querySelector("#projecttitle").innerText = result.title;
      document.querySelector("#projectdescription").innerText =
        result.description;
      document.querySelector("#projecttime").innerText = `最后更新:${FormatTime(
        "yyyy-MM-dd hh:mm:ss",
        result.time
      )}`;
      document.querySelector("#projectview").innerText =
        result.view_count + "浏览";
      if (result.state == "0") {
        document
          .querySelector("#projectstate")
          .setAttribute("icon", "lock_person");
        document.querySelector("#projectstate").innerText = "未分享";
      } else if (result.state == "1") {
        document.querySelector("#projectstate").setAttribute("icon", "share");
        document.querySelector("#projectstate").innerText = "公开作品";
      } else if (result.state == "2") {
        document.querySelector("#projectstate").setAttribute("icon", "star");
        document.querySelector("#projectstate").innerText = "优秀作品";
      }
      like_count = result.like_count
      favo_count = result.favo_count
      console.log("成功获取作品信息");
      console.log(result);
     });

 
}
$(function () {
  getprojectinfo();
});
