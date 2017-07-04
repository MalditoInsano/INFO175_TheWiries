import java.sql.*; 
import java.util.*;

/**
 * Esta clase implementa metodos de conexión y consulta a una base de datos.
 * 
 * @author Julio Guerra
 *
 */
public class DBInterface {
	protected String dbString;
	protected String dbUser;
	protected String dbPass;
	
	protected Connection conn;
	protected Statement stmt = null; 
	protected ResultSet rs = null;
	
	public DBInterface(String connurl, String user, String pass){
		dbString = connurl;
		dbUser = user;
		dbPass = pass;
	}
	
	public boolean openConnection() {
		try{
			
			Class.forName("com.mysql.jdbc.Driver").newInstance();
			
			conn = DriverManager.getConnection(dbString + "?" + "user=" + dbUser + "&password=" + dbPass);
			if (conn!=null){
				return true;
			}
		}catch (SQLException ex) {
			System.out.println("SQLException: " + ex.getMessage()); 
			System.out.println("SQLState: " + ex.getSQLState()); 
			System.out.println("VendorError: " + ex.getErrorCode());
			return false;
		}catch (Exception ex) {
			ex.printStackTrace();
			return false;
		}
		return true; 
	}
	
	public void closeConnection() {
		releaseStatement(stmt, rs);
		if (conn != null) {
			try {
				conn.close();
			}catch (SQLException sqlEx) { } 
		}
	}
	
	
	public void releaseStatement(Statement stmt, ResultSet rs) {
		if (rs != null) {
			try { 
				rs.close();
			}catch (SQLException sqlEx) { sqlEx.printStackTrace(); } 
			rs = null;
		}
		if (stmt != null) {
			try {
				stmt.close();
			}catch (SQLException sqlEx) { sqlEx.printStackTrace(); } 
			stmt = null;
		}
	}
	
	/**
	 * Ejemplo de metodo que hace una consulta a la base de datos
	 * (esta es una consulta de pruebas, que solo trae información parcial
	 * @return
	 */
	
	public ArrayList<String[]> getSampleData() {
		try {
			ArrayList<String[]> res = new ArrayList<String[]>();
			stmt = conn.createStatement();
			
			String query = "select S.treatments_16 as n_group, A.topicname as id, "
					+ "count(*) as activity, count(distinct(A.`user`)) as `users`, "
					+ "sum(if(A.appid=41,1,0)) as quizpet_act, "
					+ "sum(if(A.appid=41 and  A.result=1,1,0)) as quizpet_act_correct, "
					+ "sum(if(A.appid=38,1,0)) as parsons_act, "
					+ "sum(if(A.appid=38 and A.result=1,1,0)) as parsons_act_succ, "
					+ "sum(if(appid=35,1,0)) as animatedexamples_act, "
					+ "sum(if(appid=3,1,0)) as webex_act, "
					+ "sum(if(appid=35,1,0)) as animatedexamples_act "
					+ "from activity_traces A, student_info S "
					+ "where A.appid > -1 and S.userid = A.`user` "
					+ "group by S.treatments_16, A.topicname;";
			
			rs = stmt.executeQuery(query);

			// rs contiene una estructura de tipo SET que contiene todas
			// las filas de la respuesta de la base de datos
			
			while (rs.next()) {
				String[] dataPoint = new String[9];
				dataPoint[0] = rs.getString("n_group"); // rs.getString obtiene el valor String de un campo especifico consultado, en este caso el campo "user". Notar que este nombre de campodebe coincidir con los campos en la consulta (SELECT `user`, ...) 
				dataPoint[1] = rs.getString("id");
				dataPoint[2] = rs.getString("activity");
				dataPoint[3] = rs.getString("quizpet_act");
				dataPoint[4] = rs.getString("quizpet_act_correct");
				dataPoint[5] = rs.getString("parsons_act");
				dataPoint[6] = rs.getString("parsons_act_succ");
				dataPoint[7] = rs.getString("webex_act");
				dataPoint[8] = rs.getString("animatedexamples_act");
				
				res.add(dataPoint);
			}
			this.releaseStatement(stmt, rs);
			return res;
		}
		
		catch (Exception ex) {
			System.out.println("Exception: " + ex.getMessage());
			this.releaseStatement(stmt, rs);
			return null;
		}
	}
	
}