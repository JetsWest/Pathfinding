import React, {Component} from 'react';

interface BuildingListProps {
    onChange(path: [[number, number], [number, number]][]): void; // called when a new path is ready
    changeList(list: string[]): any;                              // called when the user clicks "list buildings"
}

interface BuildingListState {
    value1: string; // text to display in the text area "Start Building"
    value2: string; // text to display in the text area "Destination Building"
    key: string;   // text that holds the map's key information
}

/**
 *  A text field that allows the user to enter the buildings.
 *  Also contains the buttons that the user will use to interact with the app.
 */
class BuildingList extends  Component<BuildingListProps, BuildingListState> {

    constructor(props:BuildingListProps) {
        super(props);
        // We initially set the state value1 and value2 to hold the empty string, as the user has entered no buildings.
        // We also initialize the key to hold the empty string as the user has no need to see the map key.
        this.state={
          value1: "",
            value2: "",
            key: "",
        };
    }

    // When the input in "Start Building" changes, we track that using the state
    onInputChangeFirst = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({value1: event.target.value});
    }

    // When the input in "Destination Building" changes, we track that using the state
    onInputChangeSecond = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({value2: event.target.value});
    }

    // If the user presses "Find path", we begin this process
    buttonHandlerPath = async () => {
        // We grab the input from each text box, and move it into a string array
        let a:string[] = [];
        a.push(this.state.value1);
        a.push(this.state.value2);
        // If the user does not enter the text properly, we alert them, and break out of the function
        if (a.length !== 2 || !a[0].match("^[^\\s]+(\\s+[^\\s]+)*$") || !a[1].match("^[^\\s]+(\\s+[^\\s]+)*$")) {
            alert("There was an error with some of your line input.\n" +
                "For reference, you should enter one building into each text box.")
            return;
        }
        // We begin a try-catch in order to make sure the Spark server is online
        try {
            // We use the Spark server to find a path using the user input
            let response = await fetch("http://localhost:4567/pathfinding?start=" + a[0] + "&end=" + a[1]);
            // If the user does not enter a valid building, we alert them to look at the list of valid inputs, while
            // also giving them the Spark response code
            if (!response.ok) {
                alert("The status is wrong! Expected 200, Was: " + response.status +
                    "\nIt seems you may have entered a building wrong! Press \"List Buildings\" " +
                        "to see the valid buildings.");
                return;
            }
            // We get the response string from the spark server
            let text = await response.text();
            // We convert this JSON string into a JavaScript object so we can get specific fields
            const conversion = JSON.parse(text);
            // Double tuple array where each element in buildings represents one path
            let buildings:[[number, number], [number, number]][] = [];
            // We make sure to loop through only the "path" portion of the JSON
            for (let i = 0; i < conversion["path"].length; i++) {
                // We grab the specific JSON fields in order to get the start and end points, and push that into buildings
                let start:[number, number] = [conversion["path"][i]["start"]["x"], conversion["path"][i]["start"]["y"]];
                let end:[number, number] = [conversion["path"][i]["end"]["x"], conversion["path"][i]["end"]["y"]];
                let thisPath:[[number, number], [number, number]] = [start, end];
                buildings.push(thisPath);
            }
            // As the user has pressed "Find Path", we now show the Map key and start the drawing process
            this.setState({key: "Map Key: White - Start Location, Blue - End Location"});
            this.props.onChange(buildings);
        } catch (e) {
            alert("There was an error contacting the server.");
            console.log(e);
        }
    }

    // If the user presses "List Buildings", we begin this process
    buttonHandlerList = async () => {
        // We begin a try-catch in order to make sure the Spark server is online
        try {
            // We use the Spark server to list the buildings
            let response = await fetch("http://localhost:4567/buildings");
            // If the Spark server has an error, we alert the user
            if (!response.ok) {
                alert("The status is wrong! Expected 200, Was: " + response.status);
                return;
            }
            // We then parse the JSON string into a JavaScript object
            let text = await response.text();
            const conversion = JSON.parse(text);
            // We then pass this JS Object into a string array to be displayed later, and sort the
            // array to display the strings alphabetically
            let textList = [];
            for (let i in conversion) {
                textList.push(i + " = " + conversion[i]);
            }
            textList.sort();
            // When we list the buildings, we clear the drawing on the map for when the user comes back
            this.props.onChange([]);
            this.props.changeList(textList);
        } catch (e) {
            alert("There was an error contacting the server.");
            console.log(e);
        }
    }

    // If the user presses "clear", we empty both text boxes and hide the key, and pass an empty array
    // to MapView (so that way it draws nothing)
    buttonHandlerClear = () => {
        this.props.onChange([]);
        this.setState({value1: "", value2: "", key: ""});
    }

    render() {
        return(
            <div id="building-list">
                <div>
                    Start Building <br/>
                    <textarea
                        rows={2}
                        cols={20}
                        value={this.state.value1}
                        onChange={this.onInputChangeFirst}
                    />
                </div>
                <div>
                    Destination Building <br/>
                    <textarea
                        rows={2}
                        cols={20}
                        value={this.state.value2}
                        onChange={this.onInputChangeSecond}
                    />
                    <br/>
                </div>
                <button onClick={this.buttonHandlerPath}>Find Path</button>
                <button onClick={this.buttonHandlerList}>List Buildings</button>
                <button onClick={this.buttonHandlerClear}>Clear</button>
                <p id="map-key">{this.state.key}</p>
            </div>
        );
    };
}

export default BuildingList;