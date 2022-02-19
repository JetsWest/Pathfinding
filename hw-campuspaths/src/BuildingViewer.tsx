import React, {Component} from 'react';

interface BuildingViewerProps {
    list: string[];   // list of buildings to be shown
    onBack: ()=> any; // called when the user wants to go back to the main program
}

/**
 * Displays the list of valid buildings and allows the user to go back to the main program
 */
class BuildingViewer extends Component<BuildingViewerProps,{}> {

   render() {
       // We add all of the buildings into an array as <li> HTML tags. This allows us
       // to display them in a neat list rather than in a wall of text
       let buildings: any[] = [];
       for (let i = 0; i < this.props.list.length; i++) {
           buildings.push(
               <li key={this.props.list[i]}>{this.props.list[i]}</li>
           );
       }

       // Note that we ask the user to only use the short names of the buildings. This allows us to not have to
       // convert long names to short names.
       return(
           <div id={"building-viewer"}>
               <p id={"building-header"}>List of Buildings</p> <br/>
               <p>This is a list of valid buildings.</p>
               <p>Please use buildings on the left side of the = as your input.</p>
               <button onClick={this.props.onBack}>Back</button>
               <ul>{buildings}</ul>
           </div>
       );
   }
}

export default BuildingViewer;