function strimString(string, length){
  if(string.length > length) {
    return string.substring(0,length-1)+"...";
  }
  return string;
}

function createListElement( title, index ) {
      var listElement = document.createElement('li');
      listElement.appendChild(document.createTextNode(strimString(title, 40)));
      listElement.setAttribute('id', index);
      return listElement;
}

function fillTabList(queryInfo, callback){
  chrome.tabs.query(queryInfo, function (tabs){

    var list = document.getElementById('list');
    for (index in tabs){
      console.log(tabs[index].title);
      
      var div = document.createElement('div');
      div.setAttribute('class', 'tab_el')

      div.appendChild(createListElement(strimString(tabs[index].title), index));
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
document.getElementById('list').addEventListener('click', function(event){
  chrome.tabs.highlight({ 'tabs' : parseInt(event.target.id) });
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
