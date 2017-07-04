import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@WebServlet("/GetDataByGroup")
public class GetDataByGroup extends HttpServlet {
	private static final long serialVersionUID = 1L;
    private DBInterface dbInterface; // dbInterface es para conectarse a la base de datos

    public GetDataByGroup() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		// Usamos esta clase ConfigManager para leer y cargar variables de configuración 
		// definidas en el archivo config.xml
		ConfigManager cm = new ConfigManager(this);
		
		// Un ejemplo de cómo capturar un parametro de url. Si el paramtero no viene en la url, a la variable se le asignará null
		String userId = request.getParameter("userid");
		
		// otro ejemplo de paramtero entero donde hay involucrada una conversión a int. Al final
		// resulta más fácil manejar la exception que tratar de validar de otra forma
		int limit = -1;
		try {
			limit = Integer.parseInt(request.getParameter("limit"));
		}
		catch(Exception e){
			limit = -1;
		}
		
		// Se inicializa el objeto de conexión a la base de datos
		dbInterface = new DBInterface(cm.dbString, cm.dbUser, cm.dbPass);
		dbInterface.openConnection(); // abrir la conexión
		
		// llamada a la función getSampleData que hace la consulta a la base de datos
		ArrayList<String[]> data = dbInterface.getSampleData(); 
		dbInterface.closeConnection(); // cerrar la conexión
		
		// obtener el objeto flujo de salida (para imprimir la respuesta)
		PrintWriter out = response.getWriter();
		
		// escribir la respuesta
		out.print(outAsJSON(data));
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request,response);
	}
	
	/**
	 * Este metodo escribe en formato JSON la data obtenida desde la base de datos
	 * 
	 * @param data
	 * @return
	 */
	private String outAsJSON(ArrayList<String[]> data) {
		String outString = "[";
		for(String[] row : data) {
			outString += "\n "
					+ "   {\"n_group\":\"" + row[0]
					+ "\", \"id\":\"" + row[1]
					+ "\", \"activity\":\"" + row[2]
					+ "\", \"quizpet_act\":\"" + row[3]
					+ "\", \"quizpet_act_correct\":\"" + row[4]
					+ "\", \"parsons_act\":\"" + row[5]
					+ "\", \"parsons_act_succ\":\"" + row[6]
					+ "\", \"webex_act\":\"" + row[7]
					+ "\", \"animatedexamples_act\":\"" + row[8]
					+ "\"},";
					
		}
		outString = outString.substring(0, outString.length() - 1);
		outString += "\n]";
		return outString;
	}

}