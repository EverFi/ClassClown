//member-level
var countdownTimer, countdownTarget, answers, questionId, correct, answer_list = new Array(), key= {}, isPolling = false;

//constants
var questionTime = 15000; // 15 seconds from question start to question end
var showNames = false; // Show names of answerers with graph

$(document).ready(function() {
	setToWait();
	pusher = new Pusher('7535e89f85853d6b1c70');
	channel = pusher.subscribe('classclown');
	channel.bind('event', function(message) { updateScreen(message); });
});

var updateScreen = function(msg)
{
	switch (msg.command)
	{
		case "startPoll":
			if (isPolling == false)
			{ startPoll(msg); }
			break;
		case "addAnswer":
			if (msg.question_id == questionId)
			{ addAnswer(msg); }
			break;
		case "setToWait":
			setToWait();
			break;
		default:
			break;
	}
}

var setToWait = function()
{
	// Stop the countdown timer
	clearInterval(countdownTimer);
	questionId = "";
	
	$("#question").empty();
	$("#timer").empty();
	$("#chart").empty().text("waiting...");
}

var clock = function()
{
	var now = new Date().valueOf();
	if (now > countdownTarget)
	{
		clearInterval(countdownTimer);
		drawGraphs();
	}
	else
	{
		var diff = countdownTarget - now;
		$("#timer").text(":" + (Math.round(diff / 1000) >= 10 ? Math.round(diff / 1000) : "0" + Math.round(diff / 1000)));
	}
}

var startPoll = function(msg)
{
	isPolling = true;
	countdownTarget = new Date().valueOf() + questionTime;
	countdownTimer = setInterval(clock, 100);
	answers = msg.answers;
	questionId = msg.question_id;
	correct = msg.correct;
	$("#question").text(msg.question);
	$("#chart").empty().append(expandQuestion(msg));
}

var addAnswer = function(msg)
{
	answer_list.push(msg.answer);
	key[msg.answer_name] = msg.answer;
	$("#answerCount").text(answer_list.length)
}

var expandQuestion = function(msg)
{
	var con = document.createElement("div");
	var q = document.createElement("div");
	for (a in msg.answers)
	{
		$(con).append(expandAnswer(msg.answers[a]));
	}
	$(con).append("<br/>Answers:<span id='answerCount'>0</span>");
	return con;
}

var expandAnswer = function(ans)
{
	var a = document.createElement("div")
	$(a).text(ans.name + ") " + ans.answer).addClass("a");
	return a;
}

var drawGraphs = function(msg)
{
	isPolling = false;
	$("#timer").empty();
	$("#chart").empty();
	
	for (var x in answers)
	{
		$("#chart").append(drawBar(answers[x]));
	}
	
	questionId = "";
	answers = "";
}

var drawBar = function(ans)
{
	var col = document.createElement("div");
	var count = 0;
	for (var a in answer_list)
	{
		if (answer_list[a] == ans.name)
		{
			count++;
		}
	}
	$(col).addClass("row").append("<div class='name'>" + ans.name + "</div>").append(createBar(count, answer_list.length)).append("<div class='pct'> " + Math.round((count/answer_list.length) * 100) + "% </div>");
	if (ans.name == correct)
	{ $(col).addClass("correct"); }
	return col;
}

var createBar = function(num, total)
{
	var len = (total < 1 ? 0 : num / total);
	var bar = document.createElement("div");
	$(bar).addClass("bar").css("width", len * 500);
	return bar;
}