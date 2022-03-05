
import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,Color
} = tiny;

const {Textured_Phong, Subdivision_Sphere} = defs;

export class Character {
    constructor() {

        this.planet_r = 1;

        this.shapes = {
            character_body: new Subdivision_Sphere(4),
            character_head: new Subdivision_Sphere(4),
        }

        this.materials = {
            character: new Material(new Textured_Phong(), {
                ambient: 0.2,
                color: hex_color("000000"),
                texture: new Texture("assets/11.png")
            })
        }
        this.coordinates = {
            x: 0, 
            y: 0, 
            z: 0, 
            r: 1, 
            phi: 0, 
            theta: 0
        }


        this.forward = 0;
        this.backward = 0;
        this.right = 0;
        this.left = 0;
        this.jump = 0;

    }
    getCoords(){
        return this.coordinates
    }
    moveCharacter(t) {
        let angle = 0;
        const mov_velocity = 2;
        const mov_acceleratetion = -0.5;
        const jump_velocity = 6;
        let character_v = mov_velocity - mov_acceleratetion*t;
        const g = -2;

        let x_pos = 0;
        let y_pos = 0;
        let z_pos = 0;

        if (this.forward) {
            //this.forward = !this.forward;
            y_pos = character_v * t;
        }

        if (this.backward) {
            this.backward = !this.backward;
            y_pos = -(character_v * t);
        }

        if (this.right) {
            this.right = !this.right;
            x_pos = character_v * t;
        }

        if (this.left) {
            this.left = !this.left;
            x_pos = -(character_v * t);
        }

        if (this.jump) {
            this.jump = !this.jump;
            z_pos = jump_velocity - (mov_acceleratetion*t);
        }

        return this.convertCharacterToSpherical(x_pos, y_pos, z_pos);
    }

    convertCharacterToSpherical(x,y,z) {
        return {x,y,z}
    }
}