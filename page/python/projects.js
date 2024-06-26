var laypage = layui.laypage, layer = layui.layer;

var python_count = 0

 function getpythoncount(load) {
	AjaxGet("/python/pythoncount", {}, function (data) {

	python_count = data.python_count;
    console.log("成功获取作品数量");
  console.log(data.python_count);
    load()
		  });

}

$(function () {
  getpythoncount(function(){
    Python("new");
  })
});

	var python_type = 'new';
	function Python(thetype) {
		laypage.render({
			elem: 'python_change_page'
			, count: python_count
	, limit: 16
			, theme: '#448aff'
			,     layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
			,     limits: [8, 16, 32]

			, jump: function (obj, first) {
				AjaxGet('/python/view/getPythonProjects',{ curr: obj.curr, limit: obj.limit, type: thetype },function(d){
				    if (d.length) {
						$("#python_projects").html("");
						for (var i = 0; i < d.length; i++) {
							tzzt=''

							if (d[i].state == 2) {

								tzzt = '<i class="mdui-icon material-icons">stars</i>'
							}
							if (d[i].description == "") {

								d[i].description = '暂无简介'
}
							$("#python_projects").append(`

			<div class="mdui-col-md-3 mdui-col-sm-6 mdui-col-xs-12" style="margin:5px 0px 5px 0px;">
				<mdui-card variant="outlined" href='/python/play?id=${d[i].id}' clickable ondragstart="return false" style="user-select:none;width: 100%;overflow: hidden">
					<div class="card-main">
							<div class="substr card-main-text" >${tzzt}${d[i].title}</div>
							<div class="substr card-main-subtitle">${d[i].description}</div>
						</div>
					<div style="padding: 16px;">
						<img class="card-avatar" src="/api/usertx?id=${d[i].authorid}" />
						<div class="card-user card-user-name">${d[i].display_name}</div>
						<div class="card-user card-user-motto">${d[i].view_count}浏览</div>
					</div>
				</mdui-card>
				</div>







					`);
						} document.getElementById("python_type").classList.remove('mdui-hidden');
					} else {
						automsg({ buttonText: '关闭', message: "无满足条件的作品" });
					}
				}
				);
			}
	});
	}
	$('#python_search_txt').keydown(function (e) {
		if (e.keyCode == 13) { Python_Search(); }
	});
	function Python_Search() {
		var txt = $("#python_search_txt").val();
		if (txt == '') { $("#python_search_txt").focus(); return }
		AjaxGet('/python/view/seachPythonProjects',{ t: 'p', txt: txt, searchall: document.getElementById("python_src").checked },function(d){if (d.length) {
			$("#python_projects").html("");

			for (var i = 0; i < d.length; i++) {
				tzzt=''
				if (d[i].state == 2) {

					tzzt = '<i class="mdui-icon material-icons">stars</i>'
				}
				if (d[i].description == "") {

d[i].description = '暂无简介'
}
				$("#python_projects").append(`
				<div class="mdui-col-md-3 mdui-col-sm-6 mdui-col-xs-12" style="margin:5px 0px 5px 0px;">
			<mdui-card variant="outlined" href='/python/play?id=${d[i].id}' clickable ondragstart="return false" style="user-select:none;width: 100%;overflow: hidden">
				<div class="card-main">
						<div class="substr card-main-text" >${tzzt}${d[i].title}</div>
						<div class="substr card-main-subtitle">${d[i].description}</div>
					</div>
				<div style="padding: 16px;">
					<img class="card-avatar" src="/api/usertx?id=${d[i].authorid}" />
					<div class="card-user card-user-name">${d[i].display_name}</div>
					<div class="card-user card-user-motto">${d[i].view_count}浏览</div>
				</div>
			</mdui-card>
			</div>

				`);
			} document.getElementById("python_type").classList.add('mdui-hidden');
			document.getElementById("python_change_page").innerHTML = '<mdui-button onclick="Python(python_type)">取消搜索</mdui-button>';
		} else {
			automsg({ buttonText: '关闭', message: "无满足条件的作品" });
		}})

	}