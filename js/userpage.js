
function getQueryString(name) {
    const url_string = window.location.href
    const url = new URL(url_string);
    return url.searchParams.get(name);
  }
  function FormatTime(t,date){
    var date=new Date(date);
    var o = {   
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "h+" : date.getHours(),                   //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S"  : date.getMilliseconds()             //毫秒
    };   
    if(/(y+)/.test(t)){
        t=t.replace(RegExp.$1,(date.getFullYear()+"").substr(4-RegExp.$1.length)); 
    };    
    for(var k in o){
        if(new RegExp("("+ k +")").test(t)){
            t=t.replace(RegExp.$1,(RegExp.$1.length==1)?(o[k]):(("00"+ o[k]).substr((""+o[k]).length))); 
        }; 
    }
    return t; 
};

function loaduserinfo() {
    AjaxGet("/api/getuserinfo?id="+getQueryString('id'), {}, function (data) {
        console.log(data.info);
        $("#mainuserdisplay_name").html(DOMPurify.sanitize(data.info.display_name));

        $("#usermotto").html(DOMPurify.sanitize(marked.parse(data.info.motto)));
        $("#mainuserimages").attr('src',S3staticurl+'/user/'+data.info.images+'.png');
        $("#regTime").html(FormatTime('yyyy-MM-dd',data.info.regTime)+'注册');
        $("#tag").html(data.info.tag);

      });
   
    }
    window.onload = loaduserinfo;

    