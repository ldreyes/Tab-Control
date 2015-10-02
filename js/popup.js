function strimString(string, length){
  if(string.length > length) {
    return string.substring(0,length-1)+"...";
  }
  return string;
}


function fillTabList(queryInfo, callback){
  chrome.tabs.query(queryInfo, function (tabs){

    var list = document.getElementById('list');
    for (index in tabs){
      console.log(tabs[index].title);

      var listElement = document.createElement('li');
      listElement.appendChild(document.createTextNode(strimString(tabs[index].title, 40)));
      listElement.setAttribute('id', index);
      
      var div = document.createElement('div');
      div.setAttribute('class', 'tab_el')

      div.appendChild(listElement);
      list.appendChild(div);
    }
    callback();
  });
}

document.addEventListener('DOMContentLoaded', function(){
  fillTabList({}, function(){
    console.log("All tabs loaded");
  });
});

//Navigates to the tab that the user clicks
//TODO: fix to work when tabs are in another window
var l = document.getElementById('list');
l.addEventListener('click', function(event){
  chrome.tabs.highlight({ 'tabs' : parseInt(event.target.id) }, function(window){});
});


//Filter tabs by the users text
function filterTabList(e){
  chrome.tabs.query({}, function (tabs){

  });
}
