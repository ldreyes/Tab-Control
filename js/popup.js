function strimString(string, length){
  if(string.length > length) {
    return string.substring(0,length-1)+"...";
  }
  return string;
}

function createListElement( title, index, windowId ) {
      var listElement = document.createElement('li');
      listElement.appendChild(document.createTextNode(strimString(title, 40)));
      listElement.setAttribute('id', index);
      listElement.setAttribute('data-tab-id', index);
      listElement.setAttribute('data-window-id', windowId);

      var div = document.createElement('div');
      div.setAttribute('class', 'tab_el')

      div.appendChild(listElement);
      return div;
}

function fillTabList(queryInfo, callback){
  chrome.tabs.query(queryInfo, function (tabs){

    var list = document.getElementById('list');
    for (index in tabs){
      console.log(tabs[index].title);
      console.log(tabs[index].windowId);
 
      list.appendChild(createListElement(strimString(tabs[index].title), index, tabs[index].windowId));
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
document.getElementById('list').addEventListener('click', function(event){
  console.log(event);
  var list = document.getElementById(event.target.id);
  console.log(list);
  // TODO: do not call update if the target window is the same 
  chrome.windows.update(parseInt(list.getAttribute("data-window-id")), {'focused':true});
  chrome.tabs.highlight({ 
    'tabs' : parseInt(list.getAttribute("data-tab-id")),
    'windowId' :  parseInt(list.getAttribute("data-window-id"))});
});


//Filter tabs by the users text
document.getElementById('searchInput').addEventListener('keyup', function(e){
    var inBox = this;
    chrome.tabs.query( {}, function ( tabs ) {
        //Search for the tab indexes given the text
        var foundTabs = [];
        for(index in tabs){
            if( tabs[index].title.toLowerCase().indexOf(inBox.value.toLowerCase()) != -1 ){
                foundTabs.push(index);
            }
        }

        console.log(foundTabs);

        //Display the new list
        list = document.getElementById('list');
        list.innerHTML = '';
        if(foundTabs.length > 0){
            for(index in foundTabs){
                console.log(index, tabs[index].title);
                list.appendChild(createListElement(tabs[foundTabs[index]].title, foundTabs[index]));
            }
        }else {
            list.appendChild(createListElement("No tabs found."), -1);
        }

    });
});
