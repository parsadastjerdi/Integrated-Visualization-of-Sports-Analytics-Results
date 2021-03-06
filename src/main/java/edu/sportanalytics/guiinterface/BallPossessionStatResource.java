package edu.sportanalytics.guiinterface;

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

import edu.sportanalytics.database.DBAccess;
import edu.sportanalytics.database.SoccerController;
import edu.sportanalytics.database.SportsEnum;

@Path("BallPossessionStatResource")
public class BallPossessionStatResource {

	private static final Logger log = Logger.getLogger(BallPossessionStatResource.class.getName());

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getData(@QueryParam("token") int token) {
		Token tk = Token.getToken(token);
		if(tk.getSports() == SportsEnum.BASKETBALL)
		{
			return "null";
		}

		SoccerController sc = (SoccerController) DBAccess.getInstance().getController(SportsEnum.SOCCER);
		List<String> possessionList = new ArrayList<>();
		if (tk.getSeason().equals("null")) {
			return "null";
		} else if (tk.getMatch().equals("null")) {
			return "null";
		} else {
			possessionList = sc.getStatMatch(tk.getMatchID(),"possession");
		}

		if(possessionList == null)
		{
			return "null";
		}
		JSONObject jo = new JSONObject();
		jo.put("possession", possessionList);

		String returnString = jo.toString();

		log.info("JSON String created: " + returnString);

		return returnString;
	}

}
