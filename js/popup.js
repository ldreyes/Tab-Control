function strimString(string, length){
  if(string.length > length) {
    return string.substring(0,length-1)+"...";
  }
  return string;
}


function getTabs(queryInfo, callback){
  chrome.tabs.query(queryInfo, function (tabs){

    for (index in tabs){
      console.log(tabs[index].title);
      document.getElementById("list").innerHTML += ("* " + strimString(tabs[index].title, 20) + "<br>");
    }
    callback();
  });
}

document.addEventListener('DOMContentLoaded', function(){
  getTabs({}, function(){
    console.log("All tabs loaded");
  });
});