$(document).ready(function() {
    function getDateString(seconds) {
        var date = new Date(seconds * 1000);
        return dayOfWeekAsString(date.getDay()) + ', ' +
            monthOfYearAsString(date.getMonth()) + ' ' +
            date.getDate() + ', ' + date.getFullYear();
    }

    function dayOfWeekAsString(dayIndex) {
        return ["Monday", "Tuesday", "Wednesday", "Thursday",
            "Friday", "Saturday", "Sunday"
        ][dayIndex];
    }

    function monthOfYearAsString(monthIndex) {
        return ['January', 'February', 'March', 'April',
            'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'
        ][monthIndex];
    }

    function getTimeString(seconds) {
        var date = new Date(seconds * 1000);
        return date.toLocaleTimeString();
    }

    function getWeatherHTML(json) {
        var results = "";
        results += '<h2>Weather in ' + json.name + ' for ' + getDateString((json.sys.sunrise + json.sys.sunset) / 2) + "</h2>";
        for (var i = 0; i < json.weather.length; i++) {
            results += '<img src="http://openweathermap.org/img/w/' + json.weather[i].icon + '.png"/>';
        }
        results += '<h2>' + json.main.temp + " &deg;F</h2>";
        results += "<p>";
        for (var i = 0; i < json.weather.length; i++) {
            results += json.weather[i].description
            if (i !== json.weather.length - 1)
                results += ", ";
        }
        results += "</p>";
        results += "<p>" + "Sunrise : " + getTimeString(json.sys.sunrise) + "</p>";
        results += "<p>" + "Sunset : " + getTimeString(json.sys.sunset) + "</p>";
        return results;
    }




    $("#weatherSubmit").click(function(e) {
        e.preventDefault(); //Stops page reload
        var value = $("#weatherInput").val();
        var myurl = "http://api.openweathermap.org/data/2.5/weather?q=" + value + ",US&units=imperial" + "&appid=59094dc6a812726024dc4876663c2bc6";

        $.ajax({
            url: myurl,
            dataType: "json",
            success: function(json) {
                console.log(json);
                $("#weatherResults").html(getWeatherHTML(json));
            }, //End success
            error: function(jqXHR, textStatus, errorThrown) {
                $("#weatherResults").html(jqXHR.responseJSON.message.toUpperCase());
            }
        });
    }); //Weather Submit


    function getStackOverflowHTML(json) {
        var results = "";
        var results = "<hr>";
        var items = json.items;
        for (var i = 0; i < items.length; i++) {
            var question = items[i];
            results += '<div class="SO-search-result">';

            results += '<div class="votes-area">';
            results += '<div class="count">' + question.score + '</div>' + 'Votes';
            results += '</div>'; //Close votes-area

            results += '<div class="answers-area">';
            results += '<div class="count">' + question.answer_count + '</div>' + 'Answers';
            results += '</div>'; //Close answers-area

            results += '<div class="result-area">';

            results += '<div class="margin large">';
            results += '<a href="' + question.link + '">Q:' + question.title + '</a>';
            results += '</div>';

            results += '<div class="margin">';
            results += 'Question by:';
            results += '<a href="' + question.owner.link + '">';
            results += question.owner.display_name + '</a>';
            results += '</div>';

            results += '<div class="tags-area">';
            var tags = question.tags;
            var tag_url = 'https://stackoverflow.com/questions/tagged/';
            for (var j = 0; j < tags.length; j++) {
                results += '<a class="tag" href="' + tag_url + tags[j] + '">';
                results += tags[j] + '</a>';
            }
            results += '</div>'; //Close tags-area
            results += '</div>'; //Close results-area

            results += '</div>'; //close SO-search-result
            results += "<hr>";
        }
        return results;
    }


    $("#SOSubmit").click(function(e) {
        e.preventDefault(); //Stops page reload
        var value = $("#SOInput").val();
        search = value.trim().replace(/ /g, '%20'); // Replace spaces with %20
        var myurl = "https://api.stackexchange.com/2.2/search?pagesize=10&order=desc&sort=votes&intitle=" + search + "&site=stackoverflow";
        $.ajax({
            url: myurl,
            dataType: "json",
            success: function(json) {
                console.log(JSON.stringify(json));
                $("#SOResults").html(getStackOverflowHTML(json));
            }, //End success
            error: function(jqXHR, textStatus, errorThrown) {
                $("#SOResults").html(jqXHR.responseJSON.message.toUpperCase());
            }
        });
    }); //Stack overflow Submit



    function getMathFactHTML(text) {
        return '<div class="dyk">Fact: ' + text + '</div>';
    };

    function getMFError(text) {
        return '<div> Sorry, could not find ' + text + '</div>';
    }

    function clearMF() {
        if ($("#MFResults").html().includes('Enter a number'))
            $("#MFResults").html('');
    }

    $("#MFSubmit").click(function(e) {
        e.preventDefault(); //Stops page reload
        var value = $("#MFInput").val();
        number = value.trim();
        if (!number) {
            return;
        }
        clearMF();
        var myurl = "http://numbersapi.com/" + number + "/math";
        $.ajax({
            url: myurl,
            dataType: "text",
            success: function(text) {
                console.log('Math Fact');
                console.log(text);
                html = $("#MFResults").html();
                $("#MFResults").html(getMathFactHTML(text) + html);
            }, //End success
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Error');
                console.log(jqXHR);
                //$("#MFResults").html(jqXHR.responseText.toUpperCase());
                html = $("#MFResults").html();
                $("#MFResults").html(getMFError(number) + html);
            }
        });
    }); //Math Fact Submit


    $("#MFRandom").click(function(e) {
        e.preventDefault(); //Stops page reload
        clearMF();
        var value = 'random';
        number = value.trim();
        var myurl = "http://numbersapi.com/" + number + "/math";
        $.ajax({
            url: myurl,
            dataType: "text",
            success: function(text) {
                console.log('Math Fact');
                console.log(text);
                html = $("#MFResults").html();
                $("#MFResults").html(getMathFactHTML(text) + html);
            }, //End success
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Error');
                console.log(jqXHR);
                //$("#MFResults").html(jqXHR.responseText.toUpperCase());
                html = $("#MFResults").html();
                $("#MFResults").html(getMFError(number) + html);
            }
        });
    }); //Math Fact Random

    $("#MFClearFacts").click(function(e) {
        e.preventDefault(); //Stops page reload
        $("#MFResults").html('<div>Facts cleared. Enter a number to search for facts</div>');
    }); //Math Fact clear

    $("#LookupText").click(function(e) {
        e.preventDefault(); //Stops page reload
        text = window.getSelection().toString();
        if (text) {
            console.log(text);
            search = text.trim().replace(/ /g, '+');
            window.open('https://www.google.com/search?q=' + 'math+' + search, '_blank');
        }
    }); //Math Fact clear
});