"use strict"
/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      searchResults = traits(people);
      break;
      default:
    app(people); // restart app
      break;
  }
  
  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
}

function traits(people){
  let traits = ["gender","eyeColor","dob","occupation","height","weight"];
  let moreTraits = "yes";
  let searchResults = people;
  while(moreTraits == "yes"){
    let promptTrait = prompt("What trait do you know of the person? Enter one of the following: " + traits.join(", "));
    searchResults = searchByTrait(searchResults, promptTrait);
    displayPeople(searchResults);
    moreTraits = promptFor("Do you know any other traits? Enter 'yes' or 'no'", yesNo).toLowerCase();
    let indexTrait = traits.indexOf(promptTrait);
    traits.splice(indexTrait, 1);
  }
  

}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(!person){
    alert("Could not find that individual.");
    return app(people); // restart
  }

  let displayOption = prompt("Found " + person[0].firstName + " " + person[0].lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");
  let id = [];
  switch(displayOption){
    case "info":
    alert(person[0].firstName + " " + person[0].lastName +"'s info: \n" + displayInfo(person));
    break;
    case "family":
      id = person[0].id;
      let parentsId = person[0].parents;
      let family = [] 
      family = findSiblings(parentsId, people, id);
      family.push(findSpouse(id, people));
      family = arrayCleanup(family);
      displayPeople(family);
    break;
    case "descendants":
      id = person[0].id;
      let count = 0;
      searchResults = findDescendants(id, people, );//(Jack Pafoy) (Annie Pafoy[13], Dave Pafoy [14], amii [15])
      console.log(descendantsArray[0]+descendantsArray[1]+descendantsArray[2]);
    break;
    case "restart":
    app(people); // restart
    break;
    case "quit":
    return; // stop execution
    default:
    return mainMenu(person, people); // ask again
  }
}

function arrayCleanup(array){
  array = array.filter(function (el){
    return el != null && el != '';
  })

  return array;
}

//STILL NEEDS A LOT OF WORK
function findDescendants (id, people, descendantsArray = []){

 descendantsArray = people.filter(function(el){
      return el.parents[0] === id || el.parents[1 === id] //id works if it's a variable, but if it's a array it won't work. otherwise function is good 
    })    
  displayPeople(descendantsArray)
  id = [];
  for(let i = 0; i<descendantsArray.length; i++){
    id[i] = descendantsArray[i].id
  }

  if (descendantsArray.length === 0){
    return descendantsArray;
  }
  else {
    findDescendants(id, people, descendantsArray)
  }
}

function findSpouse (id, people){

  let foundPerson = people.filter(function(person){
    if(person.currentSpouse === id){
    return true
    }
    else{
      return false
    }
  });
  return foundPerson;
}

function findSiblings (parentsId, people, id){

  let foundPerson = people.filter(function(person){
    if(person.parents.includes(parentsId[1] || parentsId[2]) && person.id != id){
    return true
    }
    else{
      return false
    }
  });
  return foundPerson;
}


function displayInfo(person){
    let info = ("First Name: " + person[0].firstName + "\n" + "Last Name: " + person[0].lastName + "\n" + "Gender: " + person[0].gender + "\n" + "Date of Birtn: " + person[0].dob + "\n" + "Height: " + person[0].height + "\n" + "Weight: " + person[0].weight + "\n" + "Occupation: " + person[0].occupation);
  return info; 
}

function searchByName(people){
  let firstName = promptFor("What is the person's first name?", chars);
  let lastName = promptFor("What is the person's last name?", chars);

  let foundPerson = people.filter(function(person){
    if(person.firstName === firstName && person.lastName === lastName){
      return true;
    }
    else{
      return false;
    }
  });
  return foundPerson;
}

function searchByTrait(people, trait){
  let search = promptFor("What is the person's " + trait, chars);

  let foundPerson = people.filter(function(person){
    if(person[trait] == search){
      return true;
    }
    else{
      return false;
    }
  });
  return foundPerson;
}

// alerts a list of people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person){
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  // TODO: finish getting the rest of the information to display
  alert(personInfo);
}

// function that prompts and validates user input
function promptFor(question, valid){
  do{
    var response = prompt(question).trim();
  } while(!response || !valid(response));
  return response;
}

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input){
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

// helper function to pass in as default promptFor validation
function chars(input){
  return true; // default validation only
}
