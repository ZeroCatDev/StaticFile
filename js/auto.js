
function automsg(msg) {
    if (typeof msg === 'string') {
      msg = { message: msg };
    }
    mdui.snackbar({
      message: msg.message,
      closeable: true,
    });
  }