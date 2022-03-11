import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,Color
} = tiny;

const {Phong_Shader, Subdivision_Sphere} = defs;

export class Character {
    constructor() {

        this.PLANET_RADIUS = 3;
        this.THETA = Math.PI / 2;
        this.PHI = Math.PI / 2;

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
            y: 1.1,
            z: 0, 
            r: 1.1,
            phi: Math.PI / 2,
            theta: Math.PI / 2
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
        
        if (this.forward) {
            this.THETA += 0.03;
            this.coordinates.theta -= 0.03;
        }
        if (this.right) {
            this.PHI += 0.03;
            this.coordinates.phi -= 0.03;
        }

        if (this.backward) {
            this.THETA -= 0.03;
            this.coordinates.theta += 0.03;
        }
        if (this.left) {
            this.PHI -= 0.03;
            this.coordinates.phi += 0.03;
        }
        this.coordinates.x = this.coordinates.r * Math.cos(this.coordinates.phi) * Math.sin(this.coordinates.theta);
        this.coordinates.y = this.coordinates.r * Math.sin(this.coordinates.phi) * Math.sin(this.coordinates.theta);
        this.coordinates.z = this.coordinates.r * Math.cos(this.coordinates.theta);
        //console.log(this.coordinates);
        return {for: this.THETA, side: this.PHI};

    }
}