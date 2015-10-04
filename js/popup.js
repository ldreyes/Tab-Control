var tabListNum = 0;
var liSelected = $('li').eq(0);

function strimString(string, length){
  if(string.length > length) {
    return string.substring(0,length-1)+"...";
  }
  return string;
}

function resetFocus(tabNum){
  tabListNum = tabNum;
  liSelected = $('li').eq(0);
  $("#Tab"+liSelected.attr('id')).addClass("selected");
}

function createListElement(id, info) {
  var listElement = document.createElement('li');
  listElement.appendChild(document.createTextNode(strimString(info.title, 40)));
  listElement.setAttribute('id', id);

  var img = document.createElement('img');
  if(info.imgSrc == undefined){
    img.setAttribute('src', '/img/paper.jpg');
  }else{
    img.setAttribute('src', info.imgSrc);
  }

  var div = document.createElement('div');
  div.setAttribute('id', "Tab" + id);
  div.setAttribute('data-tab-id', info.index);
  div.setAttribute('data-window-id', info.windowId);
  div.setAttribute('class', 'tab_el')
  div.appendChild(img);
  div.appendChild(listElement);

  return div;
}

function fillTabList(queryInfo, callback){
  chrome.tabs.query(queryInfo, function (tabs){
    var list = document.getElementById('list');
    for (index in tabs){
      list.appendChild(createListElement(index,
        {
          title: tabs[index].title,
          index: tabs[index].index,
          windowId: tabs[index].windowId,
          imgSrc: tabs[index].favIconUrl
        }));
    }
    callback(tabs.length);
  });
}

function focusTab (id){
  console.log(id);
  var name = id;
  if(id.indexOf("Tab") === -1){
    name = "Tab"+id;
  }
  var list = document.getElementById(name);
  // TODO: do not call update if the target window is the same 
  chrome.windows.update(parseInt(list.getAttribute("data-window-id")), {'focused':true});
  chrome.tabs.highlight({ 
    'tabs' : parseInt(list.getAttribute("data-tab-id")),
    'windowId' :  parseInt(list.getAttribute("data-window-id"))});
}

//========================= EVENT LISTENERS =====================================

document.addEventListener('DOMContentLoaded', function(){
  fillTabList({}, function(tabLength){
    console.log("All tabs loaded");
    resetFocus(tabLength);
  });
});

document.addEventListener('keydown', function(e){
  var li = $('li');
  // down
  if(e.which === 40){
    console.log(liSelected.attr('id'));
    $("#Tab"+liSelected.attr('id')).removeClass('selected');
    var next = liSelected.next('li');

    console.log(liSelected);
    if(next.length){
    console.log("#Tab"+next.attr('id'));
    console.log($("#Tab"+next.attr('id')));

       $("#Tab"+next.attr('id')).addClass('selected');
    }else {
       $("#Tab"+li.eq(0).attr('id')).addClass('selected');
    }
    liSelected = next;
  }
  // up 
  else if(e.which === 38){
    //document.getElementById(focusedTabId).className = "tab_el";
    focusedTabId--;
    if(focusedTabId < 0){
      focusedTabId = tabListNum - 1;
    }
   // document.getElementById(focusedTabId).className = "selected tab_el";
  }
});

//Navigates to the tab that the user clicks
document.getElementById('list').addEventListener('click', function(event){
  focusTab(event.target.id);
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
      focusTab($('.selected').attr('id'));
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

        //Display the new list
        list = document.getElementById('list');
        list.innerHTML = '';
        if(foundTabs.length > 0){
            for(index in foundTabs){
                list.appendChild(createListElement(index,
                  {
                    title: tabs[foundTabs[index]].title,
                    index: foundTabs[index].index,
                    windowId: tabs[index].windowId,
                    imgSrc: tabs[index].favIconUrl
                  }));
            }
        }else {
            list.appendChild(createListElement(-1, {
              title: "No tabs found."}
              ));
        }

    });
});
