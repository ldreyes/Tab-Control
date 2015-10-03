var tabListNum = 0;
var focusedTabId = 0;
function strimString(string, length){
  if(string.length > length) {
    return string.substring(0,length-1)+"...";
  }
  return string;
}

function resetFocus(tabNum){
  tabListNum = tabNum;
  focusedTabId = 0;
  document.getElementById(focusedTabId).setAttribute('class','selected');
}

function createListElement( title, index, windowId ) {
  var listElement = document.createElement('li');
  listElement.appendChild(document.createTextNode(strimString(title, 40)));
  listElement.setAttribute('data-tab-id', index);
  listElement.setAttribute('data-window-id', windowId);

  var div = document.createElement('div');
  div.setAttribute('id', index);
  div.setAttribute('class', 'tab_el')

  div.appendChild(listElement);
  return div;
}

function fillTabList(queryInfo, callback){
  chrome.tabs.query(queryInfo, function (tabs){
    var list = document.getElementById('list');
    for (index in tabs){
      list.appendChild(createListElement(strimString(tabs[index].title), index, tabs[index].windowId));
    }
    callback();
    resetFocus(tabs.length);
  });
}

//========================= EVENT LISTENERS =====================================

document.addEventListener('DOMContentLoaded', function(){
  fillTabList({}, function(){
    console.log("All tabs loaded");
  });
});

document.addEventListener('keydown', function(e){
  // down
  if(e.which === 40){
    document.getElementById(focusedTabId).setAttribute('class','tab_el');
    focusedTabId++;
    if(focusedTabId >= tabListNum){
      focusedTabId = 0;
    }
    document.getElementById(focusedTabId).setAttribute('class','selected');
  }
  // up 
  else if(e.which === 38){
    document.getElementById(focusedTabId).setAttribute('class','tab_el');
    focusedTabId--;
    if(focusedTabId < 0){
      focusedTabId = tabListNum - 1;
    }
    document.getElementById(focusedTabId).setAttribute('class','selected');
  }
});

//Navigates to the tab that the user clicks
document.getElementById('list').addEventListener('click', function(event){
  var list = document.getElementById(event.target.id);
  // TODO: do not call update if the target window is the same 
  chrome.windows.update(parseInt(list.getAttribute("data-window-id")), {'focused':true});
  chrome.tabs.highlight({ 
    'tabs' : parseInt(list.getAttribute("data-tab-id")),
    'windowId' :  parseInt(list.getAttribute("data-window-id"))});
});


//Filter tabs by the users text
document.getElementById('searchInput').addEventListener('keyup', function(e){
    if(e.which === 40 || e.which === 38){
      console.log("up or down");
      return;
    }
    var inBox = this;
    chrome.tabs.query( {}, function ( tabs ) {
        //Search for the tab indexes given the text
        var foundTabs = [];
        for(index in tabs){
            if( tabs[index].title.toLowerCase().indexOf(inBox.value.toLowerCase()) != -1 ){
                foundTabs.push(index);
            }
        }
        resetFocus(foundTabs.length);
        //console.log(foundTabs);

        //Display the new list
        list = document.getElementById('list');
        list.innerHTML = '';
        if(foundTabs.length > 0){
            for(index in foundTabs){
                console.log(index, tabs[index].title);
                list.appendChild(createListElement(tabs[foundTabs[index]].title, foundTabs[index], tabs[index].windowId));
            }
        }else {
            list.appendChild(createListElement("No tabs found."), -1);
        }

    });
});
