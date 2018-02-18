
var index = 0;
var last_kw = '';
var now_kw='';
var max_sug_len = 1; //搜索建议最短触发长度
var path_src='';//选择图片的路径
var icon=null;//用于记录上一个选中的icon
var removeColor="#ffffff00";
var addColor="#5a56567a";
/*获取搜索建议
采用的百度搜索的服务
*/
function get_suggest(event) {
	if(index==0){
	now_kw=document.getElementById('search_input').value;
	}
	if(event.keyCode==13){//回车
		close_sug();
		search();
		return;
	}
	if (event.keyCode == 40&&document.getElementById('suggest').style.display!="none") {//下
		if (index < document.getElementById("suglist").childNodes.length) {
			console.log(document.getElementById("suglist").childNodes.length+"  "+index);
			if (index > 0) {
				document.getElementById('li_' + (index-1)).style.backgroundColor = removeColor;
			}
				document.getElementById('li_' + index).style.backgroundColor = addColor;//着色
				document.getElementById('search_input').value=document.getElementById('li_' + index).innerText;
			index++;
		}
		return;
	} else if (event.keyCode == 38&&document.getElementById('suggest').style.display!="none") {//上
		event.preventDefault();
		if (index > 0) {
			index--;
			   document.getElementById('li_' + index).style.backgroundColor = removeColor
			if (index > 0) {
				document.getElementById('li_' + (index - 1)).style.backgroundColor = addColor;//着色
				document.getElementById('search_input').value=document.getElementById('li_' + (index-1)).innerText;
			}else{
				document.getElementById('search_input').value=now_kw;	
			}
		}
		return;
	}
	var kw = document.getElementById('search_input').value;
	if (kw == last_kw) return;
	index = 0;//Li位置为0
	last_kw = kw;
	
	if (!kw || kw.length < max_sug_len) {
		close_sug();
		return;
	}
	var script = document.createElement('script');
	script.type = 'text/javascript';
	//https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=456&json=1&p=3&sid=1435_25810_21085_17001_20718&req=2&bs=https%3A%2F%2Fsp0.baidu.com%2F&pbs=https%3A%2F%2Fsp0.baidu.com%2F&csor=3&pwd=12&cb=jQuery11020003972620326273102_1518769378024&_=1518769378054
	script.src = "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd=" + encodeURIComponent(kw) + "&p=3&cb=jsonp3";
	//https://sugs.m.sm.cn/web?t=w&uc_param_str=dnnwnt&scheme=http&fr=android&bid=1&q=' + encodeURIComponent(kw) + '&_=' + new Date().getTime() + '&callback=jsonp3'
	var head = document.querySelector('head');
	script.onload = function () {
		head.removeChild(script);
	};
	head.appendChild(script);

}
function jsonp3(res) {
	console.log(res);
	var suggest = document.getElementById('suggest');
	if (!res.s || !res.s.length) {
		suggest.style.display = 'none';
		return;
	}
	var html = '';
	var size = 0;
	res.s.forEach(function (v) {

		html += '<li id="li_' + size + '">' + v + '<b></b></li>';
		size++;
	});
	document.getElementById('suglist').innerHTML = html;
	suggest.style.display = 'block';
}
function close_sug() {
	console.log("dier");
	last_kw = '';
	document.getElementById('suggest').style.display = 'none';
}
function move_input() {
	document.body.scrollTop = document.getElementById('search_form').offsetTop - 2;
}
function clear_seach() {
	var input = document.getElementById('search_input');
	input.value = '';
	document.getElementById('clear').style.display = 'none';
	close_sug();
	input.focus();
}
function search() {
	if (document.getElementById("search_input").value != "") {

		window.location.href = "https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=" + encodeURIComponent(document.getElementById("search_input").value);
	//	document.getElementById("search_input").value = "";
	}
	return false;
}
document.getElementById('search_input').addEventListener('focus',get_suggest);
document.getElementById('search_input').addEventListener('keydown', get_suggest);
document.getElementById('search_input').addEventListener('paste', get_suggest);


document.getElementById('sug_close').addEventListener('click', close_sug);

document.getElementById('suglist').addEventListener('click', function (e) {
	var input = document.getElementById('search_input');
	 if (e.target.tagName == 'LI') {
		input.value = e.target.firstChild.textContent;
		close_sug();
		search();
	}
});

document.getElementById('suglist').addEventListener('mouseover', function (e) {//鼠标移入
	 if (e.target.tagName == 'LI') {
		 if(index>0){
			document.getElementById('li_' + (index-1)).style.backgroundColor =removeColor;//清楚颜色
		 }
		 index=0;
		console.log( e.target.id);
		e.target.style.backgroundColor=addColor;
	}
});
document.getElementById('suglist').addEventListener('mouseout', function (e) {//鼠标移出
	if (e.target.tagName == 'LI') {
	   console.log( e.target.id+"out");
	   e.target.style.backgroundColor=removeColor;
   }
});
document.getElementById('img_list').addEventListener('click', function (e) {//选择图标
	if (e.target.tagName == 'IMG') {
	   if(icon!=null){
            icon.style.backgroundColor="#ffffff00";
	   }
	   e.target.style.backgroundColor=" #f5f4f4";
	   path_src=e.target.getAttribute("src");//记录src
	   console.log(e.target.getAttribute("src"))
	   icon=e.target;
   }
});
document.getElementById('close_suggest_item').addEventListener('click',function(e){//隐藏建议
close_sug();
});
window.addEventListener('resize', move_input);