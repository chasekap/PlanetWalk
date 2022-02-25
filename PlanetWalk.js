import {defs, tiny} from './examples/common.js';
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
    }

  
    drawShapes(listOfShapes,context, program_state, model_transform){
        listOfShapes.forEach((shape) => {
            console.log(shape)
            if (shape.light){
                program_state.lights.push(new Light(vec4(shape.x,shape.y,shape.z, 1), color(1, 1, 1, 1), 100000 ))
            }
            model_transform = model_transform.times(Mat4.translation(shape.x,shape.y,shape.z))
            model_transform = model_transform.times(Mat4.scale(shape.size,shape.size,shape.size))
            this.shapes.Planet.draw(context, program_state, model_transform, shape.material.override({color: hex_color(shape.color)}))
           // program_state.lights = [new Light(light_position, color(1, 1, 1, 1), 1000)];
            model_transform = model_transform.times(Mat4.scale(1/shape.size,1/shape.size,1/shape.size))
            model_transform = model_transform.times(Mat4.translation(-1*shape.x,-1*shape.y,-1*shape.z))
            

            
        })
    }
    display(context, program_state) {
        
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.translation(0, -1, -2));
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 100);

        
        program_state.lights = [];

        let t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        let model_transform_planet = Mat4.identity();

        // Character matrices
        let model_transform_character = model_transform_planet;
        model_transform_character = model_transform_character.times(Mat4.translation(0,1.1,0));
        model_transform_character = model_transform_character.times(Mat4.scale(0.1,0.1,0.1));
        let model_transform_character_head = model_transform_character;
        model_transform_character_head = model_transform_character_head.times(Mat4.translation(0,1,0));
        model_transform_character_head = model_transform_character_head.times(Mat4.scale(0.5,0.5,0.5));


        this.shapes.character_body.draw(context, program_state, model_transform_character, this.materials.character);
        this.shapes.character_head.draw(context, program_state, model_transform_character_head, this.materials.character);
        // don't know if the planet position was changed so i'll use the other one
        // this.shapes.Planet.draw(context, program_state, model_transform_planet, this.materials.planet_surface.override({color: hex_color("#ffffff")}));

        this.drawShapes(this.suns.getSuns(),context, program_state, model_transform_planet)
        this.suns.updatePosition()
       
        this.shapes.Planet.draw(context, program_state, model_transform_planet, this.materials.planet_surface.override({color: hex_color("#ffff00")}));

    }
}


