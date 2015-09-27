function getTabs(queryInfo, callback){
  chrome.tabs.query(queryInfo, function (tabs){

    for (index in tabs){
      console.log(tabs[index].title);
      document.getElementById("list").innerHTML += tabs[index].title + "\n";
    }
    callback();
  });
}

document.addEventListener('DOMContentLoaded', function(){
  getTabs({}, function(){
    console.log("All tabs loaded");
  });
});