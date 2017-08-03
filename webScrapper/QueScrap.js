var kue = require("kue"),
queue = kue.createQueue(),
express = require("express");


kue.Job.rangeByState('complete', 0, 10, 1, function(err, jobs) {
  jobs.forEach(function(job) {
    // if (job.created_at < dateNow) {
    //     return;
    // }
    //console.log("job dateNow =" +dateNow);
    job.remove(function(err){
      if (err) throw err;
      console.log('removed completed job #%d', job.id);
    });
  });
});

queue.process('scraping',3, function(job, done){
    setTimeout(function(){
    scraping(job, done);
    job.on('complete', function(result){
        console.log('Job completed with data ', result);
    }).on('failed attempt', function(errorMessage, doneAttempts){
        console.log('Job failed');
    })
    },400);
});



function scraping(job, done) {
  
    //scrapping stuff
    require("./scrapping-agromaret")(job, function(job){
        console.log("done");
        done(); 
    }, function(job){
        console.log("job failed");
        done(job);
    });  
}


queue.on('job enqueue', function(id, type){
  console.log( 'Job %s got queued of type %s', id, type );

}).on('job complete', function(id, result){
  kue.Job.get(id, function(err, job){
    if (err) return;
  });
});


kue.app.listen(4000);