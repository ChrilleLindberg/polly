function sockets(io, socket, data) {
  socket.emit('init', data.getUILabels());
  
  socket.on('pageLoaded', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('switchLanguage', function(lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('createPoll', function(d) {
    socket.emit('pollCreated', data.createPoll(d.pollId, d.lang));
  });

  socket.on('getPollInfo', function(d) {
    socket.emit('getPollInfo2', data.getPollInfo(d))
  })

  socket.on('clearPollId', function (d) {
    socket.emit('deletePoll', data.clearPollId(d))
  })

  socket.on('sendPollId', function(d) {
    socket.emit('checkPollId', data.pollExists(d))
  });

  socket.on('addQuestion', function(d) {
    data.addQuestion(d.pollId, {q: d.q, a: d.a});
    socket.emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('sendGlossary', function (d) {
    socket.emit('sendGlossary',d)
  })

  socket.on('joinPoll', function(pollId) {
    socket.join(pollId);
    socket.emit('newQuestion', data.getQuestion(pollId))
    socket.emit('dataUpdate', data.getAnswers(pollId));
    socket.emit('dataGetResults', data.getResults(pollId))
  });

  socket.on('runQuestion', function(d) {
    io.to(d.pollId).emit('newQuestion', data.getQuestion(d.pollId, d.questionNumber));
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.pollId, d.answer);
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on("finishAnswer", function(numberCorrect,pollId, name){
    data.getMyAnswer(numberCorrect,pollId, name)
    io.to(pollId).emit('dataGetResults', data.getResults(pollId));

  });

  socket.on('getResults', function(pollId){
    console.log("sockettest")
    socket.emit('dataGetResults', data.getResults(pollId));
  });
  socket.on('resetAnswers', function(pollId) {
    socket.emit('newTest', data.resetedAnswer(pollId));
  });

  socket.on('resetAll', () => {
    data = new Data();
    data.initializeData();
  })
 
}

module.exports = sockets;