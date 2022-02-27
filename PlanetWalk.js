import {defs, tiny} from './examples/common.js';
import { ShootingStars } from './ShootingStars.js';
import { Suns } from './Suns.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const {Cube, Phong_Shader, Textured_Phong,Subdivision_Sphere} = defs

export class PlanetWalk extends Scene {
    /**
     *  **Base_scene** is a Scene that can be added to any display canvas.
     *  Setup the shapes, materials, camera, and lighting here.
     */
    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        // TODO:  Create two cubes, including one with the default texture coordinates (from 0 to 1), and one with the modified
        //        texture coordinates as required for cube #2.  You can either do this by modifying the cube code or by modifying
        //        a cube instance's texture_coords after it is already created.
        this.suns = new Suns(); 
        this.shootingStars = new ShootingStars(); 

        this.shapes = {
            box_1: new Cube(),
            box_2: new Cube(), 
            Planet: new Subdivision_Sphere(4),
            character_body: new Subdivision_Sphere(4),
            character_head: new Subdivision_Sphere(4),
        }


        this.materials = {
            planet_surface: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
                ambient: 0.1, diffusivity: 0.5, specularity: 0.5,
            }),
            character: new Material(new Textured_Phong(), {
                ambient: 0.2,
                color: hex_color("000000"),
                texture: new Texture("assets/11.png")
            }),
            test: new Material(new Phong_Shader, {
                ambient: 0.1,
                diffusivity: 1
        })}

        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
        this.moveforward = false;
        this.movebackward = false;
        this.moveRight = false;
        this.moveLeft = false;
        this.currentAngle = 0;
    }

  
    drawShapes(listOfShapes, context, program_state, model_transform){
        listOfShapes.forEach((shape) => {

            if (shape.light){
                program_state.lights.push(new Light(vec4(shape.x,shape.y,shape.z, 1), color(1, 1, 1, 1), 100000 ));
            }

            model_transform = model_transform.times(Mat4.translation(shape.x,shape.y,shape.z));
            model_transform = model_transform.times(Mat4.scale(shape.size,shape.size,shape.size));
            this.shapes.Planet.draw(context, program_state, model_transform, shape.material.override({color: shape.color}));
           // program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
            model_transform = model_transform.times(Mat4.scale(1/shape.size,1/shape.size,1/shape.size));
            model_transform = model_transform.times(Mat4.translation(-1*shape.x,-1*shape.y,-1*shape.z));
        })
    }
    // control panel for movement back and forth
    make_control_panel() {
        // move forward with 'i', back with 'k'
        this.key_triggered_button("Character forward", ["i"], () => {
            this.moveforward = !this.moveforward;
        });

        this.key_triggered_button("Character backward", ["k"], () => {
            this.movebackward = !this.movebackward;
        });

        this.key_triggered_button("Character right", ["l"], () => {
            this.moveRight = !this.moveRight;
        });

        this.key_triggered_button("Character left", ["l"], () => {
            this.moveLeft = !this.moveLeft;
        });
    }

    display(context, program_state) {
        
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            //program_state.set_camera(Mat4.translation(0, -1.1, -1.6));
            program_state.set_camera(Mat4.look_at(vec3(0, 3 * Math.cos(this.currentAngle), 3 * Math.sin(this.currentAngle)),
                vec3(0, 1.1 * Math.cos(this.currentAngle),1.1 * Math.sin(this.currentAngle)),
                vec3(0, 3 * Math.cos(this.currentAngle + 90), 3 * Math.sin(this.currentAngle + 90))))
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        
        program_state.lights = [];

        let t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        let model_transform_planet = Mat4.identity();
        let model_transform_character = model_transform_planet;
        model_transform_character = model_transform_character.times(Mat4.scale(0.1,0.1,0.1));
        model_transform_character = model_transform_character.times(Mat4.rotation(this.currentAngle, 1, 0, 0))
            .times(Mat4.translation(0,11,0));

        const movement_velocity = 2;
        const movement_deceleration = -0.5;
        const g_constant = -9.8;

        if (this.moveforward) {
            //this.moveforward = !this.moveforward;
            let character_velocity = movement_velocity - movement_deceleration*t;
            let y_pos = character_velocity * t;
            console.log(model_transform_character);
            console.log(x_pos);
            model_transform_character = model_transform_character.times(Mat4.translation(0, y_pos, 0));
        }
        
        /*

        // Character matrices
        if (this.moveforward) {
            this.moveforward = 0;
            this.currentAngle += 0.1;
            // working on the camera stuff following the character

            let desired2 = Mat4.look_at(vec3(0, 3 * Math.cos(this.currentAngle), 3 * Math.sin(this.currentAngle)),
                vec3(0, 1.1 * Math.cos(this.currentAngle),1.1 * Math.sin(this.currentAngle)),
                vec3(0, 3 * Math.cos(this.currentAngle + 90), 3 * Math.sin(this.currentAngle + 90)));

            program_state.set_camera(desired2.map((x, i) =>
            Vector.from(program_state.camera_inverse[i]).mix(x, 0.1)));

            //program_state.set_camera(Mat4.look_at(vec3(0, 3 * Math.cos(this.currentAngle), 3 * Math.sin(this.currentAngle)),
                     //vec3(0, 1.1 * Math.cos(this.currentAngle),1.1 * Math.sin(this.currentAngle)),
                     //vec3(0, 3 * Math.cos(this.currentAngle), 3 * Math.sin(this.currentAngle))));
            // this.character_model_transform = this.character_model_transform.times(Mat4.rotation(1, 0, -1, 0))
            //     .times(Mat4.translation());
            //let desired = model_transform_character.times(Mat4.translation(0, 3.2, 3.6));
            //desired = Mat4.inverse(desired);
            //program_state.set_camera(desired.map((x, i) =>
            //Vector.from(program_state.camera_inverse[i]).mix(x, 0.1)));
            // program_state.camera_transform.
        }

        if (this.movebackward) {
            this.movebackward = 0;
            this.currentAngle -= 0.1;

            let desired2 = Mat4.look_at(vec3(0, 3 * Math.cos(this.currentAngle), 3 * Math.sin(this.currentAngle)),
                vec3(0, 1.1 * Math.cos(this.currentAngle),1.1 * Math.sin(this.currentAngle)),
                vec3(0, 3 * Math.cos(this.currentAngle + 90), 3 * Math.sin(this.currentAngle + 90)));

            program_state.set_camera(desired2.map((x, i) =>
                Vector.from(program_state.camera_inverse[i]).mix(x, 0.2)));
        }

        if(this.moveRight) {
            this.moveRight = 0;
            this.currentAngle -= 0.10; // idk have to fix this still

            let desired2 = Mat4.look_at(vec3(0, 3 * Math.cos(this.currentAngle), 3 * Math.sin(this.currentAngle)),
                vec3(0, 1.1 * Math.cos(this.currentAngle),1.1 * Math.sin(this.currentAngle)),
                vec3(0, 3 * Math.cos(this.currentAngle + 90), 3 * Math.sin(this.currentAngle + 90)));

            program_state.set_camera(desired2.map((x, i) =>
                Vector.from(program_state.camera_inverse[i]).mix(x, 0.2)));
        }

        */

        // draw head on character
        let model_transform_character_head = model_transform_character;
        model_transform_character_head = model_transform_character_head.times(Mat4.translation(0,1,0));
        model_transform_character_head = model_transform_character_head.times(Mat4.scale(0.5,0.5,0.5));

        // actual drawing
        this.shapes.character_body.draw(context, program_state, model_transform_character, this.materials.character);
        this.shapes.character_head.draw(context, program_state, model_transform_character_head, this.materials.character);
        // don't know if the planet position was changed so i'll use the other one
        // this.shapes.Planet.draw(context, program_state, model_transform_planet, this.materials.planet_surface.override({color: hex_color("#ffffff")}));
        this.shootingStars.rngStars()
        
        this.drawShapes(this.shootingStars.getStars(),context, program_state, model_transform_planet)
        this.drawShapes(this.suns.getSuns(),context, program_state, model_transform_planet)
        this.suns.updatePosition()
        this.shootingStars.moveStars()
    
       
        this.shapes.Planet.draw(context, program_state, model_transform_planet, this.materials.planet_surface.override({color: hex_color("#ffff00")}));

    }
}


