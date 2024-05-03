
function onloadCallback() {
grecaptcha.render("#recaptcha-div-login-page", {
    sitekey: rekey,
  });
 
}

//找回密码
function getPW() {
  var un = $("#getPW_email").val();
  if (!emailTest(un)) {
    $("#getPW_email").focus();
    automsg({ buttonText: "关闭", message: "邮箱格式不正确" });
    return;
  }
  var re = grecaptcha.getResponse();
  AjaxFn("/user/repw", { un: un, re: re }, function (res) {
    if ("OK" == res.status) {
      window.location.reload();
    } else {
      automsg(res.status);
    }
  });
  automsg({ buttonText: "关闭", message: "请查看邮箱" });
}

//注册界面，点击注册按钮
function register() {
  if (!document.getElementById("privacy-chick").checked) {
    automsg({
      buttonText: "关闭",
      message: "请阅读并选择是否同意隐私策略",
    });
    return;
  }
  if (!document.getElementById("shuju-chick").checked) {
    automsg({
      buttonText: "关闭",
      message: "请阅读并选择是否同意数据跨境传输策略",
    });
    return;
  }
  if (!document.getElementById("xiugai-chick").checked) {
    automsg({
      buttonText: "关闭",
      message: "请阅读并选择是否同意修改免责条款",
    });
    return;
  }
  if (!document.getElementById("zhunze-chick").checked) {
    automsg({
      buttonText: "关闭",
      message: "请阅读并选择是否同意社区行为准则",
    });
    return;
  }
  var un = $("#reg_email").val();
  if (!emailTest(un)) {
    $("#reg_email").focus();
    automsg({ buttonText: "关闭", message: "账号格式：字母+数字" });
    return;
  }
  //if (phoneTest(un)) {$("#reg_email").focus();automsg({buttonText: '关闭', message: '手机号不能直接用于注册账号'});return;}

  var pw = $("#reg_password").val();
  //if (!userpasswordTest(pw)) {$("#reg_password").focus();automsg({buttonText: '关闭', message: '密码格式:6~16长度,数字+字母+!@#$%^&*'});return;}

  var re = grecaptcha.getResponse();
  AjaxFn("/user/register", { un: un, pw: pw, re: re }, function (res) {
    if ("OK" == res.status) {
      window.location.reload();
    } else {
      automsg(res.status);
    }
  });
}

//登录界面，点击登录按钮
function login() {
  var un = $("#email").val();
  if (!emailTest(un)) {
    $("#email").focus();
    automsg({
      message: "请填写正确的账号：字母+数字",
      type: "error",
      showCloseButton: true,
    });
    return;
  }

  var pw = $("#password").val();
  //if (!userpasswordTest(pw)) { $("#password").focus(); automsg({ buttonText: "关闭", message: "密码不正确" }); return; }
  var re = grecaptcha.getResponse();
  AjaxFn("http://localhost:3000/user/login", { un: un, pw: pw, re: re }, function (res) {
    if ("OK" == res.status) {
      console.log(res['token'])
      Cookies.set('token',res['token'])
  window.location.reload();
    } else {
      automsg(res.status);
    }
  });
}
function getQueryString(name) {
  const url_string = window.location.href;
  const url = new URL(url_string);
  return url.searchParams.get(name);
}
//登录界面，点击登录按钮
function torepw() {
  var token = getQueryString("token");

  var pw = $("#password").val();
  if (!userpasswordTest(pw)) {
    $("#password").focus();
    automsg({ buttonText: "关闭", message: "密码格式不正确" });
    return;
  }
  var re = grecaptcha.getResponse();
  AjaxFn("/user/torepw", { token: token, pw: pw, re: re }, function (res) {
    if ("OK" == res.status) {
      window.location.reload();
    } else {
      automsg(res.status);
    }
  });
}
function switchPage(goPage) {
  $(`#${goPage}`).show().siblings().hide();
  grecaptcha.render(`#recaptcha-div-${goPage}`, {
    sitekey: rekey,
  });
}