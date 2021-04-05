let apikey = "449c4953d7a17fdab9b1b661e659fb5c";
let url_image="https://image.tmdb.org/t/p/w300";
var movies = ["Scott Pilgrim vs. the World"];

var url="".concat("https://api.themoviedb.org/3/search/movie?api_key=",apikey,"&query=Scott Pilgrim vs. the World");
fetch(url).then(onSuccess,onError).then(fillDiv);

function fillDiv(result,){
  console.log(result);
  var title = document.createElement("h1");
  title.innerHTML = result["results"][0]["title"];
  document.getElementsByTagName('body')[0].appendChild(title);
  var picture = document.createElement("img");
  picture.src = "".concat(url_image, result["results"][0]["poster_path"]);
  document.getElementsByTagName('body')[0].appendChild(picture);
  var date = document.createElement("h3");
  date.innerHTML = result["results"][0]["release_date"].slice(0,4);
  document.getElementsByTagName('body')[0].appendChild(date);
  
  var id = result["results"][0]["id"];
  var crediturl="".concat("https://api.themoviedb.org/3//movie/",id,"/credits?api_key=",apikey);
  
  fetch(crediturl).then(onSuccess,onError).then(fillForm);

}

function fillForm(result){
  console.log(result);
  var names = {};
  result["cast"].forEach(function(entry){
      if (entry["known_for_department"] === "Directing" || entry["known_for_department"] === "Acting") {
        names[entry["id"]] = entry["name"].toLowerCase();
      }
  });
  result["crew"].forEach(function(entry){
      if (entry["job"] === "Director" || entry["job"] === "Actor") {
        names[entry["id"]] = entry["name"].toLowerCase();
      }
  }); 
  
  console.log(names)
  var h = document.createElement("h3");
  h.innerHTML = "Enter an actor or a director name of this movie:"
  document.getElementsByTagName('body')[0].appendChild(h);
  
  var f = document.createElement("form");
  f.setAttribute('method',"post");
  f.setAttribute('action',"submit.php");
  var text = document.createElement("input"); //input element, text
  text.setAttribute('type',"text");
  text.setAttribute('name',"username");

  var button = document.createElement("input"); //input element, Submit button
  button.setAttribute('type',"submit");
  button.setAttribute('value',"Submit");

  f.appendChild(text);
  f.appendChild(button);
  document.getElementsByTagName('body')[0].appendChild(f)
  
  f.addEventListener('submit', (event) => {
    event.preventDefault();
    if (Object.values(names).includes(text.value.toLowerCase())) {
      var msg = document.getElementById("wronganswer");
      if (msg != null){
        msg.parentNode.removeChild(msg);
      }
      var pid = Object.keys(names).find(key => names[key] == text.value.toLowerCase())
      var personurl="".concat("https://api.themoviedb.org/3/person/",pid,"?api_key=",apikey);
      f.parentNode.removeChild(f);
      fetch(personurl).then(onSuccess,onError).then(fillPerDiv);
      
    } else {
      var msg = document.getElementById("wronganswer");
      if (msg === null){
        var falseval = document.createElement("h3");
        falseval.id = "wronganswer";
        falseval.innerHTML = "".concat(text.value.toLowerCase(), " is not an actor nor a director of this movie");
        falseval.style.backgroundColor = "red";
        document.getElementsByTagName('body')[0].appendChild(falseval);
      } else {
        msg.innerHTML = "".concat(text.value.toLowerCase(), " is not an actor nor a director of this movie");
      }
    }
  });
}

function fillPerDiv(result){
  console.log(result);
  var name = document.createElement("h1");
  name.innerHTML = result["name"];
  document.getElementsByTagName('body')[0].appendChild(name);
  var picture = document.createElement("img");
  picture.src = "".concat(url_image, result["profile_path"]);
  document.getElementsByTagName('body')[0].appendChild(picture);
  var bd = document.createElement("h3");
  bd.innerHTML = result["birthday"];
  document.getElementsByTagName('body')[0].appendChild(bd);
  
  var id = result["id"];
  var moviecreditsurl="".concat("https://api.themoviedb.org/3/person/",id,"/movie_credits?api_key=",apikey);
  
  fetch(moviecreditsurl).then(onSuccess,onError).then(fillFormMovie);
}

function fillFormMovie(result){
  console.log(result);
  
  var movienames = [];
  result["cast"].forEach(function(entry){
      movienames.push(entry["title"].toLowerCase())
      });
  console.log(movienames)
  
  var h = document.createElement("h3");
  h.innerHTML = "Enter a movie where this person has a role:"
  document.getElementsByTagName('body')[0].appendChild(h);
  
  var f = document.createElement("form");
  f.setAttribute('method',"post");
  f.setAttribute('action',"submit.php");
  var text = document.createElement("input"); //input element, text
  text.setAttribute('type',"text");
  text.setAttribute('name',"username");

  var button = document.createElement("input"); //input element, Submit button
  button.setAttribute('type',"submit");
  button.setAttribute('value',"Submit");

  f.appendChild(text);
  f.appendChild(button);

  document.getElementsByTagName('body')[0].appendChild(f);
  
  f.addEventListener('submit', (event) => {
    event.preventDefault();
    if (movienames.includes(text.value.toLowerCase()) && !(movies.includes(text.value.toLowerCase()))) {
      var msg = document.getElementById("wronganswer");
      if (msg != null){
        msg.parentNode.removeChild(msg);
      }

      var movieurl="".concat("https://api.themoviedb.org/3/search/movie?api_key=",apikey,"&query=",text.value.toLowerCase());
      f.parentNode.removeChild(f);
      fetch(movieurl).then(onSuccess,onError).then(fillDiv);
      movies.push(text.value.toLowerCase())
    } else {
      if (movies.includes(text.value.toLowerCase())) {
        var msg = document.getElementById("wronganswer");
        if (msg === null){
          var falseval = document.createElement("h3");
          falseval.id = "wronganswer";
          falseval.innerHTML = "".concat(text.value.toLowerCase(), " has already been submited.");
          falseval.style.backgroundColor = "red";
          document.getElementsByTagName('body')[0].appendChild(falseval);
        } else {
          msg.innerHTML = "".concat(text.value.toLowerCase(), " has already been submited.");
        }
      } else {
        var msg = document.getElementById("wronganswer");
        if (msg === null){
          var falseval = document.createElement("h3");
          falseval.id = "wronganswer";
          falseval.innerHTML = "".concat(text.value.toLowerCase(), " is not a a good answer !");
          falseval.style.backgroundColor = "red";
          document.getElementsByTagName('body')[0].appendChild(falseval);
        } else {
          msg.innerHTML = "".concat(text.value.toLowerCase(), " is not a a good answer !");
        }
      }
        
    }
  });
}

function onSuccess(result){
  return result.json();
}

function onError(error){
  console.log("error: " + error);
}


