
$(document).ready(function () {
  var mMap = new Map();


  /*初始化图标*/
  chrome.storage.sync.get('user', function (result) {
    // result && setPopDOM(result.user);
    //console.log(result.user);
    if (result.user != null) {
      console.log(result.user);
      mMap = result.user;
      icon_display(mMap);
    }
  });
  //遍历数组在页面显示
  function icon_display(map) {
    $.each(map, function (k, n) {
      var ul = $("#table_item li");
      ul.eq(ul.length - 1).before(
        '<li id="' + k + '"><div class="item"><img src="' + n.path + '" /> </div</li>');
    }); // <a href="'+k.substring(k.indexOf("_")+1)+'">   </a>
  }

  //初始化背景
  //$("body").css("background","url(../source/233.jpg)")




  /*确认按钮事件 */
  function button_confirm() {
    //alert( $(".mark_url").val()+"   "+path_src);
    var url = $(".mark_url").val();
    if (url.length > 0 && path_src.length > 0) {
      $("#table_item li").eq($("#table_item li").length - 1).before(
        '<li><div class="item"><a href="' + url + '"><img src="' + path_src + '" /></a></div</li>');
      //将数据存储
      //mMap[Object.getOwnPropertyNames(mMap).length+"_"+$(".mark_url").val()]=path_src;

      var num = 0;
      $.each(mMap, function (k, n) {
        num = n.num
      });
      mMap["li-position-" + (num + 1)] = { url: $(".mark_url").val(), path: path_src, num: (num + 1) };
      chrome.storage.sync.set({ user: mMap }, function (result) { });

      icon.style.backgroundColor = "#ffffff00";//清除选中的ico的颜色
      path_src = "";//清除url
      $(".mark_url").val("");//清空输入框

    } else {
      alert("图标信息不完整")
    }
  }



  //打开drawer
  $("#button_item").click(function () {
    console.log("点击");
    $("#drawer").animate({ right: '0' });
    $('#drawer_click').show();
  });

  //确认
  $("#close").click(function () {
    console.log("点击");
    button_confirm();
    $('#drawer_click').hide();
    $("#drawer").animate({ right: '-250px' });
  });
  //返回
  $('#drawer_click').click(function () {
    $('#drawer_click').hide();
    $("#drawer").animate({ right: '-250px' });
  });





  var db = null;
  $('#table_item').on('click', 'li', function () {
    //alert(mMap[$(this).attr("id")].url); 
    var item=$('#button_item') ;
    console.log(item.attr("id"));
    if (item!= this) {
      if (db == null) {
        var url = mMap[$(this).attr("id")].url;
        //单击
        db = setTimeout(function () {
          db = null;
          $(window).attr('location', url);
        }, 250);
      } else {
        clearTimeout(db);
        db = null;
        var r = confirm("是否删除该图标");
        if (r) {//确认删除
          delete mMap[$(this).attr("id")];
          chrome.storage.sync.set({ user: mMap }, function (result) { });//保存删除结果
          $(this).remove();
        }
      }
    }

  })

  //chrome.storage.sync.set({user:"哈哈哈"}, function(result) {});
  //chrome.storage.sync.get('user', function(result) {
  // console.log(result.user);
  // });
  //chrome.storage.sync.remove('user', function (result){});

});