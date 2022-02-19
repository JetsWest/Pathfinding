/*
 * Copyright (C) 2021 Kevin Zatloukal.  All rights reserved.  Permission is
 * hereby granted to students registered for University of Washington
 * CSE 331 for use solely during Spring Quarter 2021 for purposes of
 * the course.  No other use, copying, distribution, or modification
 * is permitted without prior written consent. Copyrights for
 * third-party components of this work must be honored.  Instructors
 * interested in reusing these course materials should contact the
 * author.
 */

package campuspaths;

import campuspaths.utils.CORSFilter;
import com.google.gson.Gson;
import pathfinder.CampusMap;
import pathfinder.datastructures.Path;
import pathfinder.datastructures.Point;
import spark.Spark;

public class SparkServer {

    public static void main(String[] args) {
        CORSFilter corsFilter = new CORSFilter();
        corsFilter.apply();
        // The above two lines help set up some settings that allow the
        // React application to make requests to the Spark server, even though it
        // comes from a different server.
        // You should leave these two lines at the very beginning of main().

        // Stores the Campus Map to be used
        CampusMap campusMap = new CampusMap();

        // Return a JSON string containing the path from start to end using CampusMap
        Spark.get("/pathfinding", (request, response) -> {
            String start = request.queryParams("start");
            String end = request.queryParams("end");
            if (start == null || end == null) {
                Spark.halt(400, "Must have start building and end building.");
            }
            Path<Point> path = campusMap.findShortestPath(start, end);
            Gson gson = new Gson();
            return gson.toJson(path);
        });

        // Return a JSON string of all buildings using CampusMap
        Spark.get("/buildings", (request, response) -> {
            Gson gson = new Gson();
            return gson.toJson(campusMap.buildingNames());
        });
    }

}
