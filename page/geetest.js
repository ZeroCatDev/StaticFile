var captchaId = captchaid   // gt_id
var product = "float"

class Grecaptcha {
    getResponse() {
      return JSON.stringify(gt.getValidate());
    }
    reset() {
      gt.reset();
    }
   }

const grecaptcha = new Grecaptcha();
initGeetest4({
    captchaId: captchaId,
    product: product,
}, function (gt) {
    window.gt = gt
    gt
        .appendTo("#captcha-div")
        .onSuccess(function (e) {
            console.log('geetest加载成功')
            console.log(e)
        })
        .onError(function (e) {
            console.log('geetest加载失败')
            console.log(e)
        })

});