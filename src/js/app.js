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
//Settings.config({url: 'https://todoist.com/API/getUncompletedItems'},
  //function(e) {
    //console.log('opening configurable');

    //// Reset color to red before opening the webview
    //Settings.option('color', 'red');
  //},
  //function(e) {
    //console.log('closed configurable');

    //// Show the parsed response
    //console.log(JSON.stringify(e.options));

    //// Show the raw response if parsing failed
    //if (e.failed) {
      //console.log(e.response);
    //}
  //}
//);

var main = new UI.Card({
  title: 'Todoist List',
  //icon: 'images/menu_icon.png',
  body: 'Fetching Todos',
  scrollable: true
});

main.show();

// Hard coded for the moment
var token = 'abc123';

var projectItems = [];

// Show projects
Ajax(
  {
    url: 'https://todoist.com/API/getProjects?token=' + token,
    type: 'json'
  },
  function(data) {
    var projectsMenu =  new UI.Menu({
      title: 'Projects',
      sections: []
    });

    var i;
    
    //projects: Order by date
    for (i in data) {
      projectsMenu.items(i, [{ 
          title: data[i].name + '\n'
      }]);

      projectItems[i] = { tite: data[i].name, id: data[i].id };
    }

    projectsMenu.on('select', function(e) {
        console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);

        getItems(projectItems[e.sectionIndex].id, projectItems[e.sectionIndex].name);
    });

    projectsMenu.show();
    main.hide();

  },
  function(error) {
    console.log("Projects error: " + error);
  }
);

var todoItems = [];

getItems = function(projectId, projectName) {
    var todoistItems = [];

    Ajax(
      {
        url: 'https://todoist.com/API/getUncompletedItems?token=' + token + '&project_id=' + projectId,
        type: 'json'
      },
      function(data) {
        var i;

        todoistItems = data;

        // Clear previous items
        todoItems = [];
        
        var todoMenu =  new UI.Menu({
          title: projectName,
          sections: []
        });
        
        // TODO: Order by date
        for (i in todoistItems) {
          todoMenu.items(i, [{ title: todoistItems[i].content + '\n', subtitle: todoistItems[i].due_date }]);

          todoItems[i] = { title: todoistItems[i].content, id: todoistItems[i].id };
        }

        todoMenu.on('select', function(e) {
            console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);

            createItemActions(todoItems[e.sectionIndex]);
        });

        todoMenu.show();
        main.hide();
      },
      function(error) {
        console.log('The ajax request failed: ' + error);
      }
    );

    return;
};

// TODO: Refactor to use an array to configure actions/names
createItemActions = function(item) {
    console.log("Selected: " + item.title);
    var todoActions =  new UI.Menu({
      //title: item.title,
      sections: [
        {
          title: "Actions",
          items: [
            {
             title: 'Done' 
            },
            {
             title: 'Delete' 
            },
            {
             title: 'Postpone' 
            }

        ]}
      ]
    });

    todoActions.on('select', function(e) {
      // FIXME: Duplicate strings
      if (e.item.title === 'Done') {
        console.log('Item' + item.id);
        act(item_id, 'complete', todoActions); 
      }
    });

    todoActions.show();
};

function act(itemId, action, menu) {
    Ajax(
      {
        url: 'https://todoist.com/API/' + action + 'Items?token=' + token + '&item_id=' + itemId,
        type: 'json'
      },
      function(data) {
        menu.hide();

      },
      function(error) {
        console.log('The ajax request failed: ' + error);
      }
    );
}

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
