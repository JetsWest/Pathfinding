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

import React, {Component} from 'react';
import MapView from "./MapView";
import BuildingList from "./BuildingList";

// Allows us to write CSS styles in App.css, and any styles will apply to all components inside <App />
import "./App.css"
import BuildingViewer from "./BuildingViewer";

interface AppState {
    path: [[number, number], [number, number]][]; // list of paths to be used
    list: string[] | undefined; // list of buildings OR undefined if the user has not clicked "list buildings"
}

/**
 * Top-level application that lets the user find a path between two buildings on the UW campus and
 * view a list of valid buildings to be used as inputs
 */
class App extends Component<{}, AppState> { // <- {} means no props

    constructor(props: any) {
        super(props);
        this.state = {
            path: [],
            list: undefined
        };
    }

    updateBuildingList = (pathList: [[number,number], [number, number]][]) => {
        this.setState({
            path: pathList
        });
    }

    showList = (list: string[]) => {
        this.setState({list: list});
    }

    back = () => {
        this.setState({list: undefined});
    }

    render() {
        // List is only undefined on the main screen
        if (this.state.list === undefined) {
            return (
                <div>
                    <p id={"app-title"}>Campus Pathfinding!</p>
                    <BuildingList onChange={this.updateBuildingList} changeList={this.showList}/>
                    <MapView path={this.state.path}/>
                </div>
            );
        } else { // We show the user the list of buildings
            return (
                <div>
                    <BuildingViewer list={this.state.list} onBack={this.back}/>
                </div>
            );
        }
    }

}

export default App;
