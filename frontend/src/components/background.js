import { useEffect } from 'react'
import Matter from "matter-js";
import { useNavigate } from "react-router-dom";

/**
* create the backkground for login and start page
*/
export default function Comp() {
    
    //go backto dashboard if accessed from url rathen than being used as background
    if (window == window.top) {
        const navigate = useNavigate();
        useEffect(() => {
            navigate("/paint/dash/")
        }, []);

    } else {
        // module aliases
        var Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Mouse = Matter.Mouse,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite;

        // create an engine
        var engine = Engine.create();

        // create a renderer
        var render = Render.create({
            element: document.body,
            engine: engine,

            options: {
                wireframes: false,
                background: "bisque"

            }
        });

        //disable squares from falling down
        engine.world.gravity.y = 0;

        /**
        * recreate the shapes in the backkground
        */
        function St() {
            
            //create the borders
            Matter.World.clear(engine.world)
            render.canvas.height = window.innerHeight;
            render.canvas.width = window.innerWidth;
            var ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth + 200, 100, { isStatic: true, restitution: 0.9, friction: 0.5 });
            var rightwall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true, restitution: 0.9, friction: 0.5 });
            var leftwall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight, { isStatic: true, restitution: 0.9, friction: 0.5 });
            var celling = Bodies.rectangle(window.innerWidth / 2, -50, window.innerWidth + 200, 100, { isStatic: true, restitution: 0.9, friction: 0.5 });

            //determine the colors the decorative background squares can be of, and create the squares
            var randx;
            var color;
            var randy;
            var choices;
            var total = Math.round(window.innerHeight * window.innerWidth / 15000) + 5;
            for (var i = 0; i < total; i++) {
                randx = Math.random();
                randy = Math.random();
                color = Math.random() * 10;
                color = Math.floor(color);
                if (color == 9) {
                    choices = '#f19648';
                } else if (color == 8) {
                    choices = '#f5d259';
                } else if (color == 7) {
                    choices = '#f55a3c';
                } else if (color == 6) {
                    choices = '#063e7b';
                } else if (color == 5) {
                    choices = '#addfff';
                } else if (color == 4) {
                    choices = '#0a5c36';
                } else if (color == 3) {
                    choices = '#53277e';
                } else if (color == 2) {
                    choices = '#e3242b';
                } else if (color == 1) {
                    choices = 'white';
                } else if (color == 0) {
                    choices = '#fba0e3';
                }
                if (i < Math.round(total)) {
                    Composite.add(engine.world, Bodies.rectangle(randx + window.innerWidth / 2, randy + window.innerHeight / 2, 100, 100, { chamfer: { radius: 10 }, angle: Math.random() * 360, render: { fillStyle: choices, strokeStyle: "#2A2622", lineWidth: 7 }, }));
                }
            }

            // add all of the bodies to the world
            Composite.add(engine.world, [ground, rightwall, leftwall, celling]);
        }
        St();
        // run the renderer
        Render.run(render);

        // create runner
        var runner = Runner.create();

        // run the engine
        Runner.run(runner, engine);

        //recreate and reanimate the decorative squares and border when window size change
        window.addEventListener("resize", () => St());
    }
}
