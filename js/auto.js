
function automsg(msg) {
    if (typeof msg === 'string') {
      msg = { message: msg };
    }
    mdui.snackbar(msg);
  }