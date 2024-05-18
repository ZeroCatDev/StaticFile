const dialog = document.querySelector(".choose_user");
const openButton = dialog.nextElementSibling;
const closeButton = dialog.querySelector(".choose_user_cancel");

openButton.addEventListener("click", () => (dialog.open = true));
closeButton.addEventListener("click", () => (dialog.open = false));
var laypage = layui.laypage,
  layer = layui.layer;
var scratch_type = "new";
var scratch_count = 0;

//function getscratchcount(load) { AjaxGet("/scratch/scratchcount", {}, function (data) { scratch_count = data.scratch_count; console.log("成功获取作品数量"); console.log(data.scratch_count); load() }); }

$("#search_txt").keydown(function (e) {
  if (e.keyCode == 13) {
    Scratch_Search();
  }
});
function Scratch_Search(curr) {
  var search_txt = $("#search_txt").val() || "";
  //if (search_txt == "") {$("#search_txt").focus();return;}
  console.log("搜索内容：" + search_txt);

  console.log("搜索用户ID：" + search_userid);

  search_type = $("#search_type").val() || "";
  search_title = $("#search_title").val() || "";
  search_src = $("#search_src").val() || "";

  search_description = $("#search_description").val() || "";
  var search_orderby = $("#search_orderby").val() || "view_dowm";

  console.log("搜索范围：" + search_type);
  curr = curr || 1
  AjaxGet(
    "/searchapi",
    {
      search_userid: search_userid,
      search_type: search_type,
      search_title: search_title,
      search_src: search_src,
      search_description: search_description,
      search_orderby: search_orderby,
      curr: curr,
      limit:  8
    },
    function (d) {
        var data = d.data
        var totalCount = d.totalCount


        console.log(d)
      if (data.length) {
        $("#scratch_projects").html("");

        for (var i = 0; i < data.length; i++) {
          console.log(data[i]);
          $("#scratch_projects").append(projecthtml(search_type, data[i]));
        }
        search_page(totalCount[0].totalCount)
        document.getElementById("scratch_type").classList.add("mdui-hidden");
        document.getElementById(
          "scratch_change_page"
        ).innerHTML = `<mdui-button onclick="Scratch(scratch_type)">取消搜索</mdui-button>`;
   
      } else {
        automsg({ buttonText: "关闭", message: "无满足条件的作品" });
      }
    }
  );

}
function projecthtml(type, d) {
  tzzt = "";
  if (type == "scratch") {
    if (d.state == 2) {
      tzzt = '<i class="mdui-icon material-icons">stars</i>';
    }
    return `
                <div class="mdui-col-md-3 mdui-col-sm-6 mdui-col-xs-12" style="margin:5px 0px 5px 0px;">
  <mdui-card variant="outlined" clickable ondragstart="return false" style="user-select:none;width: 100%;overflow: hidden">
  <mdui-card clickable href="/scratch/play?id=${d.id}">
    <img src="${S3staticurl}/scratch_slt/${d.id}"
        style="pointer-events: none;width: 100%;" />
    <div class="card-media-covered">
            <div class="card-media-covered-text">${tzzt}${d.title}</div>
    </div>
  </mdui-card>
  <div href='/user?id=${d.authorid}' style="padding: 16px;">
    <img class="card-avatar" src="/api/usertx?id=${d.authorid}" />
    <div class="card-user card-user-name">${d.display_name}</div>
    <div class="card-user card-user-motto">${d.view_count}浏览</div>
  </div>
  </mdui-card>
  </div>`;
  }
  if (type == "python") {
    return `
                <div class="mdui-col-md-3 mdui-col-sm-6 mdui-col-xs-12" style="margin:5px 0px 5px 0px;">
			<mdui-card variant="outlined" href='/python/play?id=${d.id}' clickable ondragstart="return false" style="user-select:none;width: 100%;overflow: hidden">
				<div class="card-main">
						<div class="substr card-main-text" >${tzzt}${d.title}</div>
						<div class="substr card-main-subtitle">${d.description}</div>
					</div>
				<div style="padding: 16px;">
					<img class="card-avatar" src="/api/usertx?id=${d.authorid}" />
					<div class="card-user card-user-name">${d.display_name}</div>
					<div class="card-user card-user-motto">${d.view_count}浏览</div>
				</div>
			</mdui-card>
			</div>`;
  }
}
var userlist = {};
function choose_search() {
  cancel_choose_search();
  AjaxFn(
    "/searchapi/user",
    { txt: $("#choose_user_search").val() },
    function (d) {
      if (d.length) {
        $("#choose_user_box").html("<mdui-list>");
        userlist = d;
        console.log(d);

        for (var i = 0; i < d.length; i++) {
          $("#choose_user_box").append(`
      
    
              <mdui-list-item rounded onclick="choose_user_set(${d[i].id})" class='choose_item' id='choose_item_${d[i].id}'>${userlist[i].display_name}    <mdui-avatar slot="icon" src="${S3staticurl}/user/${userlist[i].images}">   
</mdui-avatar> <span slot="description">${userlist[i].motto}</span>
</mdui-list-item>

    
    
    
    
    
    `);
        }
      }
      $("#choose_user_box").append(`</mdui-list>`);
    }
  );
}
var search_userid = "";
var useritem={}
function choose_user_set(id) {
  search_userid = id;
  console.log(search_userid);
  $(".choose_item").removeAttr("active");
  $("#choose_item_" + id).attr("active", "");
  useritem = userlist.find((item) => item.id === id);
  $("#open_choose_user").html(`
    
    <mdui-list-item rounded  active>${useritem.display_name}    <mdui-avatar slot="icon" src="${S3staticurl}/user/${useritem.images}">   
</mdui-avatar> <span slot="description">${useritem.motto}</span>
</mdui-list-item>`);
}
function cancel_choose_search() {
  search_userid = "";
  useritem={}
  $(".choose_item").removeAttr("active");
  $("#open_choose_user").html(
    '   <mdui-list-item rounded>选择用户  <mdui-avatar slot="icon" >   </mdui-avatar> <span slot="description">点击选择在用户中搜索</span></mdui-list-item>'
  );
}
function update_explain(){
    $("#search_explain").html(
        `将会搜索 属于${useritem.display_name || '所有人'} 的，作品名包含 ${$("#search_title").val() || "任何内容"}，作品内容包含 ${$("#search_src").val() || "任何内容"}，作品简介包含 ${  search_description = $("#search_description").val() || "任何内容"} 的 ${$("#search_type").val()} 作品，并根据${$("#search_orderby").val() || "view_dowm"}排序`
      );

}
function search_page(num) {
    $('#search_change_page').html(``);

    page = Math.ceil(num/8)
    console.log(page)
    for (var i = 0; i < page; i++) {
    $('#search_change_page').append(`<mdui-button onclick="search_to_page(${i+1})">${i+1}</mdui-button>`);}
}
function search_to_page(num){
    Scratch_Search(num)

}