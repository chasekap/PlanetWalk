
import {defs, tiny} from './examples/common.js';
import { PlanetWalk } from './PlanetWalk.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const {Cube, Axis_Arrows, Textured_Phong,Subdivision_Sphere} = defs

export class Suns {
    constructor() {

    this.DIST_FROM_CENTER = 10
    this.DIST_FROM_PLANET = 20
    this.SUN_VELO = 0.002
    this.CENTER_VELO = 0.0005

    this.orbitCenter = {
        dist_from_planet: this.DIST_FROM_PLANET, 
        angle: 0
    }

    this.shapes = {
        box_1: new Cube(),
        box_2: new Cube(), 
        Sun: new Subdivision_Sphere(4)
    }

    this.sun1 = {
        size: 6, 
        color: "#FFFFFF", 
        light: {brightness: 1000}, 
        dist_from_center: this.DIST_FROM_CENTER, 
        angle: Math.PI / 2, 
        shape: this.shapes.Sun
    }

    this.sun2 = {
        size: 7, 
        color: "#CCCCFF", 
        light: {brightness: 1000}, 
        dist_from_center: this.DIST_FROM_CENTER, 
        angle: 3 * Math.PI / 2, 
        shape: this.shapes.Sun
    }

    
}
    updatePosition(){
        this.sun1.angle += this.SUN_VELO
        this.sun2.angle += this.SUN_VELO
        this.orbitCenter.angle += this.CENTER_VELO
    }

    getSuns(){
    const sunOne = this.convertSunToXYZ(this.sun1)
    const sunTwo = this.convertSunToXYZ(this.sun2)
    return [sunOne, sunTwo]
    }
    

    convertSunToXYZ(sun){
        return {
            x: this.orbitCenter.dist_from_planet * Math.cos(this.orbitCenter.angle) + 
               sun.dist_from_center * Math.cos(sun.angle), 
            y: this.orbitCenter.dist_from_planet * Math.sin(this.orbitCenter.angle) + 
            sun.dist_from_center * Math.sin(sun.angle), 
            z: 0, 
            color: sun.color, 
            size: sun.size, 
            light: sun.light, 
            shape: sun.shape
        }
    }

}