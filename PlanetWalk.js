import {defs, tiny} from './examples/common.js';
import { ShootingStars } from './ShootingStars.js';
import { Suns } from './Suns.js';
import { Character } from './Character.js'

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const {Cube, Phong_Shader, Textured_Phong, Subdivision_Sphere} = defs

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
        this.character = new Character();

        this.shapes = {
            Planet: new Subdivision_Sphere(4),
        }

        this.materials = {
            planet_surface: new Material(new Textured_Phong(), {
                color: hex_color("#006400"),
                ambient: 0.1, diffusivity: 0, specularity: 0.5,
                texture: new Texture("assets/terrain.jpg"),
            })
        }

        this.initial_camera_location = Mat4.look_at(vec3(0, 10, 20), vec3(0, 0, 0), vec3(0, 1, 0));
        this.currentAngle = 0;
        this.prevMove = 0;
        this.prevAngle = 0;
    }

  
    drawShapes(listOfShapes, context, program_state, model_transform){
       
        listOfShapes.forEach((shape) => {

            if (shape.light){
                program_state.lights.push(new Light(vec4(shape.x,shape.y,shape.z, 1), color(1, 1, 1, 1), 1000 ));
            }
            if (shape.trail){
                // console.log(shape.trail)
                this.drawShapes(shape.trail, context,program_state,model_transform)
            }

            model_transform = model_transform.times(Mat4.translation(shape.x,shape.y,shape.z));
            model_transform = model_transform.times(Mat4.scale(shape.size,shape.size,shape.size));

            this.shapes.Planet.draw(context, program_state, model_transform, shape.material.override({color: shape.color}));

           // program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
            model_transform = model_transform.times(Mat4.scale(1/shape.size,1/shape.size,1/shape.size));
            model_transform = model_transform.times(Mat4.translation(-1*shape.x,-1*shape.y,-1*shape.z));
        })
    }

    getPrev(){
        if (this.character.forward || this.character.backward || this.character.left || this.character.right){
            if (this.character.forward){
                this.prevMove = 'forward';
            }

            else if (this.character.backward){
                this.prevMove = 'backward';
            }

            else if (this.character.left){
                this.prevMove = 'left';
            }

            else if (this.character.right){
                this.prevMove = 'right';
            }
        }

        else {
            this.prevMove = null;
        }
    }

    stopMovement(move){

        if (move === 'forward'){
            this.character.backward = 0;
            this.character.left = 0;
            this.character.right = 0;
        }

        else if (move === 'backward'){
            this.character.forward = 0;
            this.character.left = 0;
            this.character.right = 0;
        }

        else if (move === 'left'){
            this.character.forward = 0;
            this.character.backward = 0;
            this.character.right = 0;
        }

        else if (move === 'right'){
            this.character.forward = 0;
            this.character.left = 0;
            this.character.backward = 0;
        }
    }

    // control panel for movement back and forth
    make_control_panel() {
        // move forward with 'i'
        this.key_triggered_button("Move forward", ["i"], () => {
            this.getPrev();
            this.prevAngle = this.character.THETA;
            this.character.forward = !this.character.forward;
            this.stopMovement('forward');
        });
        this.new_line();

        // move to the right with 'j'
        this.key_triggered_button("Move left", ["j"], () => {
            this.getPrev();
            this.prevAngle = this.character.THETA;
            this.character.left = !this.character.left;
            this.stopMovement('left');
        });

        // move to the right with 'l'
        this.key_triggered_button("Move right", ["l"], () => {
            this.getPrev();
            this.prevAngle = this.character.THETA;
            this.character.right = !this.character.right;
            this.stopMovement('right');
        });
        this.new_line();

        // move back with 'k'
        this.key_triggered_button("Move backward", ["k"], () => {
            this.getPrev();
            this.prevAngle = this.character.THETA;
            this.character.backward = !this.character.backward;
            this.stopMovement('backward');
        });
        this.new_line();

        // jump with ';'
        this.key_triggered_button("Jump", [";"], () => {
            this.character.jump = !this.character.jump;
        });
        this.new_line();

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
        this.character.time += 1;

        let model_transform_planet = Mat4.identity();
        let model_transform_character = model_transform_planet;

        let angle = this.character.moveCharacter(t);

        // transform character
        model_transform_character = model_transform_character.times(Mat4.scale(0.1,0.1,0.1));

        console.log(this.prevAngle)
        console.log(this.prevMove)

        if (this.prevMove !== null) {

            if (this.prevMove === 'forward' || this.prevMove === 'backward'){
                model_transform_character = model_transform_character.times(Mat4.rotation(this.prevAngle, 1, 0, 0));
            }

            else if (this.prevMove === 'right' || this.prevMove === 'left'){
                model_transform_character = model_transform_character.times(Mat4.rotation(this.prevAngle, 1, 0, 90));
            }

        }

        if (this.character.forward || this.character.backward){
            model_transform_character = model_transform_character.times(Mat4.rotation(angle, 1, 0, 0));
        }

        else if (this.character.right || this.character.left) {
            model_transform_character = model_transform_character.times(Mat4.rotation(angle, 1, 0, 90));
        }

        model_transform_character = model_transform_character.times(Mat4.translation(0,11,0));
                                                                    
        // transform head on character
        let model_transform_character_head = model_transform_character;
        model_transform_character_head = model_transform_character_head.times(Mat4.translation(0,1,0))
                                                                       .times(Mat4.scale(0.5,0.5,0.5));

        // draw character
        this.character.shapes.character_body.draw(context, program_state, model_transform_character, this.character.materials.character);
        this.character.shapes.character_head.draw(context, program_state, model_transform_character_head, this.character.materials.character);

        this.shootingStars.rngStars();
        this.drawShapes(this.shootingStars.getStars(), context, program_state, model_transform_planet);
        this.drawShapes(this.suns.getSuns(), context, program_state, model_transform_planet);
        this.drawShapes(this.suns.stars, context, program_state, model_transform_planet);
        this.suns.updatePosition();
        this.shootingStars.moveStars();
        this.shapes.Planet.draw(context, program_state, model_transform_planet, this.materials.planet_surface.override({color: hex_color("#ffff00")}));

    }
}


