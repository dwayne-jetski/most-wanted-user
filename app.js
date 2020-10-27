"use strict"
/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", chars,['yes','no']).toLowerCase();
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
  let searchResults = people;
  let traits = ["gender","eye color","dob","occupation","height","weight"];
  let moreTraits = "yes";
  
  while(moreTraits == "yes"){
    let promptTrait = promptFor("What trait do you know of the person? Enter one of the following: " + traits.join(", "),chars,traits).toLowerCase();
    searchResults = searchByTrait(searchResults, promptTrait);
    displayPeople(searchResults);
    if(searchResults.length == 1){
      break;
    }
    else if (searchResults.length == 0){
      alert("You've found no matches, the app will now restart.");
      app(people);
    }
    moreTraits = promptFor("Do you know any other traits? Enter 'yes' or 'no'", chars,['yes','no']).toLowerCase();
    if(moreTraits == 'no'){
      let promptNext = promptFor("You need to know more traits to narrow down the list. Do you want to 'restart', or 'view' the current list",chars,['restart','view']);
      if(promptNext == 'restart'){
        app(people);
      }else if("view"){
        displayPeople(searchResults);
        app(people);
      }
    }
    let indexTrait = traits.indexOf(promptTrait);
    traits.splice(indexTrait, 1);
  }
  
  if(searchResults.length == 1){
    return searchResults;
  }
  
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(!person){
    alert("Could not find that individual.");
    return app(people); // restart
  }

  let displayOption = promptFor("Found " + person[0].firstName + " " + person[0].lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'",chars,['info','family','descendants','restart','quit']);
  let id; 
  switch(displayOption){
    case "info":
    alert(person[0].firstName + " " + person[0].lastName +"'s info: \n" + displayInfo(person));
    break;
    case "family":
      id = person[0].id;
      let parentsId = person[0].parents;
      displayFamily(id, parentsId, people)
    break;
    case "descendants":
      id = person[0].id;
      findDescendants(id, people);//(Jack Pafoy) (Annie Pafoy[13], Dave Pafoy [14], amii [15])
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


 function findDescendants (id, people){

  let descendantsArray = people.filter(function(el){
      return el.parents[0] === id || el.parents[1] === id //id works if it's a variable, but if it's a array it won't work. otherwise function is good 
    })    
  
  if(descendantsArray.length === 0){//if array comes back empty(i.e. person has no descendants) it will return before printing. 
    return descendantsArray
  }
  displayPeople(descendantsArray)//displays first name of people logged in descendantsArray
  
  for(let i = 0; i<descendantsArray.length; i++){//iterats descendantsArray to do individual recursive calls to find descendants of each person logged in descendantsArray
    findDescendants(descendantsArray[i].id, people)
  }
  return descendantsArray
}

function displayFamily(id, parentsId,  people){

  
      let siblings = findSiblings(parentsId, people, id);
      let spouse = findSpouse(id, people);
      siblings = arrayCleanup(siblings);

  if (siblings.length === 0 && spouse.length === 0){
    alert("No immediate family members found");
  }
  else if(siblings.length > 0 && spouse.length === 0){
    alert("Spouse: None found\n" + "Siblings: " + printPeople(siblings));
  }
  else if(siblings.length === 0 && spouse.length > 0){
    alert("Spouse: " + printPeople(spouse) + "\nSiblings: None Found");
  }
  else{
    alert("Spouse: " + printPeople(spouse) + "\nSiblings: " + printPeople(siblings));
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
    let info = ("First Name: " + person[0].firstName + "\n" + "Last Name: " + person[0].lastName + "\n" + "Gender: " + person[0].gender + "\n" + "Date of Birth: " + person[0].dob + "\n" + "Height: " + person[0].height + "\n" + "Weight: " + person[0].weight + "\n" + "Occupation: " + person[0].occupation);
  return info; 
}

function searchByName(people){
  let foundPerson;
  do{
    let firstName = prompt("What is the person's first name?").toLowerCase();
    let lastName = prompt("What is the person's last name?").toLowerCase();

    foundPerson = people.filter(function(person){
      if(person.firstName.toLowerCase() === firstName && person.lastName.toLowerCase() === lastName){
        return true;
      }
      else{
        return false;
      }
    });
  }while(foundPerson.length==0);
  
  return foundPerson;
}

function searchByTrait(people, trait){
  let foundPerson;
  do{
    let search = prompt("What is the person's " + trait).toLowerCase();
    if(trait == "eye color"){
      trait = "eyeColor";
    }
    foundPerson = people.filter(function(person){
      if(person[trait] == search){
        return true;
        //add if person does not exist
      }
      else{
        return false;
      }
    });
  }while(foundPerson.length==0);
  
  return foundPerson;
}


function printPeople(people){
  return people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n")
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
function promptFor(question, valid, options){
  do{
    var response = prompt(question).trim();
  } while(!response || !valid(response,options));
  return response;
}

// helper function to pass in as default promptFor validation
function chars(input,options){ 
  let inputLow = input.toLowerCase();
  if(options.includes(inputLow)){
    return inputLow;
  }
}
