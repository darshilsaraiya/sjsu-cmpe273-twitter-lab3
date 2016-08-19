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
public class Profile {
	
	protected Connection getConnection() throws SQLException {
		try {
			Class.forName("com.mysql.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			System.out.println("Where is your MySQL JDBC Driver?");
			e.printStackTrace();
		}

		//Connection Pooling
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
	
	public String getprofiledetails(String email) {
		System.out.println("in getprofiledetails");
		
		JSONObject result = new JSONObject();
	
		try {
			String getprofiledetailsQuery = "select userid, username, firstname, lastname, email, gender, birthdate, location, contact from users where email = '" + email + "'";
			System.out.println("getprofiledetailsQuery :: " + getprofiledetailsQuery);
		
			ResultSet getprofiledetailsResult = getResultSet(getprofiledetailsQuery);
			
			if(getprofiledetailsResult.next()) {
				result.put("statusCode", "200");
				result.put("userid", getprofiledetailsResult.getInt("userid"));
				result.put("username", getprofiledetailsResult.getString("username"));
				result.put("firstname", getprofiledetailsResult.getString("firstname"));
				result.put("lastname", getprofiledetailsResult.getString("lastname"));
				result.put("email", getprofiledetailsResult.getString("email"));
				result.put("gender", getprofiledetailsResult.getString("gender"));
				result.put("birthdate", getprofiledetailsResult.getString("birthdate"));
				result.put("location", getprofiledetailsResult.getString("location"));
				result.put("contact", getprofiledetailsResult.getString("contact"));
			} else {
				result.put("statusCode", 401);
			}
		} catch(Exception e) {
			e.printStackTrace();
		}
		
		return result.toString();
	}
	
	public String getUserTweetsDetails(int userid) {
		System.out.println("getUserTweetsDetails");
		JSONArray userTweets = new JSONArray();
		JSONObject result = new JSONObject();
		
		System.out.println("userid :: " + userid);
		
		//String getUserTweetsDetailsQuery = "select * from ((select ownerid as userid, tweets.tweet,DATE_FORMAT(retweets.date,'%d/%m/%Y') as date_formatted,retweets.time as time from tweets, retweets where retweets.tweetid = tweets.tweetid and retweeterid=" + userid + ") UNION (select userid, tweet,DATE_FORMAT(date,'%d/%m/%Y') as date_formatted,time as time from tweets where userid=" + userid + ")) as t order by date_formatted DESC, time DESC";
		String getUserTweetsDetailsQuery = "select t.userid, t.tweet, t.date_formatted, t.time, users.firstname, users.lastname from ((	select ownerid as userid, tweets.tweet,DATE_FORMAT(retweets.date,'%d/%m/%Y') as date_formatted,retweets.time as time from tweets, retweets  where retweets.tweetid = tweets.tweetid and retweeterid= " + userid +") UNION (select userid, tweet,DATE_FORMAT(date,'%d/%m/%Y') as date_formatted,time as time from tweets where userid= " + userid + ")) as t JOIN users on (t.userid = users.userid) order by date_formatted DESC, time DESC";
		System.out.println("getUserTweetsDetailsQuery :: " + getUserTweetsDetailsQuery);
		
		try {
			
			ResultSet getUserTweetsDetailsResult = getResultSet(getUserTweetsDetailsQuery);
			if(getUserTweetsDetailsResult.next()){
				while(getUserTweetsDetailsResult.next()) {
					JSONObject tempTweet = new JSONObject();
					tempTweet.put("userid", getUserTweetsDetailsResult.getInt("userid"));
					tempTweet.put("tweet", getUserTweetsDetailsResult.getString("tweet"));
					tempTweet.put("date_formatted", getUserTweetsDetailsResult.getString("date_formatted"));
					tempTweet.put("time", getUserTweetsDetailsResult.getString("time"));
					tempTweet.put("firstname", getUserTweetsDetailsResult.getString("firstname"));
					tempTweet.put("lastname", getUserTweetsDetailsResult.getString("lastname"));
					userTweets.add(tempTweet);
				}
				result.put("statusCode", "200");
				result.put("userTweets",userTweets);
			} else {
				result.put("statusCode", "401");
			}
			
		} catch(Exception e) {
			e.printStackTrace();
		}
		return result.toString();
	}
}
