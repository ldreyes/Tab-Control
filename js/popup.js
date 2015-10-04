var tabListNum = 0;
var focusedTabId = 0;
var activeTabs;
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

function createListElement( title, index, windowId, imgSrc) {
  var listElement = document.createElement('li');
  listElement.appendChild(document.createTextNode(strimString(title, 40)));
  listElement.setAttribute('id', "Tab" + index);

  var img = document.createElement('img');
  if(imgSrc == undefined){
    img.setAttribute('src', '/img/paper.jpg');
  }else{
    img.setAttribute('src', imgSrc);
  }
  
  

  var div = document.createElement('div');
  div.setAttribute('id', index);
  div.setAttribute('data-tab-id', index);
  div.setAttribute('data-window-id', windowId);
  div.setAttribute('class', 'tab_el')
  
  console.log(img);
  div.appendChild(img);
  div.appendChild(listElement);
  return div;
}

function fillTabList(queryInfo, callback){
  chrome.tabs.query(queryInfo, function (tabs){
    var list = document.getElementById('list');
    for (index in tabs){
      list.appendChild(createListElement(strimString(tabs[index].title), index, tabs[index].windowId, tabs[index].favIconUrl));
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
  var list = document.getElementById(event.target.id.substring(3));
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
    //enter key -> navigate to tab
    if(e.which === 13){
      console.log("enter");
      var list = document.getElementById(focusedTabId);
      chrome.windows.update(parseInt(list.getAttribute("data-window-id")), {'focused':true});
      chrome.tabs.highlight({ 
        'tabs' : parseInt(list.getAttribute("data-tab-id")),
        'windowId' :  parseInt(list.getAttribute("data-window-id"))});
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
                list.appendChild(createListElement(tabs[foundTabs[index]].title, foundTabs[index], tabs[index].windowId), tabs[index].favIconUrl);
            }
        }else {
            list.appendChild(createListElement("No tabs found."), -1, "");
        }

    });
});
