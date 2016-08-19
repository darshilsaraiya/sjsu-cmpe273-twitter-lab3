var express = require('express')
  , http = require('http')
  , path = require('path')
  //Importing the 'client-sessions' module
  , session = require('client-sessions')

//requiring files from routes folder
var home = require('./routes/home');
var follower = require('./routes/follower');
var profile = require('./routes/profile');
var retweet = require('./routes/retweet');
var tweet = require('./routes/tweet');
var search = require('./routes/search');

/*var mongoSessionConnectURL = "mongodb://localhost:27017/test";*/
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);

var app = express();

// all environments
//configure the sessions with our application
app.use(session({   
    
  cookieName: 'session',    
  secret: 'twitter',    
  duration: 30 * 60 * 1000,    //setting the time for active session
  activeDuration: 5 * 60 * 1000,  })); // setting time for the session to be active when the window is open // 5 minutes set currently

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname , 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//GET
app.get('/', home.home);
app.get('/signup',home.signup);
app.post('/dosignup', home.dosignup);
app.post('/checklogin',home.checklogin);
app.get('/homepage', home.homepage);
app.get('/logout', home.logout);
//Get Tweet, Follower, Following Count
app.post('/gettweetfollowerfollowingcount', home.gettweetfollowerfollowingcount);
//get followers' tweets
app.post('/getfollowingtweets', follower.getfollowingtweets);
//viewprofile
app.get('/viewprofile', home.viewprofile);
app.post('/getprofiledetails', profile.getprofiledetails);
//user tweet details
app.post('/getUserTweetsDetails',profile.getUserTweetsDetails);
//view follower, following pages
app.get('/viewfollowing',follower.viewfollowing);
app.get('/viewfollowers',follower.viewfollowers);
//get following and followers list
app.post('/getfollowing', follower.getfollowing);
app.post('/getfollower', follower.getfollower);
//insert and delete follower
app.post('/deletefollowing', follower.deletefollowing);
app.post('/insertfollowing', follower.insertfollowing);
//delete and add retweet
app.post('/deleteretweet',retweet.deleteretweet);
app.post('/insertretweet', retweet.insertretweet);
//do tweet
app.post('/doTweet',tweet.doTweet);
//User Search
app.get('/userSearchResults', search.userSearchResults);
app.get('/usrSearchResults', search.usrSearchResults);
app.get('/searchUser',search.searchUser);
//hashtag search
app.get("/searchHash", search.searchHash);
app.get("/srcHashTag",search.srcHashTag);
app.get("/searchHashTag", search.searchHashTag);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});