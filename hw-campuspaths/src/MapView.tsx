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
import "./MapView.css";

interface MapViewProps {
    path: [[number, number], [number, number]][]; // list of paths to be drawn
}

interface MapViewState {
    backgroundImage: HTMLImageElement | null; // image object rendered into the canvas (once loaded)
}

/**
 *  A view of the University of Washington campus and the pathfinding
 *  portion of the program.
 */

class MapView extends Component<MapViewProps, MapViewState> {

    // NOTE:
    // This component is a suggestion for you to use, if you would like to.
    // It has some skeleton code that helps set up some of the more difficult parts
    // of getting <canvas> elements to display nicely with large images.
    //
    // If you don't want to use this component, you're free to delete it.

    canvas: React.RefObject<HTMLCanvasElement>;

    constructor(props: MapViewProps) {
        super(props);
        this.state = {
            backgroundImage: null // An image object to render into the canvas
        };
        this.canvas = React.createRef();
    }

    componentDidMount() {
        // Since we're saving the image in the state and re-using it any time we
        // redraw the canvas, we only need to load it once, when our component first mounts.
        this.fetchAndSaveImage();
        this.redraw();
    }

    componentDidUpdate() {
        // We redraw the image when it updates
        this.redraw();
    }

    fetchAndSaveImage() {
        // Creates an Image object, and sets a callback function
        // for when the image is done loading (it might take a while).
        let background: HTMLImageElement = new Image();
        background.onload = () => {
            this.setState({
                backgroundImage: background
            });
        };
        // Once our callback is set up, we tell the image what file it should
        // load from. This also triggers the loading process.
        background.src = "./campus_map.jpg";
    }

    drawBackgroundImage() {
        let canvas = this.canvas.current;
        if (canvas === null) throw Error("Unable to draw, no canvas ref.");
        let ctx = canvas.getContext("2d");
        if (ctx === null) throw Error("Unable to draw, no valid graphics context.");

        if (this.state.backgroundImage !== null) { // This means the image has been loaded.
            // Sets the internal "drawing space" of the canvas to have the correct size.
            // This helps the canvas not be blurry.
            canvas.width = this.state.backgroundImage.width;
            canvas.height = this.state.backgroundImage.height;
            ctx.drawImage(this.state.backgroundImage, 0, 0);
        }
    }

    redraw = () => {
        // We first start by drawing the background image. All of the error
        // checking and clearing of the image is done in this function.
        this.drawBackgroundImage();

        if (this.canvas.current === null) {
            throw new Error("Unable to access canvas.");
        }

        const ctx = this.canvas.current.getContext('2d');
        if (ctx === null) {
            throw new Error("Unable to create canvas drawing context.");
        }

        // Draw all of the paths
        for (let path of this.props.path) {
            this.drawLine(ctx, path);
        }

        // If the path is not empty (i.e. the user has clicked find path), we draw a circle
        // on the start and end point to show the user a clear path
        if (this.props.path.length > 0) {
            let start:[number, number] = this.props.path[0][0];
            let end:[number, number] = this.props.path[this.props.path.length-1][1];

            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(start[0], start[1], 20, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillStyle = "blue";
            ctx.beginPath();
            ctx.arc(end[0], end[1], 20, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    drawLine = (ctx: CanvasRenderingContext2D, path: [[number, number],[number, number]]) => {
        // We use a red line to make the path clear to see
        ctx.lineWidth = 10;
        ctx.strokeStyle = "red";
        ctx.beginPath();
        // We grab each of the specific coordinates, where path[0] is the starting point
        // and path[1] is the ending point
        let p1:[number, number] = path[0];
        let p2:[number, number] = path[1];
        // We don't need to convert these as we already use pixels as the measurements
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
    }

    render() {
        return (
            <canvas ref={this.canvas}/>
        )
    }
}

export default MapView;
