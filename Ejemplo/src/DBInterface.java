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
			String query = "select A.`user`, S.treatments_16 as vis,"
					+ "  sum(if(A.appid=41,1,0)) as q_att, "
					+ "  sum(if(A.appid=41 AND A.result=1,1,0)) as q_att_succ, "
					+ "  sum(if(A.appid=38,1,0)) as p_att, "
					+ "  sum(if(A.appid=38 AND result=1,1,0)) as p_att_succ, "
					+ "  count(distinct(if(A.appid=38,A.activityname,0)))-1 as dist_p_att, "
					+ "  count(distinct(if(A.appid=38 AND A.result=1,A.activityname,0)))-1 as dist_p_att_succ, "
					+ "  count(distinct(if(A.appid=3,A.parentname,0)))-1 as dist_e, "
					+ "  sum(if(A.appid=3,1,0)) as e_lines, "
					+ "  count(distinct(if(A.appid=35,A.parentname,0)))-1 as dist_ae, "
					+ "  sum(if(A.appid=35,1,0)) as ae_lines, "
					+ "  sum(if(A.appid=41,A.durationseconds,0)) as q_time, "
					+ "  sum(if(A.appid=38,A.durationseconds,0)) as p_time, "
					+ "  sum(if(A.appid=3,A.durationseconds,0)) as e_time, "
					+ "  sum(if(A.appid=35,A.durationseconds,0)) as ae_time "
					+ "from activity_traces A, student_info S "
					+ "where A.`user` = S.`userid` and A.durationseconds > 0 and A.appid > -1 "
					+ "group by S.treatments_16";
			rs = stmt.executeQuery(query);

			// rs contiene una estructura de tipo SET que contiene todas
			// las filas de la respuesta de la base de datos
			while (rs.next()) {
				String[] dataPoint = new String[14];
				dataPoint[0] = rs.getString("user"); // rs.getString obtiene el valor String de un campo especifico consultado, en este caso el campo "user". Notar que este nombre de campodebe coincidir con los campos en la consulta (SELECT `user`, ...) 
				dataPoint[1] = rs.getString("vis");
				dataPoint[2] = rs.getString("q_att");
				dataPoint[3] = rs.getString("q_att_succ");
				dataPoint[4] = rs.getString("p_att");
				dataPoint[5] = rs.getString("p_att_succ");
				dataPoint[6] = rs.getString("dist_e");
				dataPoint[7] = rs.getString("e_lines");
				dataPoint[8] = rs.getString("dist_ae");
				dataPoint[9] = rs.getString("ae_lines");
				dataPoint[10] = rs.getString("q_time");
				dataPoint[11] = rs.getString("p_time");
				dataPoint[12] = rs.getString("e_time");
				dataPoint[13] = rs.getString("ae_time");
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