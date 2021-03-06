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
    img.setAttribute('src', '/img/paper.png');
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
//Fills the initial tab list and sets the highlight to the first tab
document.addEventListener('DOMContentLoaded', function(){
  fillTabList({}, function(tabLength){
    console.log("All tabs loaded");
    resetFocus(tabLength);
  });
});

//Allows iteration with up and down keys
document.addEventListener('keydown', function(e){
  var li = $('li');
  var temp = $('.selected');
  // down
  if(e.which === 40){
    $('.selected').removeClass('selected');
    var next = temp.next('div');
    if(next.length){
       $("#"+next.attr('id')).addClass('selected');
    }else {
       $("#Tab"+li.eq(0).attr('id')).addClass('selected');
    }
  }
  // up 
  else if(e.which === 38){
    $('.selected').removeClass('selected');
    var next = temp.prev('div');
    if(next.length){
       $("#"+next.attr('id')).addClass('selected');
    }else {
       $("#Tab"+li.last().attr('id')).addClass('selected');
    }
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
            //Matches the tab title or url
            if( tabs[index].title.toLowerCase().indexOf(inBox.value.toLowerCase()) != -1 ||
                tabs[index].url.toLowerCase().indexOf(inBox.value.toLowerCase()) != -1){
                foundTabs.push(index);
            }
        }
        

        //Display the new list
        list = document.getElementById('list');
        list.innerHTML = '';
        if(foundTabs.length > 0){
            for(index in foundTabs){
                list.appendChild(createListElement(index,
                  {
                    title: tabs[foundTabs[index]].title,
                    index: foundTabs[index],
                    windowId: tabs[foundTabs[index]].windowId,
                    imgSrc: tabs[foundTabs[index]].favIconUrl
                  }));
            }
             resetFocus(foundTabs.length);
        }else {
            list.appendChild(createListElement(-1, {
              title: "No tabs found."}
              ));
        }


    });
});
