package com.home;

import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.jws.WebService;

import org.json.simple.JSONObject;

import com.mysql.jdbc.Connection;
import com.mysql.jdbc.Statement;

@WebService
public class Home {
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

		/*try {
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
	
	
	public String checkLogin(String email, String password){
		System.out.println("email :: " + email);
		System.out.println("password :: " + password);
		
		JSONObject result = new JSONObject();
		try {
			
			String checkLoginQuery = "select username,userid,email from users where email = '" + email + "'";
			
			System.out.println("checkLoginQuery :: " + checkLoginQuery);
			
			ResultSet user = getResultSet(checkLoginQuery);
			
			String username;
			int userid;
			
			if(user.next()) {
				System.out.println("Successful Login");
				
				username = user.getString("username");
				userid = user.getInt("userid");
				
				System.out.println("username :: " + username);
				System.out.println("userid :: " + userid);
				
				result.put("statusCode", "200");
				result.put("username", username);
				result.put("userid", userid);
				result.put("email", email);
			} else {
				result.put("statusCode", 401);
			}
			
		} catch(Exception e) {
			e.printStackTrace();
		}
		
		return result.toString();
	}
	
	public String dosignup(String username, String password, String firstname, String lastname, String email, String gender, String birthdate, String contact, String location) {
		
		System.out.println("in dosignup");
		
		JSONObject result = new JSONObject();
		
		try {
			String checkUsernameQuery = "select username from users where username = '" + username + "'";
			System.out.println("checkUsernameQuery :: " + checkUsernameQuery);
			
			ResultSet user = getResultSet(checkUsernameQuery);
			
			String checkEmailExistQuery = "select email from users where email = '" + email + "'";
			System.out.println("checkEmailExistQuery :: " + checkEmailExistQuery);
			
			ResultSet checkEmailExistResult = getResultSet(checkEmailExistQuery);
			
			if(user.next()) { //Username Exists
				if(checkEmailExistResult.next()){ //Username and Email exist
					result.put("statusCode", "200");
					result.put("isEmailExist", true);
					result.put("isUsernameExist", true);
				} else { //Username exists, but email doesn't exist
					result.put("statusCode", "200");
					result.put("isEmailExist", false);
					result.put("isUsernameExist", true);
				}
				
			} else { //Username doesn't exist
				
				if(checkEmailExistResult.next()){ //Username doesn't exist but Email exist
					result.put("statusCode", "200");
					result.put("isEmailExist", true);
					result.put("isUsernameExist", false);
				} else { //username and email doesn't exist
					
					
					String doSignUpQuery = "INSERT INTO users (username, password, firstname, lastname, email, gender, birthdate, location, contact) VALUES ('" + username + "','" + password + "','" + firstname + "','" + lastname + "','" + email + "','" + gender + "','" + birthdate + "','" + location + "','" + contact  + "')";
					System.out.println("doSignUpQuery :: " + doSignUpQuery);
					
					int doSignUp = updateResultSet(doSignUpQuery);
					System.out.println("result of doSignUp :: " + doSignUp);
					
					result.put("statusCode", "401");
				}
			}
			
		} catch(Exception e) {
			e.printStackTrace();
		}
		
		System.out.println("result :: " + result.toString());
		return result.toString();
	}
	
	public String gettweetfollowerfollowingcount(int userid) {
		JSONObject result = new JSONObject();
		
		String gettweetCountQuery = "select (count1 + count2) as countoftweets from (select count(DISTINCT tweets.tweet) as count1, count(DISTINCT retweets.tweetid) as count2 from tweets, retweets where tweets.userid=" + userid + " and retweets.retweeterid="+ userid + " group by tweets.userid, retweets.retweeterid) as t";
		String getfollowerCountQuery = "select count(followerid) as countoffollower from follow where followingid=" + userid;
		String getfollowingcountQuery = "select count(followingid) as countoffollowing from follow where followerid=" + userid;
		try{
			ResultSet tweetCountResult = getResultSet(gettweetCountQuery);
			ResultSet followerCountResult = getResultSet(getfollowerCountQuery);
			ResultSet followingCountResult = getResultSet(getfollowingcountQuery);
			int tweetCount = 0;
			int followerCount = 0; 
			int followingCount = 0;
			
			if(tweetCountResult.next()){
				tweetCount = tweetCountResult.getInt("countoftweets");
				System.out.println("tweetCount :: " + tweetCount);
			}
			
			if(followerCountResult.next()){
				followerCount = followerCountResult.getInt("countoffollower");
				System.out.println("followerCount :: " + followerCount);
			}
			
			if(followingCountResult.next()){
				followingCount = followingCountResult.getInt("countoffollowing");
				System.out.println("followerCount :: " + followingCount);
			}
			
			result.put("statusCode", "200");
			result.put("tweetcount", tweetCount);
			result.put("followercount", followerCount);
			result.put("followingcount", followingCount);
			
		} catch(Exception e) {
			e.printStackTrace();
		}
		
		return result.toString();
	}
}
