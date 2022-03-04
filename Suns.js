
import {defs, tiny} from './examples/common.js';


const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const {Cube, Phong_Shader,Subdivision_Sphere} = defs;

export class Suns {
    constructor() {

    this.DIST_FROM_CENTER = 10
    this.DIST_FROM_PLANET = 25 
    this.SUN_VELO = 0.002
    this.CENTER_VELO = 0.0005

    this.material = new Material(new Phong_Shader, {
        ambient: 0.8,
        diffusivity: 0, 
        specularity: 0
    })

    this.orbitCenter = {
        dist_from_planet: this.DIST_FROM_PLANET, 
        angle: 0
    }

    this.shapes = {
        Sun: new Subdivision_Sphere(4)
    }

    this.stars = this.populateStars();

    this.sun1 = {
        size: 8, 
        color: hex_color("#FFFFFF"), 
        light: {brightness: 1000}, 
        dist_from_center: this.DIST_FROM_CENTER, 
        angle: Math.PI / 2, 
        shape: this.shapes.Sun
    }

    this.sun2 = {
        size: 7, 
        color: hex_color("#CCCCFF"), 
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
        const sunOne = this.convertSunToXYZShape(this.sun1)
        const sunTwo = this.convertSunToXYZShape(this.sun2)
        return [sunOne, sunTwo]
    }
    

    convertSunToXYZShape(sun){
        return {
            x: this.orbitCenter.dist_from_planet * Math.cos(this.orbitCenter.angle) + 
               sun.dist_from_center * Math.cos(sun.angle), 
            y: this.orbitCenter.dist_from_planet * Math.sin(this.orbitCenter.angle) + 
            sun.dist_from_center * Math.sin(sun.angle), 
            z: 0, 
            color: sun.color, 
            size: sun.size, 
            light: sun.light, 
            shape: sun.shape, 
            material: this.material
        }
    }

    populateStars() {
        let stars = [];

        for (let i = 0; i < 1000; i++){
            const val = 20 + 20 * Math.random();
            if (val !== 0) {
                let starSize = 1/val;
                let dist = 10000 + Math.random() * 1000;

                let star = {
                    size: starSize,
                    color: hex_color("#FFFFFF"), 
                    light: {brightness: 1000}, 
                    dist_from_center: dist, 
                    shape: this.shapes.Sun
                };

                stars.push(this.convertStarToXYZShape(star));
            }
        }
        return stars;
    }

    convertStarToXYZShape(star){
        return {
            x: -35 + 70 * Math.random(), 
            y: -35 + 70 * Math.random(), 
            z: -25 + 50 * Math.random(), 
            color: star.color, 
            size: star.size, 
            light: 0, 
            shape: star.shape, 
            material: this.material
        }
    }

}