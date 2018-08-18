var workingId = null;
// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    var newArt = $("<div>");
    var noteBtn = $("<button>").text("Add Note").addClass("btn btn-sm btn-success d-inline-block ml-5 noteBtn");
    noteBtn.attr("data-id", data[i]._id)
    newArt.append("<a href = 'http://www.cryptonews.com" + data[i].link + "'> <img src = '" + data[i].imgSrc + "'><p>" + data[i].title + "</p></a>");
    newArt.addClass("mb-4")
    newArt.append(noteBtn);
    $("#articles").append(newArt);
  }
});


// Whenever someone clicks a p tag
$(document).on("click", ".noteBtn", function () {

  var thisId = $(this).attr("data-id");
  workingId = thisId;
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $(".modal-title").empty();
      $(".modal-title").append("<h2>" + data.title + "</h2>");
      $("#titleInput").val("");
      $("#bodyInput").val("");


      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleInput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyInput").val(data.note.body);
      }

      $("#myModal").show();
    });
});


// When you click the savenote button
$(document).on("click", ".modalBtn", function () {
  // Grab the id associated with the article from the submit button

  if (this.id == "cancel" || this.id == "close") {
    $("#myModal").hide();
  } else {
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + workingId,
      data: {
        // Value taken from title input
        title: $("#titleInput").val(),
        // Value taken from note textarea
        body: $("#bodyInput").val()
      }
    })
      // With that done
      .then(function (data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
    $("#myModal").hide();
  }
});
