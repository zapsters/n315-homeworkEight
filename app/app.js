function changeRoute(e) {
  let hashTag = window.location.hash;
  let pageID = hashTag.replace(`#`, ``);

  if (pageID == ``) {
    pageID = `home`;
  }
  $.get(`pages/${pageID}.html`, function (data) {
    console.log(`data ` + data);
    $(`#app`).html(data);
  })
    .done(function () {})
    .fail(function (error) {
      $.get(`pages/404.html`, function (data) {
        $(`#app`).html(
          `<!DOCTYPE html><style>.error{font-family:monospace;margin-top:200px;padding:0 50px}.error .box{margin:0 auto;background-color:rgba(128,128,128,.356);width:fit-content;padding:30px 30px;width:100%;max-width:500px}.error .box span{font-family:sans-serif;font-size:15px}.error .box span{font-size:15px}</style><div class='error'><div class='box'><h1>Error</h1><p id='errorDetails'></p><p id='errorCode'></p></div></div>`
        );
      }).done(function () {
        $(`#errorDetails`).html(`The page you are looking for '${pageID}' can not be found.`);
        $(`#errorCode`).html(`${error.status}: ${error.statusText}`);
      });
    })
    .always(function () {
      $(`a`).each(function () {
        let aHref = $(this).attr(`href`).replace(`#`, ``);
        if (aHref == pageID) {
          $(this).addClass(`active`);
        } else {
          $(this).removeClass(`active`);
        }
      });
    });
}

function initURLListener() {
  $(window).on(`hashchange`, changeRoute);
  changeRoute();
}

$(document).ready(function () {
  initURLListener();
});
