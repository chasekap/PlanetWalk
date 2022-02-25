
import {defs, tiny} from './examples/common.js';


const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture,Color
} = tiny;

const {Cube, Phong_Shader,Subdivision_Sphere} = defs

export class ShootingStars{
    constructor() {
    this.SPAWN_RATE = 0.5 / 30
    this.PLANET_RADIUS = 1 
    this.Velocity = 0.1
    this.atmosphere_radius = 5
    this.ShootingStars = []
    this.shapes = {
         
        star: new Subdivision_Sphere(4)
    }
    this.material = new Material(new Phong_Shader, {
        ambient: 0.8,
        diffusivity: 0, 
        specularity: 0
    })

    }
   
    rngStars(){
       if ( Math.random() < this.SPAWN_RATE){
           const star = {
               r: this.atmosphere_radius, 
               theta: Math.random() * Math.PI * 2 , 
               phi: Math.random() * Math.PI
           }
           this.ShootingStars.push(star)
       }
    }
    moveStars(){
        
        this.ShootingStars = this.ShootingStars.filter(star => {return this.PLANET_RADIUS < star.r})
        .map(star => {
            return {...star, r: star.r - this.Velocity}
        })
    }
    convertStarsToXYZShape(){
        return this.ShootingStars.map(star => {
            return {
                x: star.r * Math.cos(star.phi) * Math.sin(star.theta), 
                y: star.r * Math.sin(star.phi) * Math.sin(star.theta), 
                z: star.r * Math.cos(star.theta), 
                color: Color.of(Math.max(Math.random(), 0.7), Math.max(Math.random(), 0.7),Math.max(Math.random(), 0.7),1),
                shape: this.shapes.star, 
                material: this.material, 
                size: 0.1
            }
        })
    }
    getStars(){
        return this.convertStarsToXYZShape(); 
    }

}