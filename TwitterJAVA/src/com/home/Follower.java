package com.home;

import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.jws.WebService;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.mysql.jdbc.Connection;
import com.mysql.jdbc.Statement;

@WebService
public class Follower {
	protected Connection getConnection() throws SQLException {
		try {
			Class.forName("com.mysql.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			System.out.println("Where is your MySQL JDBC Driver?");
			e.printStackTrace();
		}

		ConnectionPoolManager pool;
		try{
			pool = new ConnectionPoolManager();
			pool.initializeConnectionPool();
			//System.out.println("MySQL JDBC Driver Registered!");
			Connection connection = pool.getConnectionFromPool();
		} catch(Exception e) {
			System.out.println("Connection Failed! Check output console");
			e.printStackTrace();
		}

		/*//System.out.println("MySQL JDBC Driver Registered!");
		Connection connection = null;

		try {
			connection = (Connection) DriverManager.getConnection("jdbc:mysql://localhost:3306/test","root", "root");

		} catch (SQLException e) {
			System.out.println("Connection Failed! Check output console");
			e.printStackTrace();
		}*/

		if (connection != null) {
			//System.out.println("You made it, take control your database now!");
		} else {
			System.out.println("Failed to make connection!");
		}
		return connection;
	}

	protected ResultSet getResultSet(String sql) throws SQLException {
		Connection conn = pool.getConnectionFromPool();
		Statement st = (Statement) conn.createStatement();
		return st.executeQuery(sql);
	}   
	protected int updateResultSet(String sql) throws SQLException {
		Connection conn = pool.getConnectionFromPool();
		Statement st = (Statement) conn.createStatement();
		return st.executeUpdate(sql);
	}
	
	public String getfollowingtweets(String userid) {
		System.out.println("in getfollowingtweets");
		
		System.out.println("userid :: " + userid);
		JSONArray followingTweets = new JSONArray();
		JSONArray userRetweets = new JSONArray();
		JSONObject result = new JSONObject();
		try {
			String getFollowingIdQuery = "select followingid from follow where followerid=" + userid;
			String getFollowingTweetsQuery = "select users.username,users.firstname, users.lastname, tweets.tweetid,tweet,DATE_FORMAT(date,'%d/%m/%Y') as date_formatted,time from tweets,users where tweets.userid in (" + getFollowingIdQuery + ")  and users.userid= tweets.userid order by date DESC, time DESC";
			
			String getUserRetweetQuery = "select * from retweets where retweeterid = " + userid;
			
			ResultSet getfollowingtweetsResult = getResultSet(getFollowingTweetsQuery);
			ResultSet getUserRetweetQueryResult = getResultSet(getUserRetweetQuery);
			
			if(getfollowingtweetsResult.next()){
				
				JSONObject tempFollowingTweet = new JSONObject();
				
				tempFollowingTweet.put("username", getfollowingtweetsResult.getString("username"));
				tempFollowingTweet.put("firstname", getfollowingtweetsResult.getString("firstname"));
				tempFollowingTweet.put("lastname", getfollowingtweetsResult.getString("lastname"));
				tempFollowingTweet.put("tweetid", getfollowingtweetsResult.getInt("tweetid"));
				tempFollowingTweet.put("tweet", getfollowingtweetsResult.getString("tweet"));
				tempFollowingTweet.put("date_formatted", getfollowingtweetsResult.getString("date_formatted"));
				tempFollowingTweet.put("time", getfollowingtweetsResult.getString("time"));
				
				followingTweets.add(tempFollowingTweet);
				
				
				
				while(getfollowingtweetsResult.next()) {
					
					tempFollowingTweet = new JSONObject();
					
					tempFollowingTweet.put("username", getfollowingtweetsResult.getString("username"));
					tempFollowingTweet.put("firstname", getfollowingtweetsResult.getString("firstname"));
					tempFollowingTweet.put("lastname", getfollowingtweetsResult.getString("lastname"));
					tempFollowingTweet.put("tweetid", getfollowingtweetsResult.getInt("tweetid"));
					tempFollowingTweet.put("tweet", getfollowingtweetsResult.getString("tweet"));
					tempFollowingTweet.put("date_formatted", getfollowingtweetsResult.getString("date_formatted"));
					tempFollowingTweet.put("time", getfollowingtweetsResult.getString("time"));
					
					followingTweets.add(tempFollowingTweet);
					
					System.out.println("tweetid :: " + getfollowingtweetsResult.getInt("tweetid"));
					System.out.println("tweet:: " + getfollowingtweetsResult.getString("tweet"));
				}
				
				//result.put("statusCode" , "200");
				result.put("followingTweets" , followingTweets);
			}else {
				result.put("statusCode", "401");
			}
			
			if(getUserRetweetQueryResult.next()){
				JSONObject tempUserRetweet = new JSONObject();
				
				tempUserRetweet.put("tweetid", getUserRetweetQueryResult.getInt("tweetid"));
				tempUserRetweet.put("ownerid", getUserRetweetQueryResult.getInt("ownerid"));
				tempUserRetweet.put("retweeterid", getUserRetweetQueryResult.getInt("retweeterid"));
				tempUserRetweet.put("date", getUserRetweetQueryResult.getString("date"));
				tempUserRetweet.put("time", getUserRetweetQueryResult.getString("time"));
				
				userRetweets.add(tempUserRetweet);
				
				while(getUserRetweetQueryResult.next()) {
					
					tempUserRetweet = new JSONObject();
					
					tempUserRetweet.put("tweetid", getUserRetweetQueryResult.getInt("tweetid"));
					tempUserRetweet.put("ownerid", getUserRetweetQueryResult.getInt("ownerid"));
					tempUserRetweet.put("retweeterid", getUserRetweetQueryResult.getInt("retweeterid"));
					tempUserRetweet.put("date", getUserRetweetQueryResult.getString("date"));
					tempUserRetweet.put("time", getUserRetweetQueryResult.getString("time"));
					
					userRetweets.add(tempUserRetweet);
				}
				result.put("statusCode" , "200");
				result.put("userRetweets" , userRetweets);
			}else {
				result.put("statusCode", "401");
			}
		} catch(Exception e) {
			e.printStackTrace();
		}
		
		return result.toString();
	}
	
	public String insertretweet(int retweetid, int userid) {
		System.out.println("in insertretweet");
		
		System.out.println("retweetid :: " + retweetid);
		
		JSONObject result = new JSONObject();
		
		try {
			
			String getOwnerId = "select userid from tweets where tweetid=" + retweetid;
			String insertretweetQuery = "insert into retweets (tweetid, ownerid, retweeterid, date, time) values(" + retweetid + ", ("+ getOwnerId + "), " + userid + ",CURDATE(), CURTIME())";			
			
			int insertretweetQueryResult = updateResultSet(insertretweetQuery);
			
			System.out.println("insertretweetQueryResult :: " + insertretweetQueryResult);
			
			if(insertretweetQueryResult > 0) {
				result.put("statusCode", "200");
			} else {
				result.put("statusCode", "401");
			}
			
		} catch(Exception e) {
			e.printStackTrace();
		}
		
		return result.toString();
	}
	
	public String deleteretweet(int retweetid, int userid) {
		System.out.println("in deleteretweet");
		
		System.out.println("retweetid :: " + retweetid);
		
		JSONObject result = new JSONObject();
		
		try {
			
			String deleteretweetQuery = "delete from retweets where tweetid=" + retweetid + " and retweeterid=" + userid;
			int deleteretweetQueryResult = updateResultSet(deleteretweetQuery);
			
			System.out.println("deleteretweetQueryResult :: " + deleteretweetQueryResult);
			
			if(deleteretweetQueryResult > 0) {
				result.put("statusCode", "200");
			} else {
				result.put("statusCode", "401");
			}
			
		} catch(Exception e) {
			e.printStackTrace();
		}
		
		return result.toString();
	}
	
	public String searchHash(String tag) {
		System.out.println("in searchHash");
		
		System.out.println("tag :: " + tag);
		
		JSONObject result = new JSONObject();
		JSONArray hashTweets = new JSONArray();
		
		try{
			String searchHashQuery = "select tweetid from hashtag where hashtagstring='" + tag + "'";
		 	String getSearchTweetsQuery = "select users.username, tweets.tweetid, tweet, DATE_FORMAT(date,'%d/%m/%Y') as date_formatted, time from tweets, users where tweetid in (" + searchHashQuery + ") and tweets.userid= users.userid order by date DESC, time DESC";
		
		 	ResultSet getSearchTweetsQueryResult = getResultSet(getSearchTweetsQuery);
		 	
		 	if(getSearchTweetsQueryResult.next()) {
		 		JSONObject tempTweet = new JSONObject();
		 		tempTweet.put("usernmae", getSearchTweetsQueryResult.getString("username"));
		 		tempTweet.put("tweet", getSearchTweetsQueryResult.getString("tweet"));
		 		tempTweet.put("tweetid", getSearchTweetsQueryResult.getString("tweetid"));
		 		tempTweet.put("date_formatted", getSearchTweetsQueryResult.getString("date_formatted"));
		 		tempTweet.put("time", getSearchTweetsQueryResult.getString("time"));
		 		
		 		hashTweets.add(tempTweet);
		 		
		 		while(getSearchTweetsQueryResult.next()) {
		 			tempTweet = new JSONObject();
		 			
		 			tempTweet.put("usernmae", getSearchTweetsQueryResult.getString("username"));
			 		tempTweet.put("tweet", getSearchTweetsQueryResult.getString("tweet"));
			 		tempTweet.put("tweetid", getSearchTweetsQueryResult.getString("tweetid"));
			 		tempTweet.put("date_formatted", getSearchTweetsQueryResult.getString("date_formatted"));
			 		tempTweet.put("time", getSearchTweetsQueryResult.getString("time"));
		 			
		 			hashTweets.add(tempTweet);
		 		}
		 		
		 		result.put("statusCode", "200");
		 		result.put("results", hashTweets);
		 	} else {
		 		result.put("statusCode","401");
		 	}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return result.toString();
	}
	
	public String searchUser(int userid, String username, String searchUsername) {
		
		System.out.println("searchUser");
		JSONObject result = new JSONObject();
		JSONArray searchUser = new JSONArray();
		JSONArray followingArray = new JSONArray();
		
		System.out.println("searchUsername :: " + searchUsername);
		
		try{
			String searchUserQuery = "select userid, username, firstname, lastname from users where username like '%" + searchUsername + "%'";
			String getfollowingIdQuery = "select followingid from follow where followerid =" + userid;
			
			ResultSet searchUserQueryResult = getResultSet(searchUserQuery);
			ResultSet getfollowingIdQueryResult = getResultSet(getfollowingIdQuery);
			
			if(searchUserQueryResult.next()) {
				JSONObject tempUser = new JSONObject();
				
				tempUser.put("userid", searchUserQueryResult.getInt("userid"));
				tempUser.put("username", searchUserQueryResult.getString("username"));
				tempUser.put("firstname", searchUserQueryResult.getString("firstname"));
				tempUser.put("lastname", searchUserQueryResult.getString("lastname"));
				
				searchUser.add(tempUser);
				
				while(searchUserQueryResult.next()) {
					tempUser = new JSONObject();
					
					tempUser.put("userid", searchUserQueryResult.getInt("userid"));
					tempUser.put("username", searchUserQueryResult.getString("username"));
					tempUser.put("firstname", searchUserQueryResult.getString("firstname"));
					tempUser.put("lastname", searchUserQueryResult.getString("lastname"));
					
					searchUser.add(tempUser);
				}
				
				//result.put("statusCode", "200");
				result.put("searchresult", searchUser);
			}
			
			if(getfollowingIdQueryResult.next()) {
				JSONObject tempFollowing = new JSONObject();
				
				tempFollowing.put("followingid", getfollowingIdQueryResult.getInt("followingid"));
				
				followingArray.add(tempFollowing);
				
				while(getfollowingIdQueryResult.next()) {
					tempFollowing = new JSONObject();
					
					tempFollowing.put("followingid", getfollowingIdQueryResult.getInt("followingid"));
					
					followingArray.add(tempFollowing);
				}
				
				result.put("statusCode", "200");
				result.put("currentuserfollowing", followingArray);
				result.put("userid", userid);
				result.put("username", username);
				result.put("searchUsername", searchUsername);
			} else
				result.put("statusCode", "401");
		
		} catch(Exception e) {
			e.printStackTrace();
		}
		
		return result.toString();
	}
	
	public String deletefollowing(int userid, int deletefollowingid) {
		System.out.println("in deletefollowing");
		JSONObject result = new JSONObject();
		
		System.out.println("userid :: " + userid);
		System.out.println("deletefollowingid :: " + deletefollowingid);
		
		try{
			String deletefollowingidQuery = "delete from follow where followingid=" + deletefollowingid + " and followerid=" + userid;
			int deletefollowingidQueryResult = updateResultSet(deletefollowingidQuery);
			
			if(deletefollowingidQueryResult > 0) {
				result.put("statusCode", "200");
			} else {
				result.put("statusCode", "401");
			}
		} catch(Exception e) {
			e.printStackTrace();
		}
		
		return result.toString();
	}
	
	public String insertfollowing(int userid, int insertfollowingid) {
		System.out.println("in insertfollowing");
		JSONObject result = new JSONObject();
		
		System.out.println("userid :: " + userid);
		System.out.println("insertfollowingid :: " + insertfollowingid);
		
		try{
			String insertfollowingidQuery = "insert into follow (followerid, followingid) values(" + userid + "," + insertfollowingid + ")";
			int insertfollowingidQueryResult = updateResultSet(insertfollowingidQuery);
			
			if(insertfollowingidQueryResult > 0) {
				result.put("statusCode", "200");
			} else {
				result.put("statusCode", "401");
			}
		} catch(Exception e) {
			e.printStackTrace();
		}
		
		return result.toString();
	}
	
	public String getfollowing(int userid) {
		System.out.println("in getfollowing");
		
		JSONObject result = new JSONObject();
		JSONArray followingArray = new JSONArray();
		
		System.out.println("userid :: " + userid);

		String getFollowingIdQuery = "select followingid from follow where followerid=" + userid;
		String getFollowingDetailsQuery = "select userid, username, firstname, lastname from users where userid in (" + getFollowingIdQuery + ") order by firstname";
		
		try {
			ResultSet getfollowingResult = getResultSet(getFollowingDetailsQuery);
			
			if(getfollowingResult.next()) {
				JSONObject tempFollowing = new JSONObject();
				
				tempFollowing.put("userid", getfollowingResult.getInt("userid"));
				tempFollowing.put("username", getfollowingResult.getString("username"));
				tempFollowing.put("firstname", getfollowingResult.getString("firstname"));
				tempFollowing.put("lastname", getfollowingResult.getString("lastname"));
				
				followingArray.add(tempFollowing);
				
				while(getfollowingResult.next()) {
					tempFollowing = new JSONObject();
					
					tempFollowing.put("userid", getfollowingResult.getInt("userid"));
					tempFollowing.put("username", getfollowingResult.getString("username"));
					tempFollowing.put("firstname", getfollowingResult.getString("firstname"));
					tempFollowing.put("lastname", getfollowingResult.getString("lastname"));
					
					followingArray.add(tempFollowing);
				}
				
				result.put("statusCode", "200");
				result.put("following" , followingArray);
			} else {
				result.put("statusCode", "401");
			}
		} catch(Exception e) {
			e.printStackTrace();
		}
		
		return result.toString();
	}
	
	public String getfollower(int userid) {
		System.out.println("in getfollower");
		
		JSONObject result = new JSONObject();
		JSONArray followerArray = new JSONArray();
		JSONArray followingArray = new JSONArray();
		
		System.out.println("userid :: " + userid);

		String getFollowerIdQuery = "select followerid from follow where followingid=" + userid;
		String getFollowerDetailsQuery = "select userid, username, firstname, lastname from users where userid in (" + getFollowerIdQuery + ") order by firstname";
		
		String getFollowingIdQuery = "select followingid from follow where followerid=" + userid;
		String getFollowingDetailsQuery = "select userid, username, firstname, lastname from users where userid in (" + getFollowingIdQuery + ") order by firstname";
		
		try {
			ResultSet getfollowerResult = getResultSet(getFollowerDetailsQuery);
			//ResultSet getfollowingResult = getResultSet(getFollowingDetailsQuery);
			
			if(getfollowerResult.next()) {
				JSONObject tempFollower = new JSONObject();
				
				tempFollower.put("userid", getfollowerResult.getInt("userid"));
				tempFollower.put("username", getfollowerResult.getString("username"));
				tempFollower.put("firstname", getfollowerResult.getString("firstname"));
				tempFollower.put("lastname", getfollowerResult.getString("lastname"));
				
				followerArray.add(tempFollower);
				
				while(getfollowerResult.next()) {
					tempFollower = new JSONObject();
					
					tempFollower.put("userid", getfollowerResult.getInt("userid"));
					tempFollower.put("username", getfollowerResult.getString("username"));
					tempFollower.put("firstname", getfollowerResult.getString("firstname"));
					tempFollower.put("lastname", getfollowerResult.getString("lastname"));
					
					followerArray.add(tempFollower);
				}
				
				//result.put("statusCode", "200");
				result.put("follower" , followerArray);
			}
			
			try {
				ResultSet getfollowingResult = getResultSet(getFollowingDetailsQuery);
				
				if(getfollowingResult.next()) {
					JSONObject tempFollowing = new JSONObject();
					
					tempFollowing.put("userid", getfollowingResult.getInt("userid"));
					tempFollowing.put("username", getfollowingResult.getString("username"));
					tempFollowing.put("firstname", getfollowingResult.getString("firstname"));
					tempFollowing.put("lastname", getfollowingResult.getString("lastname"));
					
					followingArray.add(tempFollowing);
					
					while(getfollowingResult.next()) {
						tempFollowing = new JSONObject();
						
						tempFollowing.put("userid", getfollowingResult.getInt("userid"));
						tempFollowing.put("username", getfollowingResult.getString("username"));
						tempFollowing.put("firstname", getfollowingResult.getString("firstname"));
						tempFollowing.put("lastname", getfollowingResult.getString("lastname"));
						
						followingArray.add(tempFollowing);
					}
					
					result.put("statusCode", "200");
					result.put("following" , followingArray);
				} else {
					result.put("statusCode", "401");
				}
			} catch(Exception e) {
				e.printStackTrace();
			}
			
		} catch(Exception e) {
			e.printStackTrace();
		}
		
		return result.toString();
	}
	
	public String doTweet(int userid, String tweet) {
		
		System.out.println("in doTweet");
		JSONObject result = new JSONObject();
		
		System.out.println("userid :: " + userid);
		System.out.println("tweet :: " + tweet);
		/*System.out.println("taglistarray :: " + taglistarray);*/
		
		String doTweetQuery = "insert into tweets (userid, tweet, date, time) values (" + userid + ",'" + tweet + "', CURDATE(), CURTIME())";
		System.out.println("doTweetQuery :: " + doTweetQuery);
		
		String[] taglistarray = tweet.split(" ");
		for(int i = 0; i < taglistarray.length; i++){
			System.out.println("taglistarray[  " + i + " ] :: " + taglistarray[i]);
			System.out.println("substring :: "+ taglistarray[i].substring(0, 1));
			if(taglistarray[i].substring(0, 1).equals("#")){
				String getTweetIdQuery = "select max(tweetid) from tweets where userid=" + userid;
				String insertTagQuery = "insert into hashtag (tweetid, hashtagstring) values((" + getTweetIdQuery + "),'" + taglistarray[i] + "')";
				System.out.println("insertTagQuery :: " + insertTagQuery);
				try{
					int insertTagQueryResult = updateResultSet(insertTagQuery);
					System.out.println("insertTagQueryResult [" + i + "]:: " + insertTagQueryResult);
					if(insertTagQueryResult <= 0)
						throw new Exception("Can Not store hashtag");
				} catch(Exception e) {
					e.printStackTrace();
				}
				
			}
		}
		try {
			
			int doTweetQueryResult = updateResultSet(doTweetQuery);
			
			System.out.println("doTweetQueryResult :: " + doTweetQueryResult);
			
			if(doTweetQueryResult > 0)
				result.put("statusCode", "200");
			else
				result.put("statusCode", "401");
		} catch(Exception e) {
			e.printStackTrace();
		}
		
		return result.toString();
	}
	
}
