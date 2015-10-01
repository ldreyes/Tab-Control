function strimString(string, length){
  if(string.length > length) {
    return string.substring(0,length-1)+"...";
  }
  return string;
}


function getTabs(queryInfo, callback){
  chrome.tabs.query(queryInfo, function (tabs){

    var list = document.getElementById('list');
    for (index in tabs){
      console.log(tabs[index].title);

      var listElement = document.createElement('li');
      listElement.appendChild(document.createTextNode(strimString(tabs[index].title, 20)));
      listElement.setAttribute('id', index);
      list.appendChild(listElement);
    }
    callback();
  });
}

document.addEventListener('DOMContentLoaded', function(){
  getTabs({}, function(){
    console.log("All tabs loaded");
  });
});

//Navigates to the tab that the user clicks
//TODO: fix to work when tabs are in another window
var l = document.getElementById('list');
l.addEventListener('click', function(event){
  chrome.tabs.highlight({ 'tabs' : parseInt(event.target.id) }, function(window){});
});
