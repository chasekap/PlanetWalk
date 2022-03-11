import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,Color
} = tiny;

const {Phong_Shader, Subdivision_Sphere} = defs;

export class Character {
    constructor() {

        this.PLANET_RADIUS = 3;
        this.THETA = 0;

        this.shapes = {
            character_body: new Subdivision_Sphere(4),
            character_head: new Subdivision_Sphere(4),
        }

        this.materials = {
            character: new Material(new Phong_Shader(), {
                ambient: 0.5, diffusivity: 0, specularity: 0.5,
                color: hex_color("C0C0C0"),
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

        this.temp = 1;
        this.jump_v = 0;
        this.downwards = false;
    }

    getCoords(){
        return this.coordinates
    }

    jumpCharacter() {
        if (this.temp <= 1 && this.temp >= .8 && !this.downwards){
            this.jump_v += 0.001;
            this.temp -= this.jump_v;
            if (this.temp <= .8){
                this.downwards = true;
            }
        } else {
            this.jump_v += 0.001;
            this.temp += this.jump_v;
            if (this.temp >= 1){
                this.jump = false;
                this.temp = 1;
                this.downwards = false; 
                this.jump_v = 0;
            }
        }
        return this.temp;
    }

    moveCharacter() {
        
        if (this.forward || this.right) {
            this.THETA += 0.03;
        }

        if (this.backward || this.left) {
            this.THETA -= 0.03;
        }

        return this.THETA;
    }
}