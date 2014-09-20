/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Settings = require('settings');
var Vector2 = require('vector2');
var Ajax = require('ajax');

// Settings
Settings.config({url: 'https://todoist.com/API/getUncompletedItems'},
  function(e) {
    console.log('opening configurable');

    // Reset color to red before opening the webview
    Settings.option('color', 'red');
  },
  function(e) {
    console.log('closed configurable');

    // Show the parsed response
    console.log(JSON.stringify(e.options));

    // Show the raw response if parsing failed
    if (e.failed) {
      console.log(e.response);
    }
  }
);

var main = new UI.Card({
  title: 'Todoist List',
  //icon: 'images/menu_icon.png',
  body: 'Fetching Todos',
  scrollable: true
});

main.show();

// Hard coded for the moment
var token = '';
var projectId = '';

var todoistItems = [];

Ajax(
  {
    url: 'https://todoist.com/API/getUncompletedItems?token=' + token + '&project_id=' + projectId,
    type: 'json'
  },
  function(data) {
    todoistItems = data;
    
    var todoMenu =  new UI.Menu({
      sections: []
    });
    
    //TODO: Order by date
    for (var i in todoistItems) {
      todoMenu.items(i, [{ title: todoistItems[i].content + '\n', subtitle: todoistItems[i].due_date }]);
    }
    todoMenu.show();
    main.hide();
  },
  function(error) {
    console.log('The ajax request failed: ' + error);
  }
);

/**
main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});
**/

main.on('click', 'select', function(e) {
  main.title("Red");
});

/**
main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});
**/